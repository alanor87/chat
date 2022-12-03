import { clientDataValidation } from "../../helpers/clientDataValidation.js";
import { jsonStringify as s } from "../../helpers/jsonStringify.js";
import { getChatRoomById } from "../chatRoom.js";
function chatRoomAuthorization(res, reqData) {
    var _a;
    try {
        const { headers, body } = reqData;
        const { chatRoomId, clientId } = body;
        const token = headers.authorization.split(" ")[1];
        // Throws in case of failure in check.
        clientDataValidation(chatRoomId, clientId, token);
        const isAdmin = ((_a = getChatRoomById(chatRoomId)) === null || _a === void 0 ? void 0 : _a.isAdmin(clientId, token)) ? 'isAdmin' : 'notAdmin';
        res.writeHead(200).end(s({ isAdmin }));
    }
    catch (e) {
        console.log(e.message);
        res.writeHead(401).end(e.message);
    }
}
export { chatRoomAuthorization };
