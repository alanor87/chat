import { createServer, Server } from "http";
import path from "path";
import { StringDecoder } from "string_decoder";
import fs from "fs";
import url from "url";
import { RequestDataType } from "../commonTypes/HttpServerTypes.js";
import { jsonParse as p } from "../helpers/jsonParse.js";
import { router } from "./httpRouter.js";

// const httpsOptions = {
//   key: fs.readFileSync(
//     path.join(process.cwd(), "/dist/ssl/key.pem")
//   ),
//   cert: fs.readFileSync(
//     path.join(process.cwd(), "/dist/ssl/cert.pem")
//   ),
// };

export const httpServer = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.BASE_URL as string);
  const decode = new StringDecoder("utf-8");
  let buffer = "";
  try {
    req
      .on("data", (data) => {
        buffer += decode.write(data);
      })
      .on("end", () => {
        if (!req.url) {
          router[""](res, { path: "" });
          return;
        }
        // Getting data stream for body of request.
        buffer += decode.end();
        // Parsing url.
        const { method, headers } = req;
        const parsedUrl = url.parse(req.url, true);
        const { pathname, query } = parsedUrl;
        const body = buffer ? p(buffer) : {};

        // Getting path in form of */* string, or empty string.
        const path = pathname ? pathname.replace(/^\/+|\/$/, "") : "";

        // Forming data object to pass to further processing.
        const reqData: RequestDataType = {
          path,
          headers,
          method,
          query,
          body,
        };

        // when requesting static public assets.
        if (path.includes("public/")) {
          router["public"](res, reqData);
          return;
        }
        // Case when there is no such route.
        if (!router.hasOwnProperty(path)) {
          router["notFound"](res, reqData);
          return;
        }

        // Further processing of data depending on the route.
        router[path](res, reqData);
      });
  } catch (e: any) {
    console.log(e.message);
    res.writeHead(500);
    res.end("Something went wrong! " + e.message);
  }
});

export function httpServerInit(PORT: number) {
  httpServer.listen(PORT, () => {
    console.log("http server is running on port ", PORT);
  });
}
