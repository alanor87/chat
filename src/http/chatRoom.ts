import { WebSocket } from "ws";
import { ChatClient } from "./chatClient.js";

class ChatRoom {
  id: string;
  adminId: string;
  password: string;
  clients: ChatClient[];

  constructor(id: string, adminId: string, password: string) {
    this.id = id;
    this.adminId = adminId;
    this.password = password;
    this.clients = [];
  }

  addClient(client: ChatClient) {
    this.clients.push(client);
  }

  addClientConnection(clientId: string, connection: WebSocket) {
    const client = this.getClientById(clientId);
    client!.addConnection(connection);
  }

  setAdminId(id: string) {
    this.adminId = id;
  }

  getClientById(clientId: string) {
    return this.clients.find((client) => client.clientId === clientId);
  }

  getAllClientConnections() {
    return this.clients.map(client => client.currentConnection)
  }
}

const chatRoomsList: ChatRoom[] = [];

function getChatRoomById(id: string) {
  return chatRoomsList.find((room) => room.id === id);
}

export { ChatRoom, chatRoomsList, getChatRoomById };
