export type CreateChatRoomResponse = {
  chatRoomId: string;
  clientId: string;
  token: string;
};

export type JoinChatRoomResponse = {
  chatRoomId: string;
  clientId: string;
  token: string;
};

export type SessionDataType = {
  chatRoomId: string;
  clientId: string;
  nickname: string;
  isAdmin: boolean;
  token: string;
}

export type SessionAuthDataType = Omit<SessionDataType, 'isAdmin' | 'nickname'>

export type SessionDataType = {
  chatRoomId: string;
  clientId: string;
  nickname: string;
  isAdmin: boolean;
  token: string;
}

export type MessageType = "incoming" | "outcoming" | "welcome";
