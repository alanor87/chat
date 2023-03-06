import { clientDataValidation } from "../../helpers/clientDataValidation.js";
import { jsonStringify as s } from "../../helpers/jsonStringify.js";
import { logObject } from "../../helpers/logging.js";
import { getChatRoomById } from "../chatRoom.js";
function chatRoomAuthorization(res, reqData) {
    const { body: { chatRoomId, clientId }, token, } = reqData;
    try {
        // Throws in case of failure in check.
        clientDataValidation(chatRoomId, clientId, token);
        const chatRoom = getChatRoomById(chatRoomId);
        const isAdmin = (chatRoom === null || chatRoom === void 0 ? void 0 : chatRoom.isAdmin(clientId, token)) ? "isAdmin" : "notAdmin";
        // Sending the list of clinets on the moment of current clinet authorization, omitting the client that is being authorized.
        const clientsList = chatRoom === null || chatRoom === void 0 ? void 0 : chatRoom.clients.filter((client) => client.clientId !== clientId).map(({ clientId, nickname }) => ({
            clientId,
            nickname,
        }));
        res.writeHead(200).end(s({ isAdmin, clientsList }));
    }
    catch (e) {
        console.log(logObject("Auth failure : ", "red", {
            "Chat room id": chatRoomId,
            "Client id": clientId,
        }));
        res.writeHead(401).end(e.message);
    }
}
export { chatRoomAuthorization };
