import { refs } from "./refs.js";
import { CreateMessageArgsType } from "./types.js";

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

export function createAnnouncementElement(notification: string) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("notification");
  messageElement.innerText = notification;
  refs.notificationStackBlock!.appendChild(messageElement);
  setTimeout(() => {
    refs.notificationStackBlock!.removeChild(messageElement);
  }, 3000);
}

function createClientEntryElement(
  nickname: string,
  clientId: string
) {
  const newClientEntry = document.createElement("li");
  newClientEntry.classList.add("clinetEntry");
  newClientEntry.setAttribute('data-clientId', clientId);
  newClientEntry.innerText = nickname;
  return newClientEntry;
}

export function clientsListRender(clientsList: any[]) {
  console.log(clientsList);
  const clientsListElements = clientsList.map(({nickname, clientId}) => createClientEntryElement(nickname, clientId));
  refs.clientsList!.innerHTML = '';
 console.log('appending : ', clientsListElements )
  refs.clientsList!.append(...clientsListElements);
}