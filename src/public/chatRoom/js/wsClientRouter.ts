import { WsMessageType } from "../../../commonTypes/WsTypes.js";
import { logout } from "../../../helpers/logout.js";
import {
  createMessageElement,
  createAnnouncementElement,
} from "./componentsRender.js";
import { refs } from "./refs";
import { jsonParse as p } from "../../../helpers/jsonParse.js";
import { sessionData } from "../../common/sessionData.js";
import { clientsListEntries } from "./clientsList.js";

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
      const { fromClientId, fromClientNickname, toClientId, message } =
        parsedWsMessage.data;
      const { messagesList } = refs;
      const messageType =
        fromClientId === sessionData.clientId ? "outcoming" : "incoming";
      const wasScrolledToBottom =
        Math.abs(
          messagesList!.scrollHeight -
            messagesList!.clientHeight -
            messagesList!.scrollTop
        ) < 1;
      createMessageElement({
        messageType,
        message,
        fromClientId,
        fromClientNickname,
        toClientId,
      });
      // Scrolling on new message only if the messages list was scrolled to bottom on message arrival.
      if (wasScrolledToBottom)
        messagesList?.scrollTo({ top: messagesList?.clientHeight });
      break;
    }

    case "welcome_message": {
      const { message } = parsedWsMessage.data;
      createMessageElement({ messageType: "welcome", message });
      break;
    }

    case "announcement_broadcast": {
      const { message, reason } = parsedWsMessage.data;
      switch (reason) {
        case "client_join": {
          const { nickname, clientId } = parsedWsMessage.data;
          if (clientsListEntries.find((client) => client.clientId === clientId))
            break;
          clientsListEntries.push({
            nickname,
            clientId,
          });
          break;
        }
        case "client_exit": {
          break;
        }
      }
      createAnnouncementElement(message);
      break;
    }
    default: {
      break;
    }
  }
}
