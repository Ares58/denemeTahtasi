const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Token yok" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token geçersiz" });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
