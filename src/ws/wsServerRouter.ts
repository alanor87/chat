import { WebSocket } from "ws";
import {
  WsMessageType,
  NewCLientBroadcastDataType,
  NewClientWelcomeDataType,
  ClientNewMessageDataType,
  NewMessageBroadcastDataType,
} from "../commonTypes/WsTypes.js";
import { jsonStringify as s } from "../helpers/jsonStringify.js";
import { jsonParse as p } from "../helpers/jsonParse.js";
import { clientDataValidation } from "../helpers/clientDataValidation.js";
import { ChatRoom, getChatRoomById } from "../http/chatRoom.js";
import { SessionAuthDataType } from "../commonTypes/ChatRoomTypes.js";

function wsServerRouter(currentConnection: WebSocket, wsMessage: any) {
  const parsedWsMessage: WsMessageType<any> = p(wsMessage);
  const { method } = parsedWsMessage;
  switch (method) {
    // The first message after the handshake that client sends to the server.
    // Includes chat room id, client id and token to check rights to access.
    case "client_init": {
      try {
        const { data } = parsedWsMessage as WsMessageType<SessionAuthDataType>;
        const { chatRoomId, clientId, token } = data;
        clientDataValidation(chatRoomId, clientId, token);

        // Client validation success, presuming that room and client exist -  and the token is correct.
        const chatRoom = getChatRoomById(chatRoomId);

        // The socket connection is added to the corresponding client object in the chosen room.
        chatRoom!.addClientConnection(clientId, currentConnection);

        const nickname = chatRoom!.getClientById(clientId)!.nickname;
        const replySuccess = {
          method: "client_init",
          data: { result: "success" },
        };

        const newClientBroadcastMessage: WsMessageType<NewCLientBroadcastDataType> =
          {
            method: "new_client",
            data: { clientId },
          };

        const newClientWelcomeMessage: WsMessageType<NewClientWelcomeDataType> =
          {
            method: "welcome_message",
            data: {
              message:
                "Welcome, " + nickname + ". Your id is : " + clientId + ".",
            },
          };

        chatRoom!.getAllClientConnections().forEach((connection) => {
          if (connection) connection.send(s(newClientBroadcastMessage));
        });

        currentConnection.send(s(newClientWelcomeMessage));
        currentConnection.send(s(replySuccess));
      } catch (e) {
        const replyError = s({
          method: "client_init",
          data: { result: "error" },
        });
        currentConnection.send(replyError);
        currentConnection.close(401);
      } finally {
        break;
      }
    }

    case "new_message": {
      try {
        const { data } =
          parsedWsMessage as WsMessageType<ClientNewMessageDataType>;
        const { chatRoomId, toClientId, fromClientId, message } = data;

        const chatRoom = getChatRoomById(chatRoomId);
        if (!chatRoom) throw Error("Chat room does not exist");

        const newBroadcastMessage: WsMessageType<NewMessageBroadcastDataType> =
          {
            method: "new_message",
            data: { message, fromClientId },
          };

        chatRoom.clients.forEach(({ currentConnection }) => {
          if (!currentConnection) return;
          currentConnection.send(s(newBroadcastMessage));
        });
      } catch (e) {
      } finally {
        break;
      }
    }
  }
}

export { wsServerRouter };
