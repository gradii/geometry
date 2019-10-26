import { querystring, querystringify } from './query-stringify';
import { requiresPort } from './requires-port';

const protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i;
const slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
const rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address) {          // Sanitize what is left of the address
    return address.replace('\\', '/');
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 */
const ignore = {hash: 1, query: 1};

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param relative Pathname of the relative URL.
 * @param base Pathname of the base URL.
 * @return Resolved pathname.
 */
function resolve(relative, base) {
  const path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'));
  let i = path.length;
  const last = path[i - 1];
  let unshift = false;
  let up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param address URL we want to parse.
 * @param [location] Location defaults for relative paths.
 * @param [parser] Parser for the query string.
 */
class Url {

  public slashes;
  public host;
  public hostname;
  public protocol;
  public port;
  public query;
  public pathname;
  public hash: string;
  private auth: any;
  private username: string;
  private password: string;
  private origin: string;

  constructor(address, location?, parser?: Function) {
    let relative;
    let extracted;
    let parse;
    let instruction;
    let index;
    let key;
    const instructions = rules.slice();
    const type = typeof location;
    let i = 0;

    //
    // The following if statements allows this module two have compatibility with
    // 2 different API:
    //
    // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
    //    where the boolean indicates that the query string should also be parsed.
    //
    // 2. The `URL` interface of the browser which accepts a URL, object as
    //    arguments. The supplied object will be used as default values / fall-back
    //    for relative paths.
    //
    if ('object' !== type && 'string' !== type) {
      parser = location;
      location = null;
    }

    if (parser && 'function' !== typeof parser) parser = querystring;

    location = Url.lolcation(location);

    //
    // Extract protocol information before running the instructions.
    //
    extracted = Url.extractProtocol(address);
    relative = !extracted.protocol && !extracted.slashes;
    this.slashes = extracted.slashes || relative && location.slashes;
    this.protocol = extracted.protocol || location.protocol || '';
    address = extracted.rest;

    //
    // When the authority component is absent the URL starts with a path
    // component.
    //
    if (!extracted.slashes) instructions[3] = [/(.*)/, 'pathname'];

    for (; i < instructions.length; i++) {
      instruction = instructions[i];

      if (typeof instruction === 'function') {
        address = instruction(address);
        continue;
      }

      parse = instruction[0];
      key = instruction[1];

      if (parse !== parse) {
        this[key] = address;
      } else if ('string' === typeof parse) {
        if (~(index = address.indexOf(parse))) {
          if ('number' === typeof instruction[2]) {
            this[key] = address.slice(0, index);
            address = address.slice(index + instruction[2]);
          } else {
            this[key] = address.slice(index);
            address = address.slice(0, index);
          }
        }
      } else if ((index = parse.exec(address))) {
        this[key] = index[1];
        address = address.slice(0, index.index);
      }

      this[key] = this[key] || (
        relative && instruction[3] ? location[key] || '' : ''
      );

      //
      // Hostname, host and protocol should be lowercased so they can be used to
      // create a proper `origin`.
      //
      if (instruction[4]) this[key] = this[key].toLowerCase();
    }

    //
    // Also parse the supplied query string in to an object. If we're supplied
    // with a custom parser as function use that instead of the default build-in
    // parser.
    //
    if (parser) this.query = parser(this.query);

    //
    // If the URL is relative, resolve the pathname against the base URL.
    //
    if (
      relative
      && location.slashes
      && this.pathname.charAt(0) !== '/'
      && (this.pathname !== '' || location.pathname !== '')
    ) {
      this.pathname = resolve(this.pathname, location.pathname);
    }

    //
    // We should not add port numbers if they are already the default port number
    // for a given protocol. As the host also contains the port number we're going
    // override it with the hostname which contains no port number.
    //
    if (!requiresPort(this.port, this.protocol)) {
      this.host = this.hostname;
      this.port = '';
    }

    //
    // Parse down the `auth` for the username and password.
    //
    this.username = this.password = '';
    if (this.auth) {
      instruction = this.auth.split(':');
      this.username = instruction[0] || '';
      this.password = instruction[1] || '';
    }

    this.origin = this.protocol && this.host && this.protocol !== 'file:'
      ? `${this.protocol}//${this.host}`
      : 'null';
  }

  public get href() {
    return this.toString();
  }

  /**
   * Extract protocol information from a URL with/without double slash ("//").
   *
   * @param address URL we want to extract from.
   * @return Extracted information.
   */
  static extractProtocol(address = '') {
    const match = protocolre.exec(address);

    return {
      protocol: match[1] ? match[1]!.toLowerCase() : '',
      slashes : !!match[2],
      rest    : match[3]
    };
  }

  /**
   * The location object differs when your code is loaded through a normal page,
   * Worker or through a worker using a blob. And with the blobble begins the
   * trouble as the location object will contain the URL of the blob, not the
   * location of the page where our code is loaded in. The actual origin is
   * encoded in the `pathname` so we can thankfully generate a good "default"
   * location from it so we can generate proper relative URL's again.
   *
   * @param loc Optional default location object.
   * @returns lolcation object.
   * @public
   */
  static lolcation(loc): Url | { slashes: string, protocol: string, [key: string]: any } {
    let globalVar;

    if (typeof window !== 'undefined') globalVar = window;
    // @ts-ignore
    else if (typeof global !== 'undefined') globalVar = global;
    else if (typeof self !== 'undefined') globalVar = self;
    else globalVar = {};

    const location = globalVar.location || {};
    loc = loc || location;

    const type = typeof loc;
    let key;

    if ('blob:' === loc.protocol) {
      return new Url(unescape(loc.pathname), {});
    } else if ('string' === type) {
      let finaldestination = new Url(loc, {});
      for (key in ignore) {
        delete finaldestination[key];
      }
      return finaldestination;
    } else if ('object' === type) {
      let finaldestination: any = {};

      for (key in loc) {
        if (key in ignore) continue;
        finaldestination[key] = loc[key];
      }

      if (finaldestination.slashes === undefined) {
        finaldestination.slashes = slashes.test(loc.href);
      }
      return finaldestination;
    }
  }

  /**
   * This is convenience method for changing properties in the URL instance to
   * insure that they all propagate correctly.
   *
   * @param part          Property we need to adjust.
   * @param value          The newly assigned value.
   * @param fn  When setting the query, it will be the function
   *                               used to parse the query.
   *                               When setting the protocol, double slash will be
   *                               removed from the final url if it is true.
   * @returns URL instance for chaining.
   * @public
   */
  set(part, value, fn) {

    switch (part) {
      case 'query':
        if ('string' === typeof value && value.length) {
          value = (fn || querystring)(value);
        }

        this[part] = value;
        break;

      case 'port':
        this[part] = value;

        if (!requiresPort(value, this.protocol)) {
          this.host = this.hostname;
          this[part] = '';
        } else if (value) {
          this.host = `${this.hostname}:${value}`;
        }

        break;

      case 'hostname':
        this[part] = value;

        if (this.port) value += `:${this.port}`;
        this.host = value;
        break;

      case 'host':
        this[part] = value;

        if (/:\d+$/.test(value)) {
          value = value.split(':');
          this.port = value.pop();
          this.hostname = value.join(':');
        } else {
          this.hostname = value;
          this.port = '';
        }

        break;

      case 'protocol':
        this.protocol = value.toLowerCase();
        this.slashes = !fn;
        break;

      case 'pathname':
      case 'hash':
        if (value) {
          const char = part === 'pathname' ? '/' : '#';
          this[part] = value.charAt(0) !== char ? char + value : value;
        } else {
          this[part] = value;
        }
        break;

      default:
        this[part] = value;
    }

    for (let i = 0; i < rules.length; i++) {
      const ins = rules[i];

      if (ins[4]) this[ins[1]] = this[ins[1]].toLowerCase();
    }

    this.origin = this.protocol && this.host && this.protocol !== 'file:'
      ? `${this.protocol}//${this.host}`
      : 'null';

    return this;
  }

  /**
   * Transform the properties back in to a valid and full URL string.
   *
   * @param stringify Optional query stringify function.
   * @returns Compiled version of the URL.
   * @public
   */
  toString(stringify?) {
    if (!stringify || 'function' !== typeof stringify) stringify = querystringify;

    let query;
    let protocol = this.protocol;

    if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

    let result = protocol + (this.slashes ? '//' : '');

    if (this.username) {
      result += this.username;
      if (this.password) result += `:${this.password}`;
      result += '@';
    }

    result += this.host + this.pathname;

    query = 'object' === typeof this.query ? stringify(this.query) : this.query;
    if (query) result += '?' !== query.charAt(0) ? `?${query}` : query;

    if (this.hash) result += this.hash;

    return result;
  }
}

export function parseUrl(address, location?, parser?) {
  return new Url(address, location, parser);
}
