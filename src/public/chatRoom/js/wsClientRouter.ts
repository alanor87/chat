import {
  ClientInitDataType,
  NewMessageBroadcastDataType,
  WsMessageType,
} from "../../../commonTypes/WsTypes.js";
import { logout } from "../../../helpers/logout.js";
import {
  createMessageElement,
  createNewClientNotification,
} from "./componentsRender.js";
import { jsonParse as p } from "../../../helpers/jsonParse.js";
import { sessionAuthData } from "./sessionAuthData.js";

export function wsClientRouter(message: string) {
  const parsedWsMessage: WsMessageType<any> = p(message);
  switch (parsedWsMessage.method) {
    // Connection is automatically closed by server in case of auth failure, logging out.
    case "client_init": {
      const { result } = parsedWsMessage.data as ClientInitDataType;
      if (result === "error") logout("Server closed the onnection.");
      break;
    }

    case "new_message": {
      const { data } =
        parsedWsMessage as WsMessageType<NewMessageBroadcastDataType>;
      const messageType =
        data.fromClientId === sessionAuthData.clientId
          ? "outcoming"
          : "incoming";
      createMessageElement(messageType, data.message);
      break;
    }

    case "welcome_message": {
      createMessageElement("welcome", parsedWsMessage.data.message);
      break;
    }
    case "message_status_changed": {
      break;
    }
    case "new_client": {
      createNewClientNotification(parsedWsMessage.data.newClientId);
      break;
    }
    default: {
      break;
    }
  }
}
