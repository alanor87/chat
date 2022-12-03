import { ServerResponse } from "http";
import { clientDataValidation } from "../../helpers/clientDataValidation.js";
import { jsonStringify as s } from "../../helpers/jsonStringify.js";
import { getChatRoomById } from "../chatRoom.js";

function chatRoomAuthorization(res: ServerResponse, reqData: any) {
  try {
    const { headers, body } = reqData;
    const { chatRoomId, clientId } = body;
    const token = headers.authorization.split(" ")[1];
    // Throws in case of failure in check.
    clientDataValidation(chatRoomId, clientId, token);
    const isAdmin = getChatRoomById(chatRoomId)?.isAdmin(clientId, token) ? 'isAdmin' : 'notAdmin';
    res.writeHead(200).end(s({isAdmin}));
  } catch (e: any) {
    console.log(e.message);
    res.writeHead(401).end(e.message);
  }
}

export { chatRoomAuthorization };
