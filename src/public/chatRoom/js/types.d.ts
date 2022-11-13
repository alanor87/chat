export type RefsType = {
  userInput: HTMLInputElement | null;
  sendMessageButton: HTMLButtonElement | null;
  messagesList: HTMLDivElement | null;
  clientsList: HTMLDivElement | null;
  newClientNotificationsList: HTMLDivElement | null;
  inviteLinkCopyButton: HTMLButtonElement | null;
};

export type MessageType = "incoming" | "outcoming" | "welcome";
