/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const refs = {
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

function jsonStringify(object) {
    return JSON.stringify(object);
}

const sessionData = {
    ["chatRoomId"]: "",
    ["clientId"]: "",
    ["token"]: "",
    ["nickname"]: "",
    ["isAdmin"]: "",
};

const { startButtonsWrapper, createChatRoomButton, joinChatRoomButton, createChatRoom: { createNicknameInput, createPasswordInput, passwordInputRepeat, createOkButton, createCancelButton, createForm, }, joinChatRoom: { joinNicknameInput, joinPasswordInput, joinChatRoomIdInput, joinOkButton, joinCancelButton, joinForm, }, } = refs;
/** Check for the session data in case, if a logged client loads the index page - redirecting him to the chat room pages */
function checkSessionData() {
    console.log('Checking session data');
    const sessionDataIsPresent = Object.keys(sessionData).every((key) => localStorage.getItem(key));
    if (sessionDataIsPresent)
        window.location.assign(window.location.origin + "/chatRoom");
}
function onInputEnterPress(e) {
    console.log(e);
    if (e.key === "Enter")
        createChatRoomRequest();
}
function showStartButtonsWrapper() {
    startButtonsWrapper.classList.remove("hidden");
    createForm.classList.add("hidden");
    joinForm.classList.add("hidden");
}
function showCreateForm() {
    startButtonsWrapper.classList.add("hidden");
    joinForm.classList.add("hidden");
    createForm.classList.remove("hidden");
    createNicknameInput.focus();
}
function showJoinForm() {
    startButtonsWrapper.classList.add("hidden");
    createForm.classList.add("hidden");
    joinForm.classList.remove("hidden");
    joinChatRoomIdInput.value
        ? joinNicknameInput.focus()
        : joinChatRoomIdInput.focus();
}
function inputsIntegrityCheck(formType) {
    switch (formType) {
        case "create": {
            if (createPasswordInput.value !== passwordInputRepeat.value)
                throw Error("Passwords do not match.");
            if (!createNicknameInput.value) {
                throw Error("Enter your nickname.");
            }
            break;
        }
        case "join": {
            if (!joinNicknameInput.value)
                throw Error("Enter your nickname.");
            if (!joinChatRoomIdInput.value)
                throw Error("Enter chat room id.");
            break;
        }
    }
}
/**
 *  If client got to the page from the admin provided link, with chat room ID persent in query
 * the chat room ID will be written to the corresponding joinChatRoom form input automatically
 */
function chatRoomAddressCheck() {
    const params = new URLSearchParams(window.location.search);
    const chatRoomId = params.get("chatRoomId");
    if (chatRoomId) {
        startButtonsWrapper.classList.add("hidden");
        createForm.classList.add("hidden");
        joinForm.classList.remove("hidden");
        joinChatRoomIdInput.value = chatRoomId;
        joinChatRoomIdInput.disabled = true;
    }
}
/**
 * After successful login attempt or chat room creation session data is written to localStorage.
 */
function writeLocalSessionData({ chatRoomId, clientId, nickname, token, isAdmin, }) {
    localStorage.setItem("chatRoomId", chatRoomId);
    localStorage.setItem("clientId", clientId);
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("token", token);
    localStorage.setItem("isAdmin", isAdmin || "notAdmin");
}
function createChatRoomRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            inputsIntegrityCheck("create");
            const nickname = createNicknameInput.value;
            const password = createPasswordInput.value;
            const body = jsonStringify({ nickname, password });
            const requestOptions = {
                method: "POST",
                body,
            };
            const response = yield fetch("api/createChatRoom", requestOptions);
            if (!response.ok)
                throw Error("Creating chat room failed.");
            const { chatRoomId, clientId, token } = yield response.json();
            writeLocalSessionData({
                chatRoomId,
                clientId,
                nickname,
                token,
            });
            window.location.assign(window.location.origin + "/chatRoom");
        }
        catch (e) {
            alert(e.message);
        }
    });
}
function joinChatRoomRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            inputsIntegrityCheck("join");
            const chatRoomId = joinChatRoomIdInput.value;
            const nickname = joinNicknameInput.value;
            const password = joinPasswordInput.value;
            const body = jsonStringify({ chatRoomId, nickname, password });
            const requestOptions = {
                method: "POST",
                body,
            };
            const response = yield fetch("api/joinChatRoom", requestOptions);
            if (!response.ok)
                throw Error("Joining chat room failed.");
            const { clientId, token } = yield response.json();
            writeLocalSessionData({
                chatRoomId,
                clientId,
                nickname,
                token,
            });
            window.location.assign(window.location.origin + "/chatRoom");
        }
        catch (e) {
            alert(e.message);
        }
    });
}
function eventListenersInit() {
    // Create chat room form.
    createChatRoomButton.addEventListener("click", showCreateForm);
    createNicknameInput.addEventListener("keypress", onInputEnterPress);
    createPasswordInput.addEventListener("keypress", onInputEnterPress);
    passwordInputRepeat.addEventListener("keypress", onInputEnterPress);
    createOkButton.addEventListener("click", createChatRoomRequest);
    createCancelButton.addEventListener("click", showStartButtonsWrapper);
    // Join chat room form.
    joinChatRoomButton.addEventListener("click", showJoinForm);
    joinOkButton.addEventListener("click", joinChatRoomRequest);
    joinCancelButton.addEventListener("click", showStartButtonsWrapper);
}
window.onload = () => {
    checkSessionData();
    eventListenersInit();
    chatRoomAddressCheck();
};
