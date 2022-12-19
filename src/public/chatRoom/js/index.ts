import { refs } from "./refs.js";
import { wsClientRouter } from "./wsClientRouter.js";
import { jsonStringify as s } from "../../../helpers/jsonStringify.js";
import { logout } from "../../../helpers/logout.js";
import { sessionData } from "../../common/sessionData.js";
import { WsMessageType } from "../../../commonTypes/WsTypes.js";
import { createAnnouncementElement } from "./componentsRender.js";
import { clientsListEntries } from "./clientsList.js";

let selectedRecipientId: string;
let wsClient: WebSocket;
let pingIntervalId: any;

function startPing() {
  pingIntervalId = setInterval(() => {
    if (wsClient.readyState == wsClient.OPEN)
      wsClient.send(s({ method: "ping", data: {} }));
  }, 10000);
}

function stopPing() {
  clearInterval(pingIntervalId);
}

function sendMessage() {
  if (!refs.userInput!.value) return;
  const messageText = refs.userInput!.value;
  const newClientMessage: WsMessageType = {
    method: "new_message",
    data: {
      chatRoomId: sessionData.chatRoomId,
      fromClientId: sessionData.clientId,
      message: messageText,
    },
  };
  const message = s(newClientMessage);
  refs.userInput!.value = "";
  wsClient.send(message);
}

function onInputEnterPress(e: any) {
  if (e.key === "Enter") sendMessage();
}

function inviteLinkCopy() {
  window.navigator.clipboard.writeText(
    window.location.origin + "/?chatRoomId=" + sessionData.chatRoomId
  );
  createAnnouncementElement("Chat room link is copied to clipboard.");
}

function toggleClientsList() {
  refs.sideBar!.classList.toggle("hidden");
}

async function exitChat() {
  const headers = new Headers({
    Authorization: "Bearer " + sessionData.token,
  });
  const { chatRoomId, clientId } = sessionData;
  const body = s({ chatRoomId, clientId });
  const requestOptions = { method: "POST", headers, body };
  await fetch("api/exitChatRoom", requestOptions);
}

function setClientsList(clients: [string]) {
  const clientsEntries = clients.map((clientId) => {
    const entry = document.createElement("div");
    entry.classList.add("clientEntry");
    entry.innerText = clientId;
    entry.id = clientId;
    return entry;
  });
  refs.clientsList!.innerHTML = "";
  refs.clientsList!.append(...clientsEntries);
}

function sessionStorageInit() {
  Object.keys(sessionData).forEach((item) => {
    sessionData[item] = sessionStorage.getItem(item);
    if (!sessionData[item])
      throw Error(item + " data is missing. Logging out.");
  });
}

function adminComponentsInit() {
  if (sessionData.isAdmin === "isAdmin")
    refs.inviteLinkCopyButton!.classList.remove("hidden");
}

function eventListenersInit() {
  try {
    refs.userInput!.addEventListener("keypress", onInputEnterPress);
    refs.sendMessageButton!.addEventListener("click", sendMessage);
    refs.inviteLinkCopyButton!.addEventListener("click", inviteLinkCopy);
    refs.clientsListButton!.addEventListener("click", toggleClientsList);
    refs.exitChatButton!.addEventListener("click", exitChat);

    window.addEventListener("click", (e) => {
      const chosenEntry = e.target as HTMLDivElement;
      const classList = chosenEntry.classList.value;
      if (classList.includes("clientEntry")) {
        selectedRecipientId = chosenEntry.id;
        chosenEntry.classList.add("selected");
      }
    });
  } catch (e: any) {
    console.log(e);
  }
}

function wsClientInit() {
  wsClient = new WebSocket("wss://" + window.location.host);
  // Sending the auth data on opening the socket connection.
  const { chatRoomId, clientId, token } = sessionData;

  wsClient.onopen = (e) =>
    wsClient.send(
      s({
        method: "client_init_request",
        data: { chatRoomId, clientId, token },
      })
    );

  startPing();

  // Incoming messages are being handled depending on their 'method' field in a dedicated router.
  wsClient.onmessage = (e) => {
    wsClientRouter(e.data);
  };

  wsClient.onclose = (event) => {
    stopPing();
    logout("Socket connection closed. " + event.reason);
  };
}

// Sending the auth data on opening the page load.
async function chatRoomAuthorization() {
  const headers = new Headers({
    Authorization: "Bearer " + sessionData.token,
  });
  const { chatRoomId, clientId } = sessionData;
  const body = s({ chatRoomId, clientId });
  const requestOptions = { method: "POST", headers, body };
  const response = await fetch("api/chatRoomAuthorization", requestOptions);
  if (response.status === 401) {
    const responceText = await response.text();
    throw new Error("Authorization failure. " + responceText);
  }
  const { isAdmin, clientsList } = await response.json();
  clientsList.forEach(client => clientsListEntries.push(client));
  sessionStorage.setItem("isAdmin", isAdmin);
  sessionData.isAdmin = isAdmin;
}

async function chatRoomInit() {
  try {
    sessionStorageInit();
    await chatRoomAuthorization();
    adminComponentsInit();
    wsClientInit();
    eventListenersInit();
  } catch (e) {
    logout(e.message);
  }
}

window.onload = () => {
  chatRoomInit();
};
