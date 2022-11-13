import { refs } from "./refs.js";
import { MessageType } from "./types.js";

export function createMessageElement(
  messageType: MessageType,
  messageText: string
) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", messageType);
  messageElement.innerText = messageText;
  refs.messagesList!.appendChild(messageElement);
}

export function createNewClientNotification(newClient: string) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("newClientNotification", newClient);
  messageElement.innerText = newClient + " has joined.";
  refs.newClientNotificationsList!.appendChild(messageElement);
  setTimeout(() => {
    refs.newClientNotificationsList!.removeChild(messageElement);
  }, 3000);
}
