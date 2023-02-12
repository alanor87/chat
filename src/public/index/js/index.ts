import { refs } from "./refs";

import { jsonStringify as s } from "../../../helpers/jsonStringify.js";
import {
  CreateChatRoomResponse,
  JoinChatRoomResponse,
  SessionDataType,
} from "../../../commonTypes/ChatRoomTypes.js";
import { sessionData } from "../../common/sessionData.js";

const {
  startButtonsWrapper,
  createChatRoomButton,
  joinChatRoomButton,
  createChatRoom: {
    createNicknameInput,
    createPasswordInput,
    passwordInputRepeat,
    createOkButton,
    createCancelButton,
    createForm,
  },
  joinChatRoom: {
    joinNicknameInput,
    joinPasswordInput,
    joinChatRoomIdInput,
    joinOkButton,
    joinCancelButton,
    joinForm,
  },
} = refs;

/** Check for the session data in case, if a logged client loads the index page - redirecting him to the chat room pages */
function checkSessionData() {
  console.log('Checking session data');
  const sessionDataIsPresent = Object.keys(sessionData).every((key) =>
    sessionStorage.getItem(key)
  );
  if (sessionDataIsPresent)
    window.location.assign(window.location.origin + "/chatRoom");
}

function onInputEnterPress(e: any) {
  console.log(e);
  if (e.key === "Enter") createChatRoomRequest();
}

function showStartButtonsWrapper() {
  startButtonsWrapper!.classList.remove("hidden");
  createForm!.classList.add("hidden");
  joinForm!.classList.add("hidden");
}

function showCreateForm() {
  startButtonsWrapper!.classList.add("hidden");
  joinForm!.classList.add("hidden");
  createForm!.classList.remove("hidden");
  createNicknameInput!.focus();
}

function showJoinForm() {
  startButtonsWrapper!.classList.add("hidden");
  createForm!.classList.add("hidden");
  joinForm!.classList.remove("hidden");
  joinChatRoomIdInput!.value
    ? joinNicknameInput!.focus()
    : joinChatRoomIdInput!.focus();
}

function inputsIntegrityCheck(formType: "create" | "join") {
  switch (formType) {
    case "create": {
      if (createPasswordInput!.value !== passwordInputRepeat!.value)
        throw Error("Passwords do not match.");
      if (!createNicknameInput!.value) {
        throw Error("Enter your nickname.");
      }
      break;
    }
    case "join": {
      if (!joinNicknameInput!.value) throw Error("Enter your nickname.");
      if (!joinChatRoomIdInput!.value) throw Error("Enter chat room id.");
      break;
    }
  }
}

/**
 *  If client got to the page from the admin provided link, with chat room ID persent in query
 * the chat room ID will be written to the corresponding joinChatRoom form input automatically
 */
function chatRoomAddressCheck() {
  const params: any = new URLSearchParams(window.location.search);
  const chatRoomId = params.get("chatRoomId");
  if (chatRoomId) {
    startButtonsWrapper!.classList.add("hidden");
    createForm!.classList.add("hidden");
    joinForm!.classList.remove("hidden");
    joinChatRoomIdInput!.value = chatRoomId;
    joinChatRoomIdInput!.disabled = true;
  }
}

/**
 * After successful login attempt or chat room creation session data is written to sessionStorage.
 */
function writeLocalSessionData({
  chatRoomId,
  clientId,
  nickname,
  token,
  isAdmin,
}: SessionDataType) {
  sessionStorage.setItem("chatRoomId", chatRoomId);
  sessionStorage.setItem("clientId", clientId);
  sessionStorage.setItem("nickname", nickname);
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("isAdmin", isAdmin || "notAdmin");
}

async function createChatRoomRequest() {
  try {
    inputsIntegrityCheck("create");
    const nickname = createNicknameInput!.value;
    const password = createPasswordInput!.value;
    const body = s({ nickname, password });
    const requestOptions = {
      method: "POST",
      body,
    };
    const response = await fetch("api/createChatRoom", requestOptions);

    if (!response.ok) throw Error("Creating chat room failed.");

    const { chatRoomId, clientId, token }: CreateChatRoomResponse =
      await response.json();

    writeLocalSessionData({
      chatRoomId,
      clientId,
      nickname,
      token,
    });

    window.location.assign(window.location.origin + "/chatRoom");
  } catch (e: any) {
    alert(e.message);
  }
}

async function joinChatRoomRequest() {
  try {
    inputsIntegrityCheck("join");
    const chatRoomId = joinChatRoomIdInput!.value;
    const nickname = joinNicknameInput!.value;
    const password = joinPasswordInput!.value;
    const body = s({ chatRoomId, nickname, password });
    const requestOptions = {
      method: "POST",
      body,
    };

    const response = await fetch("api/joinChatRoom", requestOptions);

    if (!response.ok) throw Error("Joining chat room failed.");

    const { clientId, token }: JoinChatRoomResponse = await response.json();

    writeLocalSessionData({
      chatRoomId,
      clientId,
      nickname,
      token,
    });

    window.location.assign(window.location.origin + "/chatRoom");
  } catch (e: any) {
    alert(e.message);
  }
}

function eventListenersInit() {
  // Create chat room form.
  createChatRoomButton!.addEventListener("click", showCreateForm);
  createNicknameInput!.addEventListener("keypress", onInputEnterPress);
  createPasswordInput!.addEventListener("keypress", onInputEnterPress);
  passwordInputRepeat!.addEventListener("keypress", onInputEnterPress);
  createOkButton!.addEventListener("click", createChatRoomRequest);
  createCancelButton!.addEventListener("click", showStartButtonsWrapper);

  // Join chat room form.
  joinChatRoomButton!.addEventListener("click", showJoinForm);
  joinOkButton!.addEventListener("click", joinChatRoomRequest);
  joinCancelButton!.addEventListener("click", showStartButtonsWrapper);
}

window.onload = () => {
  checkSessionData();
  eventListenersInit();
  chatRoomAddressCheck();
};
