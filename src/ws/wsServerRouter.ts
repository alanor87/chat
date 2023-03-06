import { WebSocket } from "ws";
import { WsMessageType } from "../commonTypes/WsTypes.js";
import { jsonStringify as s } from "../helpers/jsonStringify.js";
import { jsonParse as p } from "../helpers/jsonParse.js";
import { clientDataValidation } from "../helpers/clientDataValidation.js";
import { getChatRoomById } from "../http/chatRoom.js";
import { color } from "../helpers/logging.js";

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
        const client = chatRoom!.getClientById(clientId);

        const responseSuccess: WsMessageType = {
          method: "client_init_response",
          data: { result: "success" },
        };

        /**  If the client already has the connection on making client_init_request - 
         * means, that the connection was droped with reloading/closing tab or browser,
         * and now was restored. In this case the old dropped connection is replaced for
         * the new, and the delete client timeout is being cleared.
        */
        if (client?.currentConnection) {
          console.log(
            "Client " +
              color("yellow", clientId) +
              " restored dropped connection."
          );
          chatRoom!.deleteClientTimeoutClear(client!.clientDeleteTimeoutId)
          chatRoom!.setClientConnection(clientId, currentConnection);
          client!.currentConnection!.send(s(responseSuccess));
          const announcementMessage = {
            method: 'announcement_broadcast',
            data : {
              message: client?.nickname + ' restored connection.', reason: 'client_connection_up', clientId
            }
          }
          chatRoom!.broadcast(announcementMessage, [clientId]);
          return;
        } else {
          /** The socket connection is added to the corresponding client object in the chosen room. */ 
          chatRoom!.setClientConnection(clientId, currentConnection);
        }

        const nickname = client?.nickname;

        const newClientBroadcastMessage: WsMessageType = {
          method: "announcement_broadcast",
          data: {
            message: nickname + " has joined.",
            reason: "client_join",
            nickname,
            clientId,
          },
        };

        const newClientWelcomeMessage: WsMessageType = {
          method: "welcome_message",
          data: {
            message:
              "Welcome, " + nickname + ". Your id is : " + clientId + ".",
          },
        };

        // Telling everyone that new client joined.
        chatRoom!.broadcast(newClientBroadcastMessage, [clientId]);

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
        const { chatRoomId, fromClientId, toClientId, message } =
          parsedWsMessage.data;

        const chatRoom = getChatRoomById(chatRoomId);
        if (!chatRoom) throw Error("Chat room does not exist");

        const fromClientNickname =
          chatRoom.getClientById(fromClientId)!.nickname;

        const newBroadcastMessage: WsMessageType = {
          method: "new_message_broadcast",
          data: { message, fromClientId, fromClientNickname, toClientId },
        };

        chatRoom.clients.forEach(({ currentConnection }) => {
          if (!currentConnection) return;
          currentConnection.send(s(newBroadcastMessage));
        });
      } catch (e: any) {
        console.log(e.message);
      } finally {
        break;
      }
    }

    /* This message is being fired on the client every 10 seconds. For now it is just for the purpose 
       of keeping the server on Heroku hosting up and runnung while at least one client is running. */
    case "ping": {
      return;
    }
  }
}

export { wsServerRouter };
