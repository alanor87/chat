import { ClientListEntryType } from "../../../commonTypes/ChatRoomTypes.js";
import { refs } from "./refs.js";
import { CreateMessageArgsType } from "./types.js";

function createMessageElement({
  messageType,
  message,
  toClientNickname,
  fromClientNickname,
}: CreateMessageArgsType) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", messageType);

  const appendToClientTag = (nickname: string) => {
    const to = document.createElement("span");
    to.classList.add("to");
    to.innerText = "@" + nickname;
    messageElement.append(to, ", ");
  };

  const appendFromClientTag = (nickname: string) => {
    const from = document.createElement("span");
    from.classList.add("from");
    from.innerText = nickname;
    messageElement.append(from, "  :  ");
  };

  switch (messageType) {
    case "welcome": {
      messageElement.innerText = message;
      break;
    }
    case "outcoming": {
      if (toClientNickname) appendToClientTag(toClientNickname);
      messageElement.append(message);
      break;
    }
    case "incoming": {
      appendFromClientTag(fromClientNickname || "");
      if (toClientNickname) appendToClientTag(toClientNickname);
      messageElement.append(message);
      break;
    }
  }

  refs.messagesList!.appendChild(messageElement);
}

function createAnnouncementElement(notification: string) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("notification");
  messageElement.innerText = notification;
  refs.notificationStackBlock!.appendChild(messageElement);
  setTimeout(() => {
    refs.notificationStackBlock!.removeChild(messageElement);
  }, 3000);
}

function createClientEntryElement(clientListEntry: ClientListEntryType) {
  const newClientEntry = document.createElement("li");

  const disconnectedStatusIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  disconnectedStatusIcon.classList.add("icon", "hidden");
  disconnectedStatusIcon.innerHTML =
    '<use href="public/img/sprite.svg#icon_connection_lost"></use>';

  newClientEntry.classList.add("clientEntry");
  if (clientListEntry.selected) newClientEntry.classList.add("selected");
  newClientEntry.setAttribute("data-client-id", clientListEntry.clientId);
  newClientEntry.append(clientListEntry.nickname, disconnectedStatusIcon);
  return newClientEntry;
}

function toggleCleintEntryConnectionStatus(clientId: string, online: boolean) {
  const clientEntryStatusIcon = refs
    .clientsList!.querySelector(`[data-client-id='${clientId}']`)!
    .querySelector("svg");
  online
    ? clientEntryStatusIcon!.classList.add("hidden")
    : clientEntryStatusIcon!.classList.remove("hidden");
}

function clientsListRender(clientsList: ClientListEntryType[]) {
  const clientsListElements = clientsList.map((clientListEntry) =>
    createClientEntryElement(clientListEntry)
  );
  refs.clientsList!.innerHTML = "";
  refs.clientsList!.append(...clientsListElements);
}

export {
  createMessageElement,
  createAnnouncementElement,
  clientsListRender,
  toggleCleintEntryConnectionStatus,
};
