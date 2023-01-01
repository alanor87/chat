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
  isAdmin?: string;
  token: string;
}

export type ClientListEntryType = {
  nickname: string;
  clientId: string;
  selected?: boolean;
}


export type MessageType = "incoming" | "outcoming" | "welcome";
