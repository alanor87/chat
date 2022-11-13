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

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var refs = {
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

var startButtonsWrapper = refs.startButtonsWrapper, createChatRoomButton = refs.createChatRoomButton, joinChatRoomButton = refs.joinChatRoomButton, _a = refs.createChatRoom, createNicknameInput = _a.createNicknameInput, createPasswordInput = _a.createPasswordInput, passwordInputRepeat = _a.passwordInputRepeat, createOkButton = _a.createOkButton, createCancelButton = _a.createCancelButton, createForm = _a.createForm, _b = refs.joinChatRoom, joinNicknameInput = _b.joinNicknameInput, joinPasswordInput = _b.joinPasswordInput, joinChatRoomIdInput = _b.joinChatRoomIdInput, joinOkButton = _b.joinOkButton, joinCancelButton = _b.joinCancelButton, joinForm = _b.joinForm;
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
}
function showJoinForm() {
    startButtonsWrapper.classList.add("hidden");
    createForm.classList.add("hidden");
    joinForm.classList.remove("hidden");
}
function inputsIntegrityCheck(formType) {
    switch (formType) {
        case "create": {
            if (createPasswordInput.value !== passwordInputRepeat.value)
                throw Error("Passwords do not match.");
            if (!createNicknameInput.value) {
                throw Error("Enter your nickname ывафыв.");
            }
            break;
        }
        case "join": {
            if (!joinNicknameInput.value)
                throw Error("Enter your nickname. sssss");
            if (!joinChatRoomIdInput.value)
                throw Error("Enter chat room id.");
            break;
        }
    }
}
function chatRoomAddressCheck() {
    var params = new URLSearchParams(window.location.search);
    var chatRoomId = params.get("chatRoomId");
    if (chatRoomId) {
        startButtonsWrapper.classList.add("hidden");
        createForm.classList.add("hidden");
        joinForm.classList.remove("hidden");
        joinChatRoomIdInput.value = chatRoomId;
        joinChatRoomIdInput.disabled = true;
    }
}
function writeLocalSessionData(_a) {
    var chatRoomId = _a.chatRoomId, clientId = _a.clientId, nickname = _a.nickname, token = _a.token;
    sessionStorage.setItem("chatRoomId", chatRoomId);
    sessionStorage.setItem("clientId", clientId);
    sessionStorage.setItem("nickname", nickname);
    sessionStorage.setItem("token", token);
}
function createChatRoomRequest() {
    return __awaiter(this, void 0, void 0, function () {
        var nickname, password, body, requestOptions, response, _a, chatRoomId, clientId, token, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    inputsIntegrityCheck("create");
                    nickname = createNicknameInput.value;
                    password = createPasswordInput.value;
                    body = jsonStringify({ nickname: nickname, password: password });
                    requestOptions = {
                        method: "POST",
                        body: body,
                    };
                    return [4 /*yield*/, fetch("api/createChatRoom", requestOptions)];
                case 1:
                    response = _b.sent();
                    if (!response.ok)
                        throw Error("Creating chat room failed.");
                    return [4 /*yield*/, response.json()];
                case 2:
                    _a = _b.sent(), chatRoomId = _a.chatRoomId, clientId = _a.clientId, token = _a.token;
                    writeLocalSessionData({
                        chatRoomId: chatRoomId,
                        clientId: clientId,
                        nickname: nickname,
                        isAdmin: true,
                        token: token,
                    });
                    window.location.assign(window.location.origin + "/chatRoom");
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    alert(e_1.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function joinChatRoomRequest() {
    return __awaiter(this, void 0, void 0, function () {
        var chatRoomId, nickname, password, body, requestOptions, response, _a, clientId, token, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    inputsIntegrityCheck("join");
                    chatRoomId = joinChatRoomIdInput.value;
                    nickname = joinNicknameInput.value;
                    password = joinPasswordInput.value;
                    body = jsonStringify({ chatRoomId: chatRoomId, nickname: nickname, password: password });
                    requestOptions = {
                        method: "POST",
                        body: body,
                    };
                    return [4 /*yield*/, fetch("api/joinChatRoom", requestOptions)];
                case 1:
                    response = _b.sent();
                    if (!response.ok)
                        throw Error("Joining chat room failed.");
                    return [4 /*yield*/, response.json()];
                case 2:
                    _a = _b.sent(), clientId = _a.clientId, token = _a.token;
                    writeLocalSessionData({
                        chatRoomId: chatRoomId,
                        clientId: clientId,
                        nickname: nickname,
                        isAdmin: false,
                        token: token,
                    });
                    window.location.assign(window.location.origin + "/chatRoom");
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _b.sent();
                    alert(e_2.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
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
window.onload = function () {
    eventListenersInit();
    chatRoomAddressCheck();
};
