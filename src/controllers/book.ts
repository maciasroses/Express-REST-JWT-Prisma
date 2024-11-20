import { sendResponse } from "../utils";
import { Request, Response } from "express";
import { validateBookSchema } from "../schemas";
import {
  STATUS_ERROR,
  VALIDATION_ERROR,
  INTERNAL_SERVER_ERROR,
} from "../constants";
import type { IBookModel } from "../interfaces";

export class BookController {
  private bookModel: IBookModel;

  constructor({ bookModel }: { bookModel: IBookModel }) {
    this.bookModel = bookModel;
  }

  getAll = async (_req: Request, res: Response) => {
    const books = await this.bookModel.read({});
    sendResponse(res, 200, { data: books });
  };

  create = async (req: Request, res: Response) => {
    const dataToValidate = req.body;
    const errors = validateBookSchema("create", dataToValidate);

    if (Object.keys(errors).length > 0) {
      sendResponse(res, 400, {
        errors,
        status: STATUS_ERROR,
        message: VALIDATION_ERROR,
      });
      return;
    }

    try {
      const book = await this.bookModel.create({ data: dataToValidate });
      sendResponse(res, 201, { data: book });
    } catch (error) {
      console.error(error);
      sendResponse(res, 500, {
        status: STATUS_ERROR,
        message: INTERNAL_SERVER_ERROR,
      });
    }
  };
}
