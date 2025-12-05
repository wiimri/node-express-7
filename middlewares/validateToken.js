const jwt = require("jsonwebtoken");
const { secretKey } = require("../utils/secretKey");

const validateToken = (req, res, next) => {
  const authHeader = req.header("Authorization") || "";

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Token requerido en cabecera Authorization" });
  }

  const token = authHeader.replace(/Bearer\s+/i, "").trim();

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token requerido en cabecera Authorization" });
  }

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = validateToken;
