const jwt = require("jsonwebtoken");

const createToken = async (user, secret, expiresIn) => {
  const { id, email } = user;
  return await jwt.sign({ id, email }, secret, {
    algorithm: "HS256",
    expiresIn: "7d"
  });
};

export { createToken };
