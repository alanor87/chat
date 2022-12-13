import { clientDataValidation } from "../../helpers/clientDataValidation.js";
import { deleteChatRoom, getChatRoomById } from "../chatRoom.js";
function exitChatRoom(res, reqData) {
    const { body: { chatRoomId, clientId }, token, } = reqData;
    try {
        clientDataValidation(chatRoomId, clientId, token);
        const chatRoom = getChatRoomById(chatRoomId);
        const client = chatRoom === null || chatRoom === void 0 ? void 0 : chatRoom.getClientById(clientId);
        const announcementMessage = {
            method: 'announcement_broadcast',
            data: {
                message: (client === null || client === void 0 ? void 0 : client.nickname) + ' has left the chat room.'
            }
        };
        chatRoom === null || chatRoom === void 0 ? void 0 : chatRoom.broadcast(announcementMessage);
        chatRoom === null || chatRoom === void 0 ? void 0 : chatRoom.deleteClient(clientId);
        if (chatRoom === null || chatRoom === void 0 ? void 0 : chatRoom.isAdmin(clientId, token)) {
            deleteChatRoom(chatRoomId, "Admin has left, chat room is deleted.");
            return;
        }
        if ((chatRoom === null || chatRoom === void 0 ? void 0 : chatRoom.clients.length) === 0) {
            deleteChatRoom(chatRoomId, "Chat room " + chatRoom.id + " is empty and is being deleted.");
            return;
        }
    }
    catch (e) {
        console.error("Exit chat room failed, clinetId : ", clientId, e);
    }
    finally {
        res.end();
    }
}
export { exitChatRoom };
