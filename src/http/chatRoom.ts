import { WebSocket } from "ws";
import { ChatClient } from "./chatClient.js";

class ChatRoom {
  id: string;
  adminId: string;
  adminToken: string;
  password: string;
  clients: ChatClient[];

  constructor(
    id: string,
    adminId: string,
    adminToken: string,
    password: string
  ) {
    this.id = id;
    this.adminId = adminId;
    this.adminToken = adminToken;
    this.password = password;
    this.clients = [];
  }

  isAdmin(id: string, token: string) {
    return this.adminId === id && this.adminToken === token;
  }

  getClientById(clientId: string) {
    return this.clients.find((client) => client.clientId === clientId);
  }

  getAllClientConnections() {
    return this.clients.map((client) => client.currentConnection);
  }

  setAdminId(id: string) {
    this.adminId = id;
  }

  setAdminToken(token: string) {
    this.adminToken = token;
  }

  addClient(client: ChatClient) {
    this.clients.push(client);
  }

  deleteClient(clientId: string) {
    this.getClientById(clientId)?.currentConnection?.close();
    this.clients = this.clients.filter(
      (client) => client.clientId !== clientId
    );
    if (!this.clients.length) {
      chatRoomsList.filter((chatRoom) => chatRoom.id !== this.id);
      console.log("Chat room " + this.id + " is empty and is being deleted.");
    }
  }

  addClientConnection(clientId: string, connection: WebSocket) {
    const client = this.getClientById(clientId);
    connection.on("close", () => {
      console.log(clientId + " connection dropped.");
    });
    client!.addConnection(connection);
  }
}

const chatRoomsList: ChatRoom[] = [];

function getChatRoomById(id: string) {
  return chatRoomsList.find((room) => room.id === id);
}

export { ChatRoom, chatRoomsList, getChatRoomById };
