import { clientDataValidation } from "../../helpers/clientDataValidation.js";
import { jsonStringify as s } from "../../helpers/jsonStringify.js";
import { logObject } from "../../helpers/logging.js";
import { getChatRoomById } from "../chatRoom.js";
function chatRoomAuthorization(res, reqData) {
    var _a;
    const { body: { chatRoomId, clientId }, token, } = reqData;
    try {
        // Throws in case of failure in check.
        clientDataValidation(chatRoomId, clientId, token);
        const isAdmin = ((_a = getChatRoomById(chatRoomId)) === null || _a === void 0 ? void 0 : _a.isAdmin(clientId, token))
            ? "isAdmin"
            : "notAdmin";
        res.writeHead(200).end(s({ isAdmin }));
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
