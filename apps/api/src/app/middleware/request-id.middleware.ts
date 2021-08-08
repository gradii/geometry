import { v4 as uuidv4 } from 'uuid'

export function requestIdMiddleware(genFn: () => string = uuidv4 ) {
  return (req: any, res: any, next: () => void) => {
    const requestId = req.header("x-request-id") || genFn();
    // make sure this is lower-cased, otherwise downstream stuff will barf.
    req.headers["x-request-id"] = requestId;
    res.set("X-Request-Id", requestId);
    next();
  }
}
