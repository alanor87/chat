import jwt from "jsonwebtoken";
function createJwt(payload, options) {
    const secretKey = process.env.SECRET_KEY;
    return jwt.sign(payload, secretKey, options);
}
function tokenValidation(token, client) {
    try {
        const secretKey = process.env.SECRET_KEY;
        jwt.verify(token, secretKey);
        if (client.token !== token)
            return false;
        return true;
    }
    catch (e) {
        return false;
    }
}
export { createJwt, tokenValidation };
