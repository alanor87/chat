import { clientDataValidation } from "../../helpers/clientDataValidation.js";
function chatRoomAuthorization(res, reqData) {
    try {
        const { headers, body } = reqData;
        const { chatRoomId, clientId } = body;
        const token = headers.authorization.split(" ")[1];
        // Throws in case of failure in check.
        clientDataValidation(chatRoomId, clientId, token);
        res.writeHead(200).end();
    }
    catch (e) {
        console.log(e.message);
        res.writeHead(401).end(e.message);
    }
}
export { chatRoomAuthorization };
