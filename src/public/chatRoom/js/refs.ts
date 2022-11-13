import { RefsType } from "./types";

export const refs: RefsType = {
  userInput: document.querySelector("#userInput"),
  sendMessageButton: document.querySelector("#sendMessageButton"),
  messagesList: document.querySelector("#messagesList"),
  clientsList: document.querySelector("#clientsList"),
  newClientNotificationsList: document.querySelector(
    "#newClientNotificationsList"
  ),
  inviteLinkCopyButton: document.querySelector("#inviteLinkCopyButton"),
};
