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
    userInput: document.querySelector("#userInput"),
    sendMessageButton: document.querySelector("#sendMessageButton"),
    messagesList: document.querySelector("#messagesList"),
    sideBar: document.querySelector("#sideBar"),
    clientsList: document.querySelector("#clientsList"),
    inviteLinkCopyButton: document.querySelector("#inviteLinkCopyButton"),
    clientsListButton: document.querySelector("#clientsListButton"),
    exitChatButton: document.querySelector("#exitChatButton"),
    notificationStackBlock: document.querySelector("#notificationStackBlock"),
};

function logout(message) {
    if (message === void 0) { message = "An error has occured, logging out."; }
    alert(message);
    sessionStorage.clear();
    window.location.replace(window.location.origin);
}

function createMessageElement(_a) {
    var messageType = _a.messageType, message = _a.message; _a.fromClientId; var fromClientNickname = _a.fromClientNickname;
    var messageElement = document.createElement("div");
    messageElement.classList.add("message", messageType);
    switch (messageType) {
        case "welcome": {
            messageElement.innerText = message;
            break;
        }
        case "incoming": {
            var from = document.createElement("span");
            from.innerText = fromClientNickname || "anon";
            messageElement.append(from, "  :  ", message);
            break;
        }
        case "outcoming": {
            var from = document.createElement("span");
            from.innerText = "you : ";
            messageElement.appendChild(from);
            messageElement.innerText = message;
            break;
        }
    }
    refs.messagesList.appendChild(messageElement);
}
function createAnnouncementElement(notification) {
    var messageElement = document.createElement("div");
    messageElement.classList.add("notification");
    messageElement.innerText = notification;
    refs.notificationStackBlock.appendChild(messageElement);
    setTimeout(function () {
        refs.notificationStackBlock.removeChild(messageElement);
    }, 3000);
}

function jsonParse(string) {
    return JSON.parse(string);
}

var _a;
var sessionData = (_a = {},
    _a["chatRoomId"] = "",
    _a["clientId"] = "",
    _a["token"] = "",
    _a["nickname"] = "",
    _a["isAdmin"] = "",
    _a);

function wsClientRouter(message) {
    var parsedWsMessage = jsonParse(message);
    switch (parsedWsMessage.method) {
        // Connection is automatically closed by server in case of auth failure, logging out.
        case "client_init_response": {
            var result = parsedWsMessage.data.result;
            if (result === "error")
                logout("Server closed the onnection.");
            break;
        }
        case "new_message_broadcast": {
            var _a = parsedWsMessage.data, fromClientId = _a.fromClientId, fromClientNickname = _a.fromClientNickname, toClientId = _a.toClientId, message_1 = _a.message;
            var messagesList = refs.messagesList;
            var messageType = fromClientId === sessionData.clientId ? "outcoming" : "incoming";
            var wasScrolledToBottom = Math.abs(messagesList.scrollHeight - messagesList.clientHeight - messagesList.scrollTop) < 1;
            createMessageElement({
                messageType: messageType,
                message: message_1,
                fromClientId: fromClientId,
                fromClientNickname: fromClientNickname,
                toClientId: toClientId,
            });
            // Scrolling on new message only if the messages list was scrolled to bottom on message arrival.
            if (wasScrolledToBottom)
                messagesList === null || messagesList === void 0 ? void 0 : messagesList.scrollTo({ top: messagesList === null || messagesList === void 0 ? void 0 : messagesList.clientHeight });
            break;
        }
        case "welcome_message": {
            var message_2 = parsedWsMessage.data.message;
            createMessageElement({ messageType: "welcome", message: message_2 });
            break;
        }
        case "announcement_broadcast": {
            var message_3 = parsedWsMessage.data.message;
            createAnnouncementElement(message_3);
            break;
        }
    }
}

function jsonStringify(object) {
    return JSON.stringify(object);
}

var selectedRecipientId;
var wsClient;
var pingIntervalId;
function startPing() {
    pingIntervalId = setInterval(function () {
        if (wsClient.readyState == wsClient.OPEN)
            wsClient.send(jsonStringify({ method: "ping", data: {} }));
    }, 10000);
}
function stopPing() {
    clearInterval(pingIntervalId);
}
function sendMessage() {
    if (!refs.userInput.value)
        return;
    var messageText = refs.userInput.value;
    var newClientMessage = {
        method: "new_message",
        data: {
            chatRoomId: sessionData.chatRoomId,
            fromClientId: sessionData.clientId,
            message: messageText,
        },
    };
    var message = jsonStringify(newClientMessage);
    refs.userInput.value = "";
    wsClient.send(message);
}
function onInputEnterPress(e) {
    if (e.key === "Enter")
        sendMessage();
}
function inviteLinkCopy() {
    window.navigator.clipboard.writeText(window.location.origin + "/?chatRoomId=" + sessionData.chatRoomId);
    createAnnouncementElement("Chat room link is copied to clipboard.");
}
function toggleClientsList() {
    refs.sideBar.classList.toggle("hidden");
}
function exitChat() {
    return __awaiter(this, void 0, void 0, function () {
        var headers, chatRoomId, clientId, body, requestOptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = new Headers({
                        Authorization: "Bearer " + sessionData.token,
                    });
                    chatRoomId = sessionData.chatRoomId, clientId = sessionData.clientId;
                    body = jsonStringify({ chatRoomId: chatRoomId, clientId: clientId });
                    requestOptions = { method: "POST", headers: headers, body: body };
                    return [4 /*yield*/, fetch("api/exitChatRoom", requestOptions)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function sessionStorageInit() {
    Object.keys(sessionData).forEach(function (item) {
        sessionData[item] = sessionStorage.getItem(item);
        if (!sessionData[item])
            throw Error(item + " data is missing. Logging out.");
    });
}
function adminComponentsInit() {
    if (sessionData.isAdmin === "isAdmin")
        refs.inviteLinkCopyButton.classList.remove("hidden");
}
function eventListenersInit() {
    try {
        refs.userInput.addEventListener("keypress", onInputEnterPress);
        refs.sendMessageButton.addEventListener("click", sendMessage);
        refs.inviteLinkCopyButton.addEventListener("click", inviteLinkCopy);
        refs.clientsListButton.addEventListener("click", toggleClientsList);
        refs.exitChatButton.addEventListener("click", exitChat);
        window.addEventListener("click", function (e) {
            var chosenEntry = e.target;
            var classList = chosenEntry.classList.value;
            if (classList.includes("clientEntry")) {
                selectedRecipientId = chosenEntry.id;
                chosenEntry.classList.add("selected");
            }
        });
    }
    catch (e) {
        console.log(e);
    }
}
function wsClientInit() {
    wsClient = new WebSocket("wss://" + window.location.host);
    // Sending the auth data on opening the socket connection.
    var chatRoomId = sessionData.chatRoomId, clientId = sessionData.clientId, token = sessionData.token;
    wsClient.onopen = function (e) {
        return wsClient.send(jsonStringify({
            method: "client_init_request",
            data: { chatRoomId: chatRoomId, clientId: clientId, token: token },
        }));
    };
    startPing();
    // Incoming messages are being handled depending on their 'method' field in a dedicated router.
    wsClient.onmessage = function (e) {
        wsClientRouter(e.data);
    };
    wsClient.onclose = function (event) {
        stopPing();
        logout("Socket connection closed. " + event.reason);
    };
}
// Sending the auth data on opening the page load.
function chatRoomAuthorization() {
    return __awaiter(this, void 0, void 0, function () {
        var headers, chatRoomId, clientId, body, requestOptions, response, responceText, isAdmin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = new Headers({
                        Authorization: "Bearer " + sessionData.token,
                    });
                    chatRoomId = sessionData.chatRoomId, clientId = sessionData.clientId;
                    body = jsonStringify({ chatRoomId: chatRoomId, clientId: clientId });
                    requestOptions = { method: "POST", headers: headers, body: body };
                    return [4 /*yield*/, fetch("api/chatRoomAuthorization", requestOptions)];
                case 1:
                    response = _a.sent();
                    if (!(response.status === 401)) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    responceText = _a.sent();
                    throw new Error("Authorization failure. " + responceText);
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    isAdmin = (_a.sent()).isAdmin;
                    sessionStorage.setItem("isAdmin", isAdmin);
                    sessionData.isAdmin = isAdmin;
                    return [2 /*return*/];
            }
        });
    });
}
function chatRoomInit() {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sessionStorageInit();
                    return [4 /*yield*/, chatRoomAuthorization()];
                case 1:
                    _a.sent();
                    adminComponentsInit();
                    wsClientInit();
                    eventListenersInit();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    logout(e_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
window.onload = function () {
    chatRoomInit();
};
