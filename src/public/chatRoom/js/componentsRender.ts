import { refs } from "./refs.js";
import { ChatHistoryMessageType, CreateMessageArgsType } from "./types.js";

export function createMessageElement({
  messageType,
  message,
  fromClientId,
  fromClientNickname,
}: CreateMessageArgsType) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", messageType);

  switch (messageType) {
    case "welcome": {
      messageElement.innerText = message;
      break;
    }
    case "incoming": {
      const from = document.createElement("span");
      from.innerText = fromClientNickname || "anon";
      messageElement.append(from, "  :  ", message);
      break;
    }
    case "outcoming": {
      const from = document.createElement("span");
      from.innerText = "you : ";
      messageElement.appendChild(from);
      messageElement.innerText = message;
      break;
    }
  }

  refs.messagesList!.appendChild(messageElement);
}

export function createNotificationElement(notification: string) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("notification");
  messageElement.innerText = notification;
  refs.notificationStackBlock!.appendChild(messageElement);
  setTimeout(() => {
    refs.notificationStackBlock!.removeChild(messageElement);
  }, 3000);
}
