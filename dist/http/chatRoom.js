import { color } from "../helpers/logging.js";
import { jsonStringify as s } from "../helpers/jsonStringify.js";
class ChatRoom {
    constructor(id, adminId, adminToken, password) {
        this.id = id;
        this.adminId = adminId;
        this.adminToken = adminToken;
        this.password = password;
        this.clients = [];
    }
    isAdmin(id, token) {
        return this.adminId === id && this.adminToken === token;
    }
    getClientById(clientId) {
        return this.clients.find((client) => client.clientId === clientId);
    }
    getAllClientConnections() {
        return this.clients.map((client) => client.currentConnection);
    }
    setAdminId(id) {
        this.adminId = id;
    }
    setAdminToken(token) {
        this.adminToken = token;
    }
    addClient(client) {
        this.clients.push(client);
    }
    deleteClient(clientId) {
        var _a;
        const clientToDelete = this.getClientById(clientId);
        (_a = clientToDelete === null || clientToDelete === void 0 ? void 0 : clientToDelete.currentConnection) === null || _a === void 0 ? void 0 : _a.close();
        this.clients = this.clients.filter((client) => client.clientId !== clientId);
    }
    addClientConnection(clientId, connection) {
        const client = this.getClientById(clientId);
        connection.on("close", () => {
            console.log("Client " + color('yellow', clientId) + color("red", " connection dropped."));
        });
        client.addConnection(connection);
    }
    broadcast(message) {
        this.getAllClientConnections().forEach((connection) => {
            if (connection)
                connection.send(s(message));
        });
    }
}
let chatRoomsList = [];
function getChatRoomById(id) {
    return chatRoomsList.find((room) => room.id === id);
}
function deleteChatRoom(chatRoomId, reason = 'not defined') {
    var _a;
    console.log('Deleting chat room ' + color("yellow", chatRoomId) + '. Reason : \n ' + reason);
    (_a = getChatRoomById(chatRoomId)) === null || _a === void 0 ? void 0 : _a.clients.forEach(client => { var _a; return (_a = client === null || client === void 0 ? void 0 : client.currentConnection) === null || _a === void 0 ? void 0 : _a.close(1000, reason); });
    chatRoomsList = chatRoomsList.filter((chatRoom) => chatRoom.id !== chatRoomId);
}
export { ChatRoom, chatRoomsList, getChatRoomById, deleteChatRoom };
