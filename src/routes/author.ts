import { Router } from "express";
import { AuthorController } from "../controllers";
import type { IAuthorModel } from "../interfaces";

export const AuthorRouter = ({ authorModel }: { authorModel: IAuthorModel }) => {
  const authorRouter = Router();

  const authorController = new AuthorController({ authorModel });

  authorRouter.get("/", authorController.getAll);
  authorRouter.post("/", authorController.create);

  return authorRouter;
};
