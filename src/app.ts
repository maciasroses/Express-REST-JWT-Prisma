import express from "express";
import { AuthorRouter, BookRouter } from "./routes";
import { authLogin, authRegister } from "./services";
import { authMiddleware, corsMiddleware } from "./middlewares";
import type { IAuthorModel, IBookModel } from "./interfaces";

interface ICreateApp {
  bookModel: IBookModel;
  authorModel: IAuthorModel;
}

export const createApp = ({ bookModel, authorModel }: ICreateApp) => {
  const app = express();
  const apiRouter = express.Router();

  app.use(express.json());
  app.use(corsMiddleware());

  apiRouter.get("/", (_req, res) => {
    res.json({ service: "Ok" });
  });
  apiRouter.post("/register", authRegister);
  apiRouter.post("/login", authLogin);

  apiRouter.use("/book", authMiddleware, BookRouter({ bookModel }));
  apiRouter.use("/author", authMiddleware, AuthorRouter({ authorModel }));

  app.use("/api", apiRouter);
  return app;
};
