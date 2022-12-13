import { RouterType } from "../commonTypes/HttpServerTypes.js";
import * as fs from "fs/promises";
import { staticAssetsInterpolation } from "../helpers/staticAssetsInterpolation.js";
import { createChatRoom } from "./api/createChatRoom.js";
import { joinChatRoom } from "./api/joinChatRoom.js";
import { exitChatRoom } from "./api/exitChatRoom.js";
import { chatRoomAuthorization } from "./api/chatRoomAuthorization.js";

export const router: RouterType = {
  "": async (res) => {
    try {
      const response = await fs
        .readFile(process.cwd() + "/dist/public/index/index.html", "utf-8")
        .then((text) => staticAssetsInterpolation("BASE_URL", text));
      res
        .setHeader("code", 200)
        .setHeader("content-type", "text/html")
        .end(response);
    } catch (e: any) {
      console.error(e);
      throw new Error(e.message);
    }
  },

  ["chatRoom"]: async (res, reqData) => {
    const response = await fs
      .readFile(process.cwd() + "/dist/public/chatRoom/index.html", "utf-8")
      .then((text) => staticAssetsInterpolation("BASE_URL", text));
    res
      .setHeader("code", 200)
      .setHeader("content-type", "text/html")
      .end(response);
  },

  ["public"]: async (res, reqData) => {
    try {
      const assetPath = process.cwd() + "/dist/" + reqData.path;
      const response = await fs
        .readFile(assetPath, "utf-8")
        .then((text) => staticAssetsInterpolation("BASE_URL", text));

      let contentType = "text/plain";
      if (reqData.path.includes(".css")) contentType = "text/css";
      if (reqData.path.includes(".jpg")) contentType = "image/jpeg";
      if (reqData.path.includes(".png")) contentType = "image/png";
      if (reqData.path.includes(".ico")) contentType = "image/x-icon";
      if (reqData.path.includes(".js")) contentType = "text/javascript";
      if (reqData.path.includes(".svg")) contentType = "image/svg+xml";

      res
        .setHeader("code", 200)
        .setHeader("content-type", contentType)
        .end(response);
    } catch (e) {
      res.setHeader("code", 500).end("Something went wrong(");
    }
  },

  ["api/createChatRoom"]: createChatRoom,
  ["api/joinChatRoom"]: joinChatRoom,
  ["api/exitChatRoom"]: exitChatRoom,

  ["api/chatRoomAuthorization"]: chatRoomAuthorization,

  ["api/getClients"]: (res, reqData) => {
    res.setHeader("content-type", "application/json");
  },
  notFound: (res) => {
    res.setHeader("code", 404);
    res.end("Not found.");
  },
};
