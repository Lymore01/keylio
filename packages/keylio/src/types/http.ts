import { Cookie } from "../config";

export type HttpRequest = {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
  cookies: any;
};

export type HttpResponse = {
  status: number;
  body: any;
  headers?: Record<string, string>;
};
