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
    clientsList: document.querySelector("#clientsList"),
    newClientNotificationsList: document.querySelector("#newClientNotificationsList"),
    inviteLinkCopyButton: document.querySelector("#inviteLinkCopyButton"),
};

function logout(message) {
    if (message === void 0) { message = "An error has occured, logging out."; }
    alert(message);
    sessionStorage.clear();
    window.location.replace(window.location.origin);
}

function createMessageElement(messageType, messageText) {
    var messageElement = document.createElement("div");
    messageElement.classList.add("message", messageType);
    messageElement.innerText = messageText;
    refs.messagesList.appendChild(messageElement);
}
function createNewClientNotification(newClient) {
    var messageElement = document.createElement("div");
    messageElement.classList.add("newClientNotification", newClient);
    messageElement.innerText = newClient + " has joined.";
    refs.newClientNotificationsList.appendChild(messageElement);
    setTimeout(function () {
        refs.newClientNotificationsList.removeChild(messageElement);
    }, 3000);
}

function jsonParse(string) {
    return JSON.parse(string);
}

var _a;
var sessionAuthData = (_a = {},
    _a["chatRoomId"] = "",
    _a["clientId"] = "",
    _a["token"] = "",
    _a);

function wsClientRouter(message) {
    var parsedWsMessage = jsonParse(message);
    switch (parsedWsMessage.method) {
        // Connection is automatically closed by server in case of auth failure, logging out.
        case "client_init": {
            var result = parsedWsMessage.data.result;
            if (result === "error")
                logout("Server closed the onnection.");
            break;
        }
        case "new_message": {
            var data = parsedWsMessage.data;
            var messageType = data.fromClientId === sessionAuthData.clientId
                ? "outcoming"
                : "incoming";
            createMessageElement(messageType, data.message);
            break;
        }
        case "welcome_message": {
            createMessageElement("welcome", parsedWsMessage.data.message);
            break;
        }
        case "message_status_changed": {
            break;
        }
        case "new_client": {
            createNewClientNotification(parsedWsMessage.data.newClientId);
            break;
        }
    }
}

function jsonStringify(object) {
    return JSON.stringify(object);
}

var wsClient;
function sendMessage() {
    var messageText = refs.userInput.value;
    var newClientMessage = {
        method: "new_message",
        data: {
            chatRoomId: sessionAuthData.chatRoomId,
            fromClientId: sessionAuthData.clientId,
            message: messageText,
        },
    };
    var message = jsonStringify(newClientMessage);
    refs.userInput.value = "";
    wsClient.send(message);
}
function onInputEnterPress(e) {
    console.log(e);
    if (e.key === "Enter")
        sendMessage();
}
function inviteLinkCopy() {
    window.navigator.clipboard.writeText(window.location.origin + "/?chatRoomId=" + sessionAuthData.chatRoomId);
}
function sessionStorageInit() {
    Object.keys(sessionAuthData).forEach(function (item) {
        sessionAuthData[item] = sessionStorage.getItem(item);
        if (!sessionAuthData[item])
            throw Error(item + " data is missing. Logging out.");
    });
}
function eventListenersInit() {
    refs.userInput.addEventListener("keypress", onInputEnterPress);
    refs.sendMessageButton.addEventListener("click", sendMessage);
    refs.inviteLinkCopyButton.addEventListener("click", inviteLinkCopy);
    window.addEventListener("click", function (e) {
        var chosenEntry = e.target;
        var classList = chosenEntry.classList.value;
        if (classList.includes("clientEntry")) {
            chosenEntry.id;
            chosenEntry.classList.add("selected");
        }
    });
}
function wsClientInit() {
    console.log(window.location.hostname);
    wsClient = new WebSocket("ws://" + window.location.host);
    // Sending the auth data on opening the socket connection.
    wsClient.onopen = function (e) {
        return wsClient.send(jsonStringify({ method: "client_init", data: sessionAuthData }));
    };
    // Incoming messages are being handled depending on their 'method' field in a dedicated router.
    wsClient.onmessage = function (e) {
        wsClientRouter(e.data);
    };
    wsClient.onclose = function () { return console.log("Socket connection closed."); };
}
// Sending the auth data on opening the page load.
function chatRoomAuthorization() {
    return __awaiter(this, void 0, void 0, function () {
        var headers, body, requestOptions, response, responceText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = new Headers({
                        Authorization: "Bearer " + sessionAuthData.token,
                    });
                    body = jsonStringify(sessionAuthData);
                    requestOptions = { method: "POST", headers: headers, body: body };
                    return [4 /*yield*/, fetch("api/chatRoomAuthorization", requestOptions)];
                case 1:
                    response = _a.sent();
                    if (!(response.status === 401)) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    responceText = _a.sent();
                    throw new Error("Authorization failure. " + responceText);
                case 3: return [2 /*return*/];
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
