import { refs } from "./refs.js";
import { wsClientRouter } from "./wsClientRouter.js";
import { jsonStringify as s } from "../../../helpers/jsonStringify.js";
import { logout } from "../../../helpers/logout.js";
import { sessionAuthData } from "./sessionAuthData.js";
import { WsMessageType } from "../../../commonTypes/WsTypes.js";

let selectedRecipientId: string;
let wsClient: WebSocket;

function sendMessage() {
  const messageText = refs.userInput!.value;
  const newClientMessage: WsMessageType = {
    method: "new_message",
    data: {
      chatRoomId: sessionAuthData.chatRoomId,
      fromClientId: sessionAuthData.clientId,
      message: messageText,
    },
  };
  const message = s(newClientMessage);
  refs.userInput!.value = "";
  wsClient.send(message);
}

function onInputEnterPress(e: any) {
  console.log(e);
  if (e.key === "Enter") sendMessage();
}

function inviteLinkCopy() {
  window.navigator.clipboard.writeText(
    window.location.origin + "/?chatRoomId=" + sessionAuthData.chatRoomId
  );
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
  Object.keys(sessionAuthData).forEach((item) => {
    sessionAuthData[item] = sessionStorage.getItem(item);
    if (!sessionAuthData[item])
      throw Error(item + " data is missing. Logging out.");
  });
}

function eventListenersInit() {
  refs.userInput!.addEventListener("keypress", onInputEnterPress);
  refs.sendMessageButton!.addEventListener("click", sendMessage);
  refs.inviteLinkCopyButton!.addEventListener("click", inviteLinkCopy);

  window.addEventListener("click", (e) => {
    const chosenEntry = e.target as HTMLDivElement;
    const classList = chosenEntry.classList.value;
    if (classList.includes("clientEntry")) {
      selectedRecipientId = chosenEntry.id;
      chosenEntry.classList.add("selected");
    }
  });
}

function wsClientInit() {
  console.log(window.location.hostname);
  wsClient = new WebSocket("wss://" + window.location.host);

  // Sending the auth data on opening the socket connection.
  wsClient.onopen = (e) =>
    wsClient.send(s({ method: "client_init_request", data: sessionAuthData }));

  // Incoming messages are being handled depending on their 'method' field in a dedicated router.
  wsClient.onmessage = (e) => {
    wsClientRouter(e.data);
  };

  wsClient.onclose = () => console.log("Socket connection closed.");
}

// Sending the auth data on opening the page load.
async function chatRoomAuthorization() {
  const headers = new Headers({
    Authorization: "Bearer " + sessionAuthData.token,
  });
  const body = s(sessionAuthData);
  const requestOptions = { method: "POST", headers, body };
  const response = await fetch("api/chatRoomAuthorization", requestOptions);

  if (response.status === 401) {
    const responceText = await response.text();
    throw new Error("Authorization failure. " + responceText);
  }
}

async function chatRoomInit() {
  try {
    sessionStorageInit();
    await chatRoomAuthorization();
    wsClientInit();
    eventListenersInit();
  } catch (e) {
    logout(e.message);
  }
}

window.onload = () => {
  chatRoomInit();
};
