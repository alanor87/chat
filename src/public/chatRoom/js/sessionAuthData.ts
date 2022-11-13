import { SessionDataType } from "../../../commonTypes/ChatRoomTypes.js";

export const sessionAuthData: Omit<SessionDataType, "nickname" | "isAdmin"> = {
  ["chatRoomId"]: "",
  ["clientId"]: "",
  ["token"]: "",
};
