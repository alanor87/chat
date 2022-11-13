type WsClinetsObjectType = {
  clientId: string;
  currentConnection: any;
};

type WsMethodsType =
  | "client_init"
  | "welcome_message"
  | "new_message"
  | "message_status_changed"
  | "new_client";


type WsMessageType<T> = {
  method: WsMethodsType;
  data: T;
};

// Messages data types.
type ClientInitDataType = {
  result: string;
};
type NewClientWelcomeDataType = {
  message: string;
};
type NewCLientBroadcastDataType = {
  clientId: string;
};
type ClientNewMessageDataType = {
  chatRoomId: string;
  fromClientId: string;
  toClientId?: string;
  message: string;
}
type NewMessageBroadcastDataType = {
  message: string;
  fromClientId: string;
  toClientId?: string;
}

export {
  WsClinetsObjectType,
  WsMethodsType,
  WsMessageType,
  ClientInitDataType,
  NewClientWelcomeDataType,
  NewCLientBroadcastDataType,
  NewMessageBroadcastDataType,
  ClientNewMessageDataType,
};
