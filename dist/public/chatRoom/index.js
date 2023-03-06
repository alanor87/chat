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

const refs = {
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

function logout(message = "An error has occured, logging out.") {
    alert(message);
    localStorage.clear();
    window.location.replace(window.location.origin);
}

function createMessageElement({ messageType, message, toClientNickname, fromClientNickname, }) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", messageType);
    const appendToClientTag = (nickname) => {
        const to = document.createElement("span");
        to.classList.add("to");
        to.innerText = "@" + nickname;
        messageElement.append(to, ", ");
    };
    const appendFromClientTag = (nickname) => {
        const from = document.createElement("span");
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
            appendFromClientTag(fromClientNickname || "");
            if (toClientNickname)
                appendToClientTag(toClientNickname);
            messageElement.append(message);
            break;
        }
    }
    refs.messagesList.appendChild(messageElement);
}
function createAnnouncementElement(notification) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("notification");
    messageElement.innerText = notification;
    refs.notificationStackBlock.appendChild(messageElement);
    setTimeout(() => {
        refs.notificationStackBlock.removeChild(messageElement);
    }, 3000);
}
function createClientEntryElement(clientListEntry) {
    const newClientEntry = document.createElement("li");
    const disconnectedStatusIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    disconnectedStatusIcon.classList.add("icon", "hidden");
    disconnectedStatusIcon.innerHTML =
        '<use href="public/img/sprite.svg#icon_connection_lost"></use>';
    newClientEntry.classList.add("clientEntry");
    if (clientListEntry.selected)
        newClientEntry.classList.add("selected");
    newClientEntry.setAttribute("data-client-id", clientListEntry.clientId);
    newClientEntry.append(clientListEntry.nickname, disconnectedStatusIcon);
    return newClientEntry;
}
function toggleCleintEntryConnectionStatus(clientId, online) {
    const clientEntryStatusIcon = refs
        .clientsList.querySelector(`[data-client-id='${clientId}']`)
        .querySelector("svg");
    online
        ? clientEntryStatusIcon.classList.add("hidden")
        : clientEntryStatusIcon.classList.remove("hidden");
}
function clientsListRender(clientsList) {
    const clientsListElements = clientsList.map((clientListEntry) => createClientEntryElement(clientListEntry));
    refs.clientsList.innerHTML = "";
    refs.clientsList.append(...clientsListElements);
}

function jsonParse(string) {
    return JSON.parse(string);
}

const sessionData = {
    ["chatRoomId"]: "",
    ["clientId"]: "",
    ["token"]: "",
    ["nickname"]: "",
    ["isAdmin"]: "",
};

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
class ObservableList {
    constructor(callbacks) {
        _ObservableList_list.set(this, void 0);
        this.callbacks = callbacks;
        __classPrivateFieldSet(this, _ObservableList_list, [], "f");
    }
    get getAll() {
        return __classPrivateFieldGet(this, _ObservableList_list, "f");
    }
    /** Adding element to list */
    add(element) {
        var _a;
        __classPrivateFieldSet(this, _ObservableList_list, [...__classPrivateFieldGet(this, _ObservableList_list, "f"), element], "f");
        (_a = this.callbacks) === null || _a === void 0 ? void 0 : _a.onAdd(this.getAll);
    }
    /** Edit list element
     * @param  { field: keyof T; value: string | undefined } elementToEdit - the field name and field value of the element needed to be edited.
     * @param { Partial<T>} newData - the field name to change and the new value for it.
     */
    edit({ field, value }, newData) {
        var _a;
        if (!field || !value)
            return;
        const indexTochange = __classPrivateFieldGet(this, _ObservableList_list, "f").findIndex((element) => {
            return element[field] === value;
        });
        const newList = [...__classPrivateFieldGet(this, _ObservableList_list, "f")];
        newList[indexTochange] = Object.assign(Object.assign({}, newList[indexTochange]), newData);
        __classPrivateFieldSet(this, _ObservableList_list, [...newList], "f");
        (_a = this.callbacks) === null || _a === void 0 ? void 0 : _a.onEdit(this.getAll);
    }
    /** Edit all list elements.
     *  @param {Partial<T>} newData - the field name to change for all list elements and the new value for it.
     */
    editAll(newData) {
        var _a;
        __classPrivateFieldSet(this, _ObservableList_list, __classPrivateFieldGet(this, _ObservableList_list, "f").map((entry) => (Object.assign(Object.assign({}, entry), newData))), "f");
        (_a = this.callbacks) === null || _a === void 0 ? void 0 : _a.onEditAll(this.getAll);
    }
    /** Removing one element.
     *  @param {field: keyof T; value: string | undefined } elementToRemove  - the field name and its value of the element to be removed.
     */
    remove({ field, value }) {
        var _a;
        __classPrivateFieldSet(this, _ObservableList_list, __classPrivateFieldGet(this, _ObservableList_list, "f").filter((element) => element[field] !== value), "f");
        (_a = this.callbacks) === null || _a === void 0 ? void 0 : _a.onRemove(this.getAll);
    }
    /** Finding one element.
     *  @param {field: keyof T; value: string | undefined } elementToFind  - the field name and its value of the element to be found.
     */
    find({ field, value }) {
        if (!value)
            return undefined;
        return __classPrivateFieldGet(this, _ObservableList_list, "f").find((element) => element[field] === value);
    }
}
_ObservableList_list = new WeakMap();

let clientsListEntries = new ObservableList({
    onAdd: clientsListRender,
    onRemove: clientsListRender,
    onEdit: clientsListRender,
    onEditAll: clientsListRender,
});

function wsClientRouter(message) {
    var _a;
    const parsedWsMessage = jsonParse(message);
    switch (parsedWsMessage.method) {
        // Connection is automatically closed by server in case of auth failure, logging out.
        case "client_init_response": {
            const { result } = parsedWsMessage.data;
            if (result === "error")
                logout("Server closed the onnection.");
            break;
        }
        case "new_message_broadcast": {
            const { fromClientId, fromClientNickname, toClientId, message } = parsedWsMessage.data;
            const { messagesList } = refs;
            const messageType = fromClientId === sessionData.clientId ? "outcoming" : "incoming";
            const wasScrolledToBottom = Math.abs(messagesList.scrollHeight -
                messagesList.clientHeight -
                messagesList.scrollTop) < 1;
            const toClientNickname = (_a = clientsListEntries.find({
                field: "clientId",
                value: toClientId,
            })) === null || _a === void 0 ? void 0 : _a.nickname;
            createMessageElement({
                messageType,
                message,
                fromClientNickname,
                toClientNickname,
            });
            // Scrolling on new message only if the messages list was scrolled to bottom on message arrival.
            if (wasScrolledToBottom)
                messagesList === null || messagesList === void 0 ? void 0 : messagesList.scrollTo({ top: messagesList === null || messagesList === void 0 ? void 0 : messagesList.clientHeight });
            break;
        }
        case "welcome_message": {
            const { message } = parsedWsMessage.data;
            createMessageElement({ messageType: "welcome", message });
            break;
        }
        case "announcement_broadcast": {
            const { message, reason } = parsedWsMessage.data;
            switch (reason) {
                case "client_join": {
                    const { nickname, clientId } = parsedWsMessage.data;
                    clientsListEntries.add({
                        nickname,
                        clientId,
                    });
                    break;
                }
                case "client_connection_down": {
                    const { clientId } = parsedWsMessage.data;
                    toggleCleintEntryConnectionStatus(clientId, false);
                    break;
                }
                case "client_connection_up": {
                    const { clientId } = parsedWsMessage.data;
                    console.log('client connectopn up');
                    toggleCleintEntryConnectionStatus(clientId, true);
                    break;
                }
                case "client_exit": {
                    const { clientId } = parsedWsMessage.data;
                    clientsListEntries.remove({ field: "clientId", value: clientId });
                    break;
                }
            }
            createAnnouncementElement(message);
            break;
        }
    }
}

function jsonStringify(object) {
    return JSON.stringify(object);
}

let selectedClienttId;
let wsClient;
let pingIntervalId;
function startPing() {
    pingIntervalId = setInterval(() => {
        if (wsClient.readyState === wsClient.OPEN)
            wsClient.send(jsonStringify({ method: "ping", data: {} }));
    }, 10000);
}
function stopPing() {
    clearInterval(pingIntervalId);
}
/** Even listener for the click on a client entry is assigned to the whole entries list,
 * so no need to have a separate listener for each entry.
 */
function onClientEntryClick(e) {
    try {
        const chosenEntry = e.target;
        if (chosenEntry.classList.contains("clientEntry")) {
            selectedClienttId = chosenEntry.dataset.clientId;
            const clientEntry = clientsListEntries.find({
                field: "clientId",
                value: selectedClienttId,
            });
            refs.userInput.value = `@${clientEntry === null || clientEntry === void 0 ? void 0 : clientEntry.nickname}, `;
            refs.userInput.selectionEnd = refs.userInput.value.length;
            const isSelected = clientEntry === null || clientEntry === void 0 ? void 0 : clientEntry.selected;
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
    const messageText = ((_b = refs.userInput) === null || _b === void 0 ? void 0 : _b.value.replace(/@[^,]*,/, "")) || "";
    console.log(messageText);
    const newClientMessage = {
        method: "new_message",
        data: {
            chatRoomId: sessionData.chatRoomId,
            fromClientId: sessionData.clientId,
            toClientId: selectedClienttId,
            message: messageText,
        },
    };
    const message = jsonStringify(newClientMessage);
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
    const display = getComputedStyle(refs.sideBar).display;
    refs.sideBar.style.display = display === "flex" ? "none" : "flex";
}
function exitChat() {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = new Headers({
            Authorization: "Bearer " + sessionData.token,
        });
        const { chatRoomId, clientId } = sessionData;
        const body = jsonStringify({ chatRoomId, clientId });
        const requestOptions = { method: "POST", headers, body };
        yield fetch("api/exitChatRoom", requestOptions);
    });
}
function localStorageInit() {
    Object.keys(sessionData).forEach((item) => {
        sessionData[item] = localStorage.getItem(item);
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
    const { chatRoomId, clientId, token } = sessionData;
    wsClient.onopen = (e) => wsClient.send(jsonStringify({
        method: "client_init_request",
        data: { chatRoomId, clientId, token },
    }));
    startPing();
    // Incoming messages are being handled depending on their 'method' field in a dedicated router.
    wsClient.onmessage = (e) => {
        wsClientRouter(e.data);
    };
    wsClient.onclose = (event) => {
        stopPing();
        logout("Socket connection closed. " + event.reason);
    };
}
// Sending the auth data on opening the page load.
function chatRoomAuthorization() {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = new Headers({
            Authorization: "Bearer " + sessionData.token,
        });
        const { chatRoomId, clientId } = sessionData;
        const body = jsonStringify({ chatRoomId, clientId });
        const requestOptions = { method: "POST", headers, body };
        const response = yield fetch("api/chatRoomAuthorization", requestOptions);
        if (response.status === 401) {
            const responceText = yield response.text();
            throw new Error("Authorization failure. " + responceText);
        }
        const { isAdmin, clientsList } = yield response.json();
        clientsList.forEach((client) => clientsListEntries.add(client));
        localStorage.setItem("isAdmin", isAdmin);
        sessionData.isAdmin = isAdmin;
    });
}
function chatRoomInit() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            localStorageInit();
            yield chatRoomAuthorization();
            adminComponentsInit();
            wsClientInit();
            eventListenersInit();
        }
        catch (e) {
            logout(e.message);
        }
    });
}
window.onload = () => {
    chatRoomInit();
};
