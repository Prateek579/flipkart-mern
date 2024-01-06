const jwt = require("jsonwebtoken");

const JWT_SECRET = "FullStack";

const authUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).json({ message: "Please provide a token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (error) {
    console.log("internal server error", error);
    res.status(400).json({ message: "internal server error authtoken" });
  }
};
module.exports = authUser;
