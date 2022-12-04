import { SessionAuthDataType } from "../commonTypes/ChatRoomTypes.js";

type WsMethods =
  | "client_init_request"
  | "client_init_response"
  | "welcome_message"
  | "new_client"
  | "new_message"
  | "new_message_broadcast"
  | "client_exit_request"
  | "chat_room_termination"
  | "ping";

type WsMessageType =
  | ClientInitReqWsMessageType
  | ClientInitResWsMessageType
  | NewClientWelcomeWsMessageType
  | NewCLientBroadcastWsMessageType
  | ClientNewMessageWsMessageType
  | NewMessageBroadcastWsMessageType
  | NewMessagePrivateWsMessageType
  | ClentExitRequestWsMessageType
  | PingWsMessageType;

// Messages types.
type ClientInitReqWsMessageType = {
  method: "client_init_request";
  data: SessionAuthDataType;
};
type ClientInitResWsMessageType = {
  method: "client_init_response";
  data: { result: string;};
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
  data: {
    message: string;
    fromClientId: string;
    fromClientNickname: string;
    toClientId?: string;
  };
};
type NewMessagePrivateWsMessageType = {
  method: "new_message_private";
  data: {
    message: string;
    fromClientId: string;
    fromClientNickname: string;
    toClientId: string;
  };
};
type ClentExitRequestWsMessageType = {
  method: "client_exit_request";
  data: { chatRoomId: string; clientId: string };
};
type ChatRoomTerminationWsMessageType = {
  method: "chat_room_termination";
  data: {
    message: string;
  };
};
type PingWsMessageType = {
  method: "ping";
  data: {};
};

export { WsMessageType };
