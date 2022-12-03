import { WebSocket } from "ws";
import { WsMessageType } from "../commonTypes/WsTypes.js";
import { jsonStringify as s } from "../helpers/jsonStringify.js";
import { jsonParse as p } from "../helpers/jsonParse.js";
import { clientDataValidation } from "../helpers/clientDataValidation.js";
import { getChatRoomById } from "../http/chatRoom.js";

function wsServerRouter(currentConnection: WebSocket, wsMessage: any) {
  const parsedWsMessage: WsMessageType = p(wsMessage);
  const { method } = parsedWsMessage;
  switch (method) {
    // The first message after the handshake that client sends to the server.
    // Includes chat room id, client id and token to check rights to access.
    case "client_init_request": {
      try {
        const { chatRoomId, clientId, token } = parsedWsMessage.data;
        clientDataValidation(chatRoomId, clientId, token);

        // Client validation success, presuming that room and client exist -  and the token is correct.
        const chatRoom = getChatRoomById(chatRoomId);

        const responseSuccess: WsMessageType = {
          method: "client_init_response",
          data: { result: "success", isAdmin: 'notAdmin' },
        };

        // Checking if the client already has connection - just reloaded the page.
        if (chatRoom?.getClientById(clientId)?.currentConnection) {
          console.log(clientId + ' restored dropped connection.');
          const client = chatRoom!.getClientById(clientId);



          client!.currentConnection = currentConnection;
          client!.currentConnection!.send(s(responseSuccess));
          return;
        }

        // The socket connection is added to the corresponding client object in the chosen room.
        chatRoom!.addClientConnection(clientId, currentConnection);

        const nickname = chatRoom!.getClientById(clientId)!.nickname;

        const newClientBroadcastMessage: WsMessageType = {
          method: "new_client",
          data: { nickname },
        };

        const newClientWelcomeMessage: WsMessageType = {
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
        currentConnection.send(s(responseSuccess));
      } catch (e) {
        const replyError = s({
          method: "client_init_response",
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
        const { chatRoomId, toClientId, fromClientId, message } =
          parsedWsMessage.data;

        const chatRoom = getChatRoomById(chatRoomId);
        if (!chatRoom) throw Error("Chat room does not exist");

        const fromClientNickname =
          chatRoom.getClientById(fromClientId)!.nickname;

        const newBroadcastMessage: WsMessageType = {
          method: "new_message_broadcast",
          data: { message, fromClientId, fromClientNickname },
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

    case "client_exit_request": {
      const { chatRoomId, clientId } = parsedWsMessage.data;

      const chatRoom = getChatRoomById(chatRoomId);
      if (chatRoom?.getClientById(clientId)) {
        chatRoom.deleteClient(clientId);
      }
    }

    case "ping": {
      return;
    }
  }
}

export { wsServerRouter };
