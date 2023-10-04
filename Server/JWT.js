import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import dotenv from "dotenv";
dotenv.config();

//creating a token
const createTokens = (user) => {
  const accesstoken = sign({ id: user._id }, process.env.secret_key);
  return accesstoken;
};

//middelware
const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res.status(400).json({ error: "User not authenticated!" });
  try {
    const validToken = verify(accessToken, process.env.secret_key);
    if (validToken) {
      req.authenticated = true;
      return next(); //means we moved next as we dont want to catch any error
    }
  } catch (err) {
    return res.status(400).json({ error: "User not authenticated!" });
  }
};

export { createTokens, validateToken };
