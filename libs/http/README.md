# @gradii/http

A reactive HTTP client in the form of `@angular/common/http`, offers the following major features:

- The ability to request [typed response objects](https://angular.io/guide/http#typed-response).
- Streamlined [error handling](https://angular.io/guide/http#error-handling).
- Request and response [interception](https://angular.io/guide/http#intercepting-requests-and-responses).
- Default support but not limited to `XMLHttpRequest`, `Fetch API` and `WeChatMiniProgram`.

## Prerequisites

Before working with the `@gradii/http`, you should have a basic understanding of the following:

- JavaScript / TypeScript programming.
- Usage of the HTTP protocol.
- [RxJS](https://rxjs.dev/guide/overview) Observable techniques and operators. See the [Observables](https://angular.io/guide/observables) guide.

## API

For the full API definition, please visit [https://ngify.github.io/ngify](https://ngify.github.io/ngify/modules/_ngify_http.html).

## Basic usage

```ts
import { HttpClient, HttpContext, HttpContextToken, HttpHeaders, HttpParams } from '@gradii/http';
import { filter } from 'rxjs';

const http = new HttpClient();

http.get<{ code: number, data: any, msg: string }>('url', 'k=v').pipe(
  filter(({ code }) => code === 0)
).subscribe(res => console.log(res));

http.post('url', { k: 'v' }).subscribe(res => console.log(res));

const HTTP_CACHE_TOKEN = new HttpContextToken(() => 1800000);

http.put('url', null, {
  context: new HttpContext().set(HTTP_CACHE_TOKEN)
}).subscribe(res => console.log(res));

http.patch('url', null, {
  params: { k: 'v' }
}).subscribe(res => console.log(res));

http.delete('url', new HttpParams('k=v'), {
  headers: new HttpHeaders({ Authorization: 'token' })
}).subscribe(res => console.log(res));
```

## Intercepting requests and responses

With interception, you declare interceptors that inspect and transform HTTP requests from your application to a server. The same interceptors can also inspect and transform a server's responses on their way back to the application. Multiple interceptors form a forward-and-backward chain of request/response handlers.

> `@gradii/http` applies interceptors in the order that you provide them。

```ts
import { HttpClient, HttpHandler, HttpRequest, HttpEvent, HttpInterceptor } from '@gradii/http';
import { Observable, map } from 'rxjs';

const http = new HttpClient([
  new class implements HttpInterceptor {
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      // Clone the request to modify request parameters
      request = request.clone({
        headers: request.headers.set('Authorization', 'token')
      });

      return next.handle(request);
    }
  },
  {
    intercept(request: HttpRequest<unknown>, next: HttpHandler) {
      request = request.clone({
        params: request.params.set('k', 'v')
      });

      console.log('Request after interception', request);

      return next.handle(request).pipe(
        tap(response => console.log('Response after interception', response))
      );
    }
  }
]);
```

Although interceptors are capable of modifying requests and responses, the `HttpRequest` and `HttpResponse` instance properties are `readonly`, rendering them largely immutable.

> They are immutable for a good reason: an app might retry a request several times before it succeeds, which means that the interceptor chain can re-process the same request multiple times.
If an interceptor could modify the original request object, the re-tried operation would start from the modified request rather than the original.
Immutability ensures that interceptors see the same request for each try.

If you must alter a request, clone it first and modify the clone before passing it to `next.handle()`.

## Replace HTTP backend class

`@gradii/http` has the following HTTP backends built in:

| HTTP backend class | Description                          |
| ------------------ | ------------------------------------ |
| `HttpXhrBackend`   | HTTP requests using `XMLHttpRequest` |
| `HttpFetchBackend` | HTTP requests using `Fetch API`      |
| `HttpWxBackend`    | HTTP request in `WeChatMiniProgram`  |

By default, `HttpXhrBackend` is used, and you can switch to other HTTP backend class by modifying the configuration:

```ts
import { HttpFetchBackend, HttpWxBackend, setupConfig } from '@gradii/http';

setupConfig({
  backend: new HttpFetchBackend()
});
```

You can also use a custom `HttpBackend` implementation class:

```ts
import { HttpBackend, HttpClient, HttpRequest, HttpEvent, setupConfig } from '@gradii/http';
import { Observable } from 'rxjs';

// You need to implement the HttpBackend interface
class CustomHttpBackend implements HttpBackend {
  handle(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    // ...
  }
}

setupConfig({
  backend: new CustomHttpBackend()
});
```

If you need to configure `HttpClient` separately for a `HttpBackend`, you can pass in the second parameter of the `HttpBackend` constructor:

```ts
const http = new HttpClient(null, new CustomHttpBackend())
```

## Use in Node.js

`@gradii/http` uses the browser's `XMLHttpRequest` and `Fetch API` by default. To use in Node.js, you need to do the following steps:

### XMLHttpRequest

If you need to use `XMLHttpRequest` in Node.js environment, you can use [xhr2](https://www.npmjs.com/package/xhr2), which implements [W3C XMLHttpRequest](https://www.w3.org/TR/XMLHttpRequest/) specification.
<br>
To use [xhr2](https://www.npmjs.com/package/xhr2) , you need to create a factory function that returns an `XMLHttpRequest` instance and pass it as a parameter to the `HttpXhrBackend` constructor:

```ts
import { HttpXhrBackend, setupConfig } from '@gradii/http';
import * as xhr2 from 'xhr2';

setupConfig({
  backend: new HttpXhrBackend(() => new xhr2.XMLHttpRequest())
});
```

### Fetch API

If you need to use `Fetch API` in Node.js environment, you can use [node-fetch](https://www.npmjs.com/package/node-fetch) and [abort-controller](https://www.npmjs.com/package/abort-controller).
<br>
To apply them, you need to add them to `global` of `Node.js` respectively:

```ts
import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import { HttpFetchBackend, HttpWxBackend, setupConfig } from '@gradii/http';

global.fetch = fetch;
global.AbortController = AbortController;

setupConfig({
  backend: new HttpFetchBackend()
});
```

## Pass extra parameters

In order to keep the API uniform, some extra parameters need to be passed through `HttpContext`.

### Extra parameters for Fetch API

```ts
import { HttpContext, FETCH_TOKEN } from '@gradii/http';

// ...

// Fetch API allows cross-origin requests
http.get('url', null, {
  context: new HttpContext().set(FETCH_TOKEN, {
    mode: 'cors',
    // ...
  })
});
```

### Extra parameters for WeChatMiniProgram

```ts
import { HttpContext, WX_UPLOAD_FILE_TOKEN, WX_DOWNLOAD_FILE_TOKEN, WX_REQUSET_TOKEN } from '@gradii/http';

// ...

// WeChatMiniProgram enables HTTP2
http.get('url', null, {
  context: new HttpContext().set(WX_REQUSET_TOKEN, {
    enableHttp2: true,
  })
});

// WeChatMiniProgram file upload
http.post('url', null, {
  context: new HttpContext().set(WX_UPLOAD_FILE_TOKEN, {
    filePath: 'filePath',
    fileName: 'fileName'
  })
});

// WeChatMiniProgram file download
http.get('url', null, {
  context: new HttpContext().set(WX_DOWNLOAD_FILE_TOKEN, {
    filePath: 'filePath'
  })
});
```

## More

For more usage, please visit [https://angular.io](https://angular.io/guide/http).
