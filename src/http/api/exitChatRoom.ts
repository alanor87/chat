import { ServerResponse } from "http";
import { RequestDataType } from "../../commonTypes/HttpServerTypes.js";
import { clientDataValidation } from "../../helpers/clientDataValidation.js";
import { deleteChatRoom, getChatRoomById } from "../chatRoom.js";

function exitChatRoom(res: ServerResponse, reqData: RequestDataType) {
  const {
    body: { chatRoomId, clientId },
    token,
  } = reqData;
  try {
    clientDataValidation(chatRoomId, clientId, token);

    const chatRoom = getChatRoomById(chatRoomId);
    const client = chatRoom?.getClientById(clientId);

    const announcementMessage = {
      method: 'announcement_broadcast',
      data : {
        message: client?.nickname + ' has left the chat room.', reason: 'client_exit'
      }
    }

    chatRoom?.broadcast(announcementMessage);
    chatRoom?.deleteClient(clientId);

    if (chatRoom?.isAdmin(clientId, token)) {
      deleteChatRoom(chatRoomId, "Admin has left, chat room is deleted.");
      return;
    }

    if (chatRoom?.clients.length === 0) {
      deleteChatRoom(
        chatRoomId,
        "Chat room " + chatRoom.id + " is empty and is being deleted."
      );
      return;
    }
  } catch (e: any) {
    console.error("Exit chat room failed, clinetId : ", clientId, e);
  } finally {
    res.end();
  }
}

export { exitChatRoom };
