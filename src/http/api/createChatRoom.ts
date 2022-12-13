import { ServerResponse } from "http";
import { v4 as uuidv4 } from "uuid";
import { ChatRoom, chatRoomsList } from "../chatRoom.js";
import { jsonStringify as s } from "../../helpers/jsonStringify.js";
import { createChatClient } from "../../helpers/createChatClient.js";
import { logObject } from "../../helpers/logging.js";

function createChatRoom(res: ServerResponse, reqData: any) {
  const { nickname, password } = reqData.body;
  const newClient = createChatClient(nickname);
  const { clientId, token } = newClient;
  const chatRoomId = "room" + uuidv4();
  const newChatRoom = new ChatRoom(chatRoomId, clientId, token, password);
  newChatRoom.addClient(newClient);
  chatRoomsList.push(newChatRoom);

  console.log(
    logObject("Chat room created", "green", {
      "admin Id": clientId,
      "chat room id": chatRoomId,
    })
  );

  const response = s({ chatRoomId, clientId, token });
  res
    .setHeader("content-type", "application/json")
    .writeHead(200)
    .end(response);
}

export { createChatRoom };
