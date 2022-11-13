import { RefsType } from "./types";

export const refs: RefsType = {
  startButtonsWrapper: document.querySelector("#startButtonsWrapper"),
  createChatRoomButton: document.querySelector("#createChatRoomButton"),
  joinChatRoomButton: document.querySelector("#joinChatRoomButton"),
  createChatRoom: {
    createForm: document.querySelector("#createChatRoomForm"),
    createNicknameInput: document.querySelector("#createChatRoomNicknameInput"),
    createPasswordInput: document.querySelector("#createChatRoomPasswordInput"),
    passwordInputRepeat: document.querySelector("#repeatChatRoomPasswordInput"),
    createOkButton: document.querySelector("#createChatRoomOkButton"),
    createCancelButton: document.querySelector("#createChatRoomCancelButton"),
  },
  joinChatRoom: {
    joinForm: document.querySelector("#joinChatRoomForm"),
    joinChatRoomIdInput: document.querySelector("#joinChatRoomIdInput"),
    joinPasswordInput: document.querySelector("#joinChatRoomPasswordInput"),
    joinNicknameInput: document.querySelector("#joinChatRoomNicknameInput"),
    joinOkButton: document.querySelector("#joinChatRoomOkButton"),
    joinCancelButton: document.querySelector("#joinChatRoomCancelButton"),
  },
};
