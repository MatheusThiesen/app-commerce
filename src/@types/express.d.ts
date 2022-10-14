declare module "http" {
  interface IncomingHttpHeaders {
    Authorization?: string;
  }
}
