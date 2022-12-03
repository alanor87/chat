export type RefsType = {
  userInput: HTMLInputElement | null;
  sendMessageButton: HTMLButtonElement | null;
  messagesList: HTMLDivElement | null;
  sideBar: HTMLDivElement | null;
  clientsList: HTMLDivElement | null;
  inviteLinkCopyButton: HTMLButtonElement | null;
  clientsListButton: HTMLButtonElement | null;
  notificationStackBlock: HTMLDivElement | null;
};

export type CreateMessageArgsType = {
  messageType: ChatHistoryMessageType,
  message: string,
  fromClientId?: string,
  fromClientNickname?: string
  toClientId?: string,
}

export type ChatHistoryMessageType = "incoming" | "outcoming" | "welcome";
