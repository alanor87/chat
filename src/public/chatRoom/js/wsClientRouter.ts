import { WsMessageType } from "../../../commonTypes/WsTypes.js";
import { logout } from "../../../helpers/logout.js";
import {
  createMessageElement,
  createNewClientNotification,
} from "./componentsRender.js";
import { jsonParse as p } from "../../../helpers/jsonParse.js";
import { sessionAuthData } from "./sessionAuthData.js";

export function wsClientRouter(message: string) {
  const parsedWsMessage: WsMessageType = p(message);
  switch (parsedWsMessage.method) {
    // Connection is automatically closed by server in case of auth failure, logging out.
    case "client_init_response": {
      const { result } = parsedWsMessage.data;
      if (result === "error") logout("Server closed the onnection.");
      break;
    }

    case "new_message_broadcast": {
      const { fromClientId, toClientId, message } = parsedWsMessage.data;
      const messageType =
        fromClientId === sessionAuthData.clientId ? "outcoming" : "incoming";
      createMessageElement(messageType, message);
      break;
    }

    case "welcome_message": {
      const { message } = parsedWsMessage.data;
      createMessageElement("welcome", message);
      break;
    }

    case "new_client": {
      const { nickname } = parsedWsMessage.data;
      createNewClientNotification(nickname);
      break;
    }
    default: {
      break;
    }
  }
}
