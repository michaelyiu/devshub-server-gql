const jwt = require("jsonwebtoken");

const createToken = async (user, secret, expiresIn) => {
  const { _id, email } = user;
  return await jwt.sign({ _id, email }, secret, {
    algorithm: "HS256",
    expiresIn: "7d"
  });
};

export { createToken };
