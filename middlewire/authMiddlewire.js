const jwt = require('jsonwebtoken');

function authToken (req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(400).json({ message: "Access denied." })
    }
    try {
        const verifyedToken = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verifyedToken;
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token' });
    }
}

module.exports = authToken;