import jwt from "jsonwebtoken";
import { ChatClient } from "../http/chatClient.js";

function createJwt(payload: string, options?: jwt.SignOptions) {
  const secretKey = process.env.SECRET_KEY as string;
  return jwt.sign(payload, secretKey, options);
}

function tokenValidation(token: string, client: ChatClient) {
  try {
    const secretKey = process.env.SECRET_KEY as string;
    jwt.verify(token, secretKey);
    if (client.token !== token) return false;
    return true;
  } catch (e) {
    return false;
  }
}

export { createJwt, tokenValidation };
