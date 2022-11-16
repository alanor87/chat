import { WebSocketServer } from "ws";
import { WsClinetsObjectType } from "../commonTypes/WsTypes.js";
import { wsServerRouter } from "./wsServerRouter.js";
export const clients: WsClinetsObjectType[] = [];

export function wsServerInit(PORT: number) {
  console.log('wsServerInit')
  const wsServer = new WebSocketServer({ port: PORT }, () => {
    console.log("web socket server is running on port ", PORT);
  });

  // Connection - server gets the handshake from the client.
  wsServer.on("connection", (currentConnection, request) => {
    // Preventing XSRF attacks - at least to my understanding))
    if (request?.headers.origin !== process.env.BASE_URL) {
      console.log("Origin differs, closing connection");
      currentConnection.send("403");
      currentConnection.close();
      return;
    }

    // Forwarding the incoming message to the router.
    currentConnection.on("message", (data) => {
      wsServerRouter(currentConnection, data);
    });
  });
}
