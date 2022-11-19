import { WebSocketServer } from "ws";
import { server } from "../http/httpServer.js";
import { WsClinetsObjectType } from "../commonTypes/WsTypes.js";
import { wsServerRouter } from "./wsServerRouter.js";
export const clients: WsClinetsObjectType[] = [];

export function wsServerInit() {
  const wsServer = new WebSocketServer({ server });

  // Connection - server gets the handshake from the client.
  wsServer.on("connection", (currentConnection, request) => {
    console.log("WS connection req : ", request);
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
