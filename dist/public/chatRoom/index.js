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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

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

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

var refs = {
    userInput: document.querySelector("#userInput"),
    sendMessageButton: document.querySelector("#sendMessageButton"),
    messagesList: document.querySelector("#messagesList"),
    sideBar: document.querySelector("#sideBar"),
    sideBarCloseButton: document.querySelector("#sideBarCloseButton"),
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
    var messageType = _a.messageType, message = _a.message, toClientNickname = _a.toClientNickname, fromClientNickname = _a.fromClientNickname;
    var messageElement = document.createElement("div");
    messageElement.classList.add("message", messageType);
    var appendToClientTag = function (nickname) {
        var to = document.createElement("span");
        to.classList.add("to");
        to.innerText = "@" + nickname;
        messageElement.append(to, ", ");
    };
    var appendFromClientTag = function (nickname) {
        var from = document.createElement("span");
        from.classList.add("from");
        from.innerText = nickname;
        messageElement.append(from, "  :  ");
    };
    switch (messageType) {
        case "welcome": {
            messageElement.innerText = message;
            break;
        }
        case "outcoming": {
            if (toClientNickname)
                appendToClientTag(toClientNickname);
            messageElement.append(message);
            break;
        }
        case "incoming": {
            appendFromClientTag(fromClientNickname || '');
            if (toClientNickname)
                appendToClientTag(toClientNickname);
            messageElement.append(message);
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
function createClientEntryElement(clientListEntry) {
    var newClientEntry = document.createElement("li");
    newClientEntry.classList.add("clientEntry");
    if (clientListEntry.selected)
        newClientEntry.classList.add("selected");
    newClientEntry.setAttribute("data-client-id", clientListEntry.clientId);
    newClientEntry.innerText = clientListEntry.nickname;
    return newClientEntry;
}
function clientsListRender(clientsList) {
    var _a;
    var clientsListElements = clientsList.map(function (clientListEntry) {
        return createClientEntryElement(clientListEntry);
    });
    refs.clientsList.innerHTML = "";
    (_a = refs.clientsList).append.apply(_a, clientsListElements);
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

/** Creating an array instance with callbacks being hooked to defined array methods.
 * @param callbacks : object with keys - names of the array (or custom) methods to be redefined, and values - callbacks, that
 * are hooked to these methods. Callback gets the array as an argument.
 */
var _ObservableList_list;
/** Creating of observable array of objects (not literals)
 * @namespace {T} ObservableList
 * @param { [key in ListMethods]: (args?: any) => void } callbacks - list of objects mapped to observable array events :
 * "onAdd" | "onRemove" | "onEdit" | "onEditAll".
 * Each of events is a field name -  callback os the value.
 * The callback is given the actual elements list as an argument on it's call.
 */
var ObservableList = /** @class */ (function () {
    function ObservableList(callbacks) {
        _ObservableList_list.set(this, void 0);
        this.callbacks = callbacks;
        __classPrivateFieldSet(this, _ObservableList_list, [], "f");
    }
    Object.defineProperty(ObservableList.prototype, "getAll", {
        get: function () {
            return __classPrivateFieldGet(this, _ObservableList_list, "f");
        },
        enumerable: false,
        configurable: true
    });
    /** Adding element to list */
    ObservableList.prototype.add = function (element) {
        var _a;
        __classPrivateFieldSet(this, _ObservableList_list, __spreadArray(__spreadArray([], __classPrivateFieldGet(this, _ObservableList_list, "f"), true), [element], false), "f");
        (_a = this.callbacks) === null || _a === void 0 ? void 0 : _a.onAdd(__classPrivateFieldGet(this, _ObservableList_list, "f"));
    };
    /** Edit list element
     * @param  { field: keyof T; value: string | undefined } elementToEdit - the field name and field value of the element neede to be edited.
     * @param { Partial<T>} newData - the field name to change and the new value for it.
     */
    ObservableList.prototype.edit = function (_a, newData) {
        var _b;
        var field = _a.field, value = _a.value;
        if (!field || !value)
            return;
        var indexTochange = __classPrivateFieldGet(this, _ObservableList_list, "f").findIndex(function (element) {
            return element[field] === value;
        });
        var newList = __spreadArray([], __classPrivateFieldGet(this, _ObservableList_list, "f"), true);
        newList[indexTochange] = __assign(__assign({}, newList[indexTochange]), newData);
        __classPrivateFieldSet(this, _ObservableList_list, __spreadArray([], newList, true), "f");
        (_b = this.callbacks) === null || _b === void 0 ? void 0 : _b.onEdit(__classPrivateFieldGet(this, _ObservableList_list, "f"));
    };
    /** Edit all list elements.
     *  @param {field: keyof T; value: string | undefined }  newData - the field name to change for all list elements and the new value for it.
     */
    ObservableList.prototype.editAll = function (newData) {
        var _a;
        __classPrivateFieldSet(this, _ObservableList_list, __classPrivateFieldGet(this, _ObservableList_list, "f").map(function (entry) { return (__assign(__assign({}, entry), newData)); }), "f");
        (_a = this.callbacks) === null || _a === void 0 ? void 0 : _a.onEditAll(__classPrivateFieldGet(this, _ObservableList_list, "f"));
    };
    /** Removing one element.
     *  @param {field: keyof T; value: string | undefined } elementToRemove  - the field name to change for all list elements and the new value for it.
     */
    ObservableList.prototype.remove = function (_a) {
        var _b;
        var field = _a.field, value = _a.value;
        __classPrivateFieldSet(this, _ObservableList_list, __classPrivateFieldGet(this, _ObservableList_list, "f").filter(function (element) { return element[field] !== value; }), "f");
        (_b = this.callbacks) === null || _b === void 0 ? void 0 : _b.onRemove(__classPrivateFieldGet(this, _ObservableList_list, "f"));
    };
    /** Finding one element.
     *  @param {field: keyof T; value: string | undefined } elementToFind  - the field name to change for all list elements and the new value for it.
     */
    ObservableList.prototype.find = function (_a) {
        var field = _a.field, value = _a.value;
        if (!value)
            return undefined;
        return __classPrivateFieldGet(this, _ObservableList_list, "f").find(function (element) { return element[field] === value; });
    };
    return ObservableList;
}());
_ObservableList_list = new WeakMap();

var clientsListEntries = new ObservableList({
    onAdd: clientsListRender,
    onRemove: clientsListRender,
    onEdit: clientsListRender,
    onEditAll: clientsListRender,
});

function wsClientRouter(message) {
    var _a;
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
            var _b = parsedWsMessage.data, fromClientId = _b.fromClientId, fromClientNickname = _b.fromClientNickname, toClientId = _b.toClientId, message_1 = _b.message;
            var messagesList = refs.messagesList;
            var messageType = fromClientId === sessionData.clientId ? "outcoming" : "incoming";
            var wasScrolledToBottom = Math.abs(messagesList.scrollHeight -
                messagesList.clientHeight -
                messagesList.scrollTop) < 1;
            var toClientNickname = (_a = clientsListEntries.find({ field: 'clientId', value: toClientId })) === null || _a === void 0 ? void 0 : _a.nickname;
            createMessageElement({
                messageType: messageType,
                message: message_1,
                fromClientNickname: fromClientNickname,
                toClientNickname: toClientNickname,
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
            var _c = parsedWsMessage.data, message_3 = _c.message, reason = _c.reason;
            switch (reason) {
                case "client_join": {
                    var _d = parsedWsMessage.data, nickname = _d.nickname, clientId = _d.clientId;
                    if (clientsListEntries.find({ field: 'clientId', value: clientId }))
                        break;
                    clientsListEntries.add({
                        nickname: nickname,
                        clientId: clientId,
                    });
                    break;
                }
                case "client_exit": {
                    var clientId = parsedWsMessage.data.clientId;
                    clientsListEntries.remove({ field: 'clientId', value: clientId });
                    break;
                }
            }
            createAnnouncementElement(message_3);
            break;
        }
    }
}

function jsonStringify(object) {
    return JSON.stringify(object);
}

var selectedClienttId;
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
function onClientEntryClick(e) {
    try {
        var chosenEntry = e.target;
        if (chosenEntry.classList.contains("clientEntry")) {
            selectedClienttId = chosenEntry.dataset.clientId;
            var clientEntry = clientsListEntries.find({
                field: "clientId",
                value: selectedClienttId,
            });
            refs.userInput.value = "@".concat(clientEntry === null || clientEntry === void 0 ? void 0 : clientEntry.nickname, ", ");
            var isSelected = clientEntry === null || clientEntry === void 0 ? void 0 : clientEntry.selected;
            clientsListEntries.editAll({ selected: false });
            clientsListEntries.edit({ field: "clientId", value: selectedClienttId }, { selected: !isSelected });
        }
    }
    catch (e) {
        console.log(e);
    }
}
function sendMessage() {
    var _a, _b;
    if (!((_a = refs.userInput) === null || _a === void 0 ? void 0 : _a.value))
        return;
    var messageText = ((_b = refs.userInput) === null || _b === void 0 ? void 0 : _b.value.replace(/@.*,/, "")) || "";
    console.log(messageText);
    var newClientMessage = {
        method: "new_message",
        data: {
            chatRoomId: sessionData.chatRoomId,
            fromClientId: sessionData.clientId,
            toClientId: selectedClienttId,
            message: messageText,
        },
    };
    var message = jsonStringify(newClientMessage);
    refs.userInput.value = "";
    clientsListEntries.editAll({ selected: false });
    wsClient.send(message);
    selectedClienttId = undefined;
}
function onInputEnterPress(e) {
    if (e.key === "Enter")
        sendMessage();
}
function inviteLinkCopy() {
    window.navigator.clipboard.writeText(window.location.origin + "/?chatRoomId=" + sessionData.chatRoomId);
    createAnnouncementElement("Chat room link is copied to clipboard.");
}
function toggleSideBar() {
    var display = getComputedStyle(refs.sideBar).display;
    refs.sideBar.style.display = display === "flex" ? "none" : "flex";
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
        refs.sideBarCloseButton.addEventListener("click", toggleSideBar);
        refs.clientsListButton.addEventListener("click", toggleSideBar);
        refs.exitChatButton.addEventListener("click", exitChat);
        refs.clientsList.addEventListener("click", onClientEntryClick);
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
        var headers, chatRoomId, clientId, body, requestOptions, response, responceText, _a, isAdmin, clientsList;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    headers = new Headers({
                        Authorization: "Bearer " + sessionData.token,
                    });
                    chatRoomId = sessionData.chatRoomId, clientId = sessionData.clientId;
                    body = jsonStringify({ chatRoomId: chatRoomId, clientId: clientId });
                    requestOptions = { method: "POST", headers: headers, body: body };
                    return [4 /*yield*/, fetch("api/chatRoomAuthorization", requestOptions)];
                case 1:
                    response = _b.sent();
                    if (!(response.status === 401)) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    responceText = _b.sent();
                    throw new Error("Authorization failure. " + responceText);
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    _a = _b.sent(), isAdmin = _a.isAdmin, clientsList = _a.clientsList;
                    clientsList.forEach(function (client) {
                        clientsListEntries.add(client);
                    });
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
