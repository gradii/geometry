import {createHash} from 'crypto';
import base64url from './base64url';

const normalize = (cert) => cert.replace(/(?:-----(?:BEGIN|END) CERTIFICATE-----|\s|=)/g, '');
const calculate = (hash, cert) => base64url.encodeBuffer(createHash(hash).update(Buffer.from(normalize(cert), 'base64')).digest());

export let x5t = calculate.bind(undefined, 'sha1');
module.exports['x5t#S256'] = calculate.bind(undefined, 'sha256');
