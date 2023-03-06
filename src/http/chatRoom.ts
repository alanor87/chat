import { WebSocket } from "ws";
import { color } from "../helpers/logging.js";
import { jsonStringify as s } from "../helpers/jsonStringify.js";
import { ChatClient } from "./chatClient.js";

const DELETE_CLIENT_TIMEOUT_VALUE = 10000;

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
    console.log("Client " + color("yellow", clientId) + " is deleted.");
    if (clientId === this.adminId) {
      deleteChatRoom(this.id, "Admin disconnected.");
    }
  }

  deleteClientTimeoutSet(client: ChatClient) {
    client.clientDeleteTimeoutId = setTimeout(() => {
      const announcementMessage = {
        method: "announcement_broadcast",
        data: {
          message: client?.nickname + " did not restore connection and being removed from chat room.",
          reason: "client_exit",
          clientId: client.clientId,
        },
      };

      this.broadcast(announcementMessage);
      this.deleteClient(client.clientId);
    }, DELETE_CLIENT_TIMEOUT_VALUE);
  }

  deleteClientTimeoutClear(timeoutId: NodeJS.Timeout | undefined) {
    clearTimeout(timeoutId);
  }

  setClientConnection(clientId: string, connection: WebSocket) {
    const client = this.getClientById(clientId);

    /** In case client closed/reloaded window he is going to be deleted only in
     * DELETE_CLIENT_TIMEOUT_VALUE timeout. That prevents deleting client in case
     * of accidental reload browser.
     */
    connection.on("close", () => {
      this.deleteClientTimeoutSet(client!);

      // Broadcasting current client connection down status announcement.
      const announcementMessage = {
        method: "announcement_broadcast",
        data: {
          message: client?.nickname + " lost connection.",
          reason: "client_connection_down",
          clientId,
        },
      };
      this.broadcast(announcementMessage, [clientId]);

      console.log(
        "Client " +
          color("yellow", clientId) +
          color("red", " connection dropped.\n") +
          "Deleting client in " +
          color("blue", DELETE_CLIENT_TIMEOUT_VALUE / 1000) +
          " seconds.\n"
      );
    });

    client!.setConnection(connection);
  }

  /** Broadcasting message to all the clients in the chatRoom, with optional exclusions.
   * @param {any} message message message to broadcast.
   * @param {[string]} excludeClientsId array of the cliets ids that should be omitted from the broadcast.
   */
  broadcast(message: any, excludeClientsId?: [string]) {
    const broadcastList = excludeClientsId
      ? this.clients.filter(
          (client) => !excludeClientsId.includes(client.clientId)
        )
      : this.clients;

    broadcastList
      .map((client) => client.currentConnection)
      .forEach((connection) => {
        if (connection) connection.send(s(message));
      });
  }
}

let chatRoomsList: ChatRoom[] = [];

function getChatRoomById(id: string) {
  return chatRoomsList.find((room) => room.id === id);
}

function deleteChatRoom(chatRoomId: string, reason = "not defined") {
  console.log(
    "Deleting chat room " +
      color("yellow", chatRoomId) +
      ". Reason : \n " +
      reason
  );
  getChatRoomById(chatRoomId)?.clients.forEach((client) =>
    client?.currentConnection?.close(1000, reason)
  );
}

export { ChatRoom, chatRoomsList, getChatRoomById, deleteChatRoom };
