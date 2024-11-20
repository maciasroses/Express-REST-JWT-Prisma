import { Router } from "express";
import { BookController } from "../controllers";
import type { IBookModel } from "../interfaces";

export const BookRouter = ({ bookModel }: { bookModel: IBookModel }) => {
  const bookRouter = Router();

  const bookController = new BookController({ bookModel });

  bookRouter.get("/", bookController.getAll);
  bookRouter.post("/", bookController.create);

  return bookRouter;
};
