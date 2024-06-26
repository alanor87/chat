import { refs } from "./refs.js";
import { wsClientRouter } from "./wsClientRouter.js";
import { jsonStringify as s } from "../../../helpers/jsonStringify.js";
import { logout } from "../../../helpers/logout.js";
import { sessionData } from "../../common/sessionData.js";
import { WsMessageType } from "../../../commonTypes/WsTypes.js";
import { createAnnouncementElement } from "./componentsRender.js";
import { clientsListEntries } from "./clientsList.js";
import { ClientListEntryType } from "../../../commonTypes/ChatRoomTypes.js";

let selectedClienttId: string | undefined;
let wsClient: WebSocket;
let pingIntervalId: any;

function startPing() {
  pingIntervalId = setInterval(() => {
    if (wsClient.readyState === wsClient.OPEN)
      wsClient.send(s({ method: "ping", data: {} }));
  }, 10000);
}

function stopPing() {
  clearInterval(pingIntervalId);
}

/** Even listener for the click on a client entry is assigned to the whole entries list,
 * so no need to have a separate listener for each entry.
 */
function onClientEntryClick(e: MouseEvent) {
  try {
    const chosenEntry = e.target as HTMLDivElement;
    if (chosenEntry.classList.contains("clientEntry")) {
      selectedClienttId = chosenEntry.dataset.clientId;

      const clientEntry = clientsListEntries.find({
        field: "clientId",
        value: selectedClienttId,
      });

      refs.userInput!.value = `@${clientEntry?.nickname}, `;
      refs.userInput!.selectionEnd = refs.userInput!.value.length;
      const isSelected = clientEntry?.selected;
      clientsListEntries.editAll({ selected: false });
      clientsListEntries.edit(
        { field: "clientId", value: selectedClienttId },
        { selected: !isSelected }
      );
    }
  } catch (e) {
    console.log(e);
  }
}

function sendMessage() {
  if (!refs.userInput?.value) return;
  const messageText = refs.userInput?.value.replace(/@[^,]*,/, "") || "";
  console.log(messageText);
  const newClientMessage: WsMessageType = {
    method: "new_message",
    data: {
      chatRoomId: sessionData.chatRoomId,
      fromClientId: sessionData.clientId,
      toClientId: selectedClienttId,
      message: messageText,
    },
  };
  const message = s(newClientMessage);
  refs.userInput!.value = "";
  clientsListEntries.editAll({ selected: false });
  wsClient.send(message);
  selectedClienttId = undefined;
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

function toggleSideBar() {
  const display = getComputedStyle(refs.sideBar!).display;
  refs.sideBar!.style.display = display === "flex" ? "none" : "flex";
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

function localStorageInit() {
  Object.keys(sessionData).forEach((item) => {
    sessionData[item] = localStorage.getItem(item);
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
    refs.sideBarCloseButton!.addEventListener("click", toggleSideBar);
    refs.clientsListButton!.addEventListener("click", toggleSideBar);
    refs.exitChatButton!.addEventListener("click", exitChat);
    refs.clientsList!.addEventListener("click", onClientEntryClick);
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
  clientsList.forEach((client: ClientListEntryType) =>
    clientsListEntries.add(client)
  );
  localStorage.setItem("isAdmin", isAdmin);
  sessionData.isAdmin = isAdmin;
}

async function chatRoomInit() {
  try {
    localStorageInit();
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