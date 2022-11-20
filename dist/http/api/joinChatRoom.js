import { getChatRoomById } from "../chatRoom.js";
import { jsonStringify as s } from "../../helpers/jsonStringify.js";
import { createChatClient } from "../../helpers/createChatClient.js";
function joinChatRoom(res, reqData) {
    const { nickname, chatRoomId, password } = reqData.body;
    const chatRoom = getChatRoomById(chatRoomId);
    if (!chatRoom || password !== chatRoom.password) {
        res.writeHead(404).end(s({ message: "Joining chat room failed" }));
        return;
    }
    const newClient = createChatClient(nickname);
    const { clientId, token } = newClient;
    chatRoom.addClient(newClient);
    const response = s({ chatRoomId, clientId, token });
    res.writeHead(201).end(response);
}
export { joinChatRoom };
