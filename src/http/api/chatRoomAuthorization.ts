import chalk from "chalk";
import { ServerResponse } from "http";
import { RequestDataType } from "../../commonTypes/HttpServerTypes.js";
import { clientDataValidation } from "../../helpers/clientDataValidation.js";
import { jsonStringify as s } from "../../helpers/jsonStringify.js";
import { logObject } from "../../helpers/logging.js";
import { getChatRoomById } from "../chatRoom.js";

function chatRoomAuthorization(res: ServerResponse, reqData: RequestDataType) {
  const {
    body: { chatRoomId, clientId },
    token,
  } = reqData;
  try {
    // Throws in case of failure in check.
    clientDataValidation(chatRoomId, clientId, token);
    const isAdmin = getChatRoomById(chatRoomId)?.isAdmin(clientId, token)
      ? "isAdmin"
      : "notAdmin";
    res.writeHead(200).end(s({ isAdmin }));
  } catch (e: any) {
    console.log(
      logObject("Auth failure : ", "red", {
        "Chat room id": chatRoomId,
        "Client id": clientId,
      })
    );

    res.writeHead(401).end(e.message);
  }
}

export { chatRoomAuthorization };
