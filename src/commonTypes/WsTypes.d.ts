import { SessionAuthDataType } from "../commonTypes/ChatRoomTypes.js";

type WsClinetsObjectType = {
  clientId: string;
  currentConnection: any;
};

type WsMethodsType =
  | "ping"
  | "client_init"
  | "welcome_message"
  | "new_message"
  | "message_status_changed"
  | "new_client";

type WsMessageType =
  | ClientInitReqWsMessageType
  | ClientInitResWsMessageType
  | NewClientWelcomeWsMessageType
  | NewCLientBroadcastWsMessageType
  | ClientNewMessageWsMessageType
  | NewMessageBroadcastWsMessageType
  | PingMessageType;

// Messages types.
type ClientInitReqWsMessageType = {
  method: "client_init_request";
  data: SessionAuthDataType;
};
type ClientInitResWsMessageType = {
  method: "client_init_response";
  data: { result: string };
};
type NewClientWelcomeWsMessageType = {
  method: "welcome_message";
  data: { message: string };
};
type NewCLientBroadcastWsMessageType = {
  method: "new_client";
  data: { nickname: string };
};
type ClientNewMessageWsMessageType = {
  method: "new_message";
  data: {
    chatRoomId: string;
    fromClientId: string;
    toClientId?: string;
    message: string;
  };
};
type NewMessageBroadcastWsMessageType = {
  method: "new_message_broadcast";
  data: { message: string; fromClientId: string; toClientId?: string };
};
type PingMessageType = {
  method: "ping";
  data: { };
};

export { WsClinetsObjectType, WsMethodsType, WsMessageType };
