// Ambient module declarations to satisfy TypeScript for Encore path aliases
// These are lightweight shims for editor/linter compatibility and do not affect runtime.

declare module "encore.dev/api" {
  export type CookieWithOptions<T> = T & { options?: any };
  export type StreamInOutHandlerFn<A, Req, Resp> = (...args: any[]) => any;
  export type StreamInHandlerFn<A, Req, Resp> = (...args: any[]) => any;
  export type StreamOutHandlerFn<A, Resp> = (...args: any[]) => any;
}

declare module "~backend/*" {
  const anyModule: any;
  export = anyModule;
}

declare module "~encore/*" {
  const anyModule: any;
  export = anyModule;
}