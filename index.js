import { ApolloServer, AuthenticationError } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import models from "./models";
import resolvers from "./resolvers";
import schemas from "./schema";

import config from "./config/keys";

//validate jwt then set me in graphql server context
const getMe = async (req, res, next) => {
  let token = req.headers["authorization"];
  if (token) {
    try {
      const user = await jwt.verify(token, config.secret, {
        algorithm: ["HS256"]
      });
      req.user = user;
    } catch (e) {
      return new AuthenticationError("Your Session expired. Sign in again.");
    }
  }
  next();
};

const server = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  //set context with things you would want to use across some/most/all resolvers
  context: async ({ req, res }) => {
    return {
      models,
      me: req.user,
      secret: config.secret
    };
  }
});

const app = express();
app.use(getMe);

//connect mongo db
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => console.log(`Server ready at port 4000`));
