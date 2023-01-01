import { WebSocket } from "ws";
import { color } from "../helpers/logging.js";
import { jsonStringify as s } from "../helpers/jsonStringify.js";
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
    const clientToDelete = this.getClientById(clientId);
    clientToDelete?.currentConnection?.close();
    this.clients = this.clients.filter(
      (client) => client.clientId !== clientId
    );
  }

  addClientConnection(clientId: string, connection: WebSocket) {
    const client = this.getClientById(clientId);
    connection.on("close", () => {
      console.log("Client " + color('yellow',clientId) + color("red"," connection dropped."));
    });
    client!.addConnection(connection);
  }

  broadcast(message: any) {
    this.getAllClientConnections().forEach((connection) => {
      if (connection) connection.send(s(message));
    });
  }
}

let chatRoomsList: ChatRoom[] = [];

function getChatRoomById(id: string) {
  return chatRoomsList.find((room) => room.id === id);
}

function deleteChatRoom(chatRoomId: string, reason = 'not defined') {
  console.log('Deleting chat room ' + color("yellow",chatRoomId) + '. Reason : \n ' + reason);
  getChatRoomById(chatRoomId)?.clients.forEach(client => client?.currentConnection?.close(1000, reason));
}

export { ChatRoom, chatRoomsList, getChatRoomById, deleteChatRoom };
