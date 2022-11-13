import { getChatRoomById } from "../http/chatRoom.js";
import { tokenValidation } from "./jwt.js";
/** Validation by chat room, client id in this chat room and his token. Throws in case of failure. */
function clientDataValidation(chatRoomId, clientId, token) {
    var _a;
    const client = (_a = getChatRoomById(chatRoomId)) === null || _a === void 0 ? void 0 : _a.getClientById(clientId);
    if (!client)
        throw Error("Chat room or client does not exist.");
    if (!tokenValidation(token, client))
        throw Error("Invalid token.");
}
export { clientDataValidation };
