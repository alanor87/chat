import { ChatClient } from "../http/chatClient.js";
import { v4 as uuidv4 } from "uuid";
import { createJwt } from "./jwt.js";
function createChatClient(nickname) {
    const clientId = "client" + uuidv4();
    const token = createJwt(clientId);
    const newClient = new ChatClient(null, clientId, nickname, token);
    return newClient;
}
export { createChatClient };
