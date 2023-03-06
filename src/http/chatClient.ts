import { WebSocket } from "ws";

class ChatClient {
  currentConnection: WebSocket | null;
  clientId: string;
  nickname: string;
  token: string;
  clientDeleteTimeoutId: NodeJS.Timeout | undefined;

  /** The client object is being created first on successful login via http, when the chatRoom page is being loaded,
   * but the connection is still null. It is initialized with webSocket instance after the 'client_init' socket message
   * is being sent to server - and all the auth data is being checked there as well.
   */
  constructor(
    currentConnection: WebSocket | null,
    clientId: string,
    nickname: string,
    token: string,
  ) {
    this.currentConnection = currentConnection;
    this.clientId = clientId;
    this.nickname = nickname;
    this.token = token;
    this.clientDeleteTimeoutId = undefined;
  }

  setConnection(connection: WebSocket) {
    this.currentConnection = connection;
  }
}

export { ChatClient };
