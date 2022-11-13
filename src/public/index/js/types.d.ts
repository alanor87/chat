export type RefsType = {
  startButtonsWrapper: HTMLDivElement | null;
  createChatRoomButton: HTMLButtonElement | null;
  joinChatRoomButton: HTMLButtonElement | null;
  createChatRoom: {
    createForm: HTMLDivElement | null;
    createNicknameInput: HTMLInputElement | null;
    createPasswordInput: HTMLInputElement | null;
    passwordInputRepeat: HTMLInputElement | null;
    createOkButton: HTMLButtonElement | null;
    createCancelButton: HTMLButtonElement | null;
  },
  joinChatRoom: {
    joinForm: HTMLDivElement | null;
    joinChatRoomIdInput: HTMLInputElement | null;
    joinPasswordInput: HTMLInputElement | null;
    joinNicknameInput: HTMLInputElement | null;
    joinOkButton: HTMLButtonElement | null;
    joinCancelButton: HTMLButtonElement | null;
  },
};
