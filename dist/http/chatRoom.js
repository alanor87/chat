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
        var _a, _b;
        (_b = (_a = this.getClientById(clientId)) === null || _a === void 0 ? void 0 : _a.currentConnection) === null || _b === void 0 ? void 0 : _b.close();
        this.clients = this.clients.filter((client) => client.clientId !== clientId);
        if (!this.clients.length) {
            chatRoomsList.filter((chatRoom) => chatRoom.id !== this.id);
            console.log("Chat room " + this.id + " is empty and is being deleted.");
        }
    }
    addClientConnection(clientId, connection) {
        const client = this.getClientById(clientId);
        connection.on("close", () => {
            console.log(clientId + " connection dropped.");
        });
        client.addConnection(connection);
    }
}
const chatRoomsList = [];
function getChatRoomById(id) {
    return chatRoomsList.find((room) => room.id === id);
}
export { ChatRoom, chatRoomsList, getChatRoomById };
