import { getChatRoomById } from "../http/chatRoom.js";
import { tokenValidation } from "./jwt.js";

/** Validation by chat room, client id in this chat room and his token. Throws in case of failure. */
function clientDataValidation(
  chatRoomId: string,
  clientId: string,
  token: string
) {
  const client = getChatRoomById(chatRoomId)?.getClientById(clientId);
  if (!client) throw Error("Chat room or client does not exist.");
  if (!tokenValidation(token, client)) throw Error("Invalid token.");
}

export { clientDataValidation };
