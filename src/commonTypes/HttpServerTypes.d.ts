import { ServerResponse } from "http";
import { ParsedUrlQuery } from "querystring";

export type RouterType = {
  [key: string]: (res: ServerResponse, reqData?: any) => void;
};

export type RequestDataType = {
  path: string;
  headers: IncomingHeaders;
  token: string;
  method? : string,
  query : ParsedUrlQuery,
  body : {[key: string] : any},
}
