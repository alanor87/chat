var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from "fs/promises";
import { staticAssetsInterpolation } from "../helpers/staticAssetsInterpolation.js";
import { createChatRoom } from "./api/createChatRoom.js";
import { joinChatRoom } from "./api/joinChatRoom.js";
import { exitChatRoom } from "./api/exitChatRoom.js";
import { chatRoomAuthorization } from "./api/chatRoomAuthorization.js";
export const router = {
    "": (res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fs
                .readFile(process.cwd() + "/dist/public/index/index.html", "utf-8")
                .then((text) => staticAssetsInterpolation("BASE_URL", text));
            res
                .setHeader("code", 200)
                .setHeader("content-type", "text/html")
                .end(response);
        }
        catch (e) {
            console.error(e);
            throw new Error(e.message);
        }
    }),
    ["chatRoom"]: (res, reqData) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fs
            .readFile(process.cwd() + "/dist/public/chatRoom/index.html", "utf-8")
            .then((text) => staticAssetsInterpolation("BASE_URL", text));
        res
            .setHeader("code", 200)
            .setHeader("content-type", "text/html")
            .end(response);
    }),
    ["public"]: (res, reqData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const assetPath = process.cwd() + "/dist/" + reqData.path;
            const response = yield fs
                .readFile(assetPath, "utf-8")
                .then((text) => staticAssetsInterpolation("BASE_URL", text));
            let contentType = "text/plain";
            if (reqData.path.includes(".css"))
                contentType = "text/css";
            if (reqData.path.includes(".jpg"))
                contentType = "image/jpeg";
            if (reqData.path.includes(".png"))
                contentType = "image/png";
            if (reqData.path.includes(".ico"))
                contentType = "image/x-icon";
            if (reqData.path.includes(".js"))
                contentType = "text/javascript";
            if (reqData.path.includes(".svg"))
                contentType = "image/svg+xml";
            res
                .setHeader("code", 200)
                .setHeader("content-type", contentType)
                .end(response);
        }
        catch (e) {
            res.setHeader("code", 500).end("Something went wrong(");
        }
    }),
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
