class ChatRoom {
    constructor(id, adminId, password) {
        this.id = id;
        this.adminId = adminId;
        this.password = password;
        this.clients = [];
    }
    addClient(client) {
        this.clients.push(client);
    }
    addClientConnection(clientId, connection) {
        const client = this.getClientById(clientId);
        client.addConnection(connection);
    }
    setAdminId(id) {
        this.adminId = id;
    }
    getClientById(clientId) {
        return this.clients.find((client) => client.clientId === clientId);
    }
    getAllClientConnections() {
        return this.clients.map(client => client.currentConnection);
    }
}
const chatRoomsList = [];
function getChatRoomById(id) {
    return chatRoomsList.find((room) => room.id === id);
}
export { ChatRoom, chatRoomsList, getChatRoomById };
