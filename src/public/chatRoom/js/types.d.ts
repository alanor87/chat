export type RefsType = {
  userInput: HTMLInputElement | null;
  sendMessageButton: HTMLButtonElement | null;
  messagesList: HTMLDivElement | null;
  sideBar: HTMLDivElement | null;
  sideBarCloseButton: HTMLDivElement | null;
  clientsList: HTMLUListElement | null;
  inviteLinkCopyButton: HTMLButtonElement | null;
  clientsListButton: HTMLButtonElement | null;
  exitChatButton: HTMLButtonElement | null;
  notificationStackBlock: HTMLDivElement | null;
};

export type CreateMessageArgsType = {
  messageType: ChatHistoryMessageType,
  message: string,
  fromClientNickname?: string,
  toClientNickname?: string
  toClientId?: string,
}

export type ChatHistoryMessageType = "incoming" | "outcoming" | "welcome";
