const jwt = require("jsonwebtoken");

function jwtAuthenticateToken(req, res, next) {
    const token = req.cookies?.token;
    console.log(req.cookies);
    if (!token) {
        return res.status(401).send({
            error: "Invalid token",
        });
    }

    jwt.verify(token, process.env.JWT_SIGN_KEY, (err, user) => {
        if (err) {
            return res.status(401).send({
                error: "could not authenticate token",
            });
        }
        req.body.userID = user.userID;
        next();
    });
}

module.exports = jwtAuthenticateToken;
