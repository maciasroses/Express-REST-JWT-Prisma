import { sendResponse } from "../utils";
import { Request, Response } from "express";
import { validateAuthorSchema } from "../schemas";
import {
  STATUS_ERROR,
  VALIDATION_ERROR,
  INTERNAL_SERVER_ERROR,
} from "../constants";
import type { IAuthorModel } from "../interfaces";

export class AuthorController {
  private authorModel: IAuthorModel;

  constructor({ authorModel }: { authorModel: IAuthorModel }) {
    this.authorModel = authorModel;
  }

  getAll = async (_req: Request, res: Response) => {
    const authors = await this.authorModel.read({});
    sendResponse(res, 200, { data: authors });
  };

  create = async (req: Request, res: Response) => {
    const dataToValidate = req.body;
    const errors = validateAuthorSchema("create", dataToValidate);

    if (Object.keys(errors).length > 0) {
      sendResponse(res, 400, {
        errors,
        status: STATUS_ERROR,
        message: VALIDATION_ERROR,
      });
      return;
    }

    try {
      const author = await this.authorModel.create({ data: dataToValidate });
      sendResponse(res, 201, { data: author });
    } catch (error) {
      console.error(error);
      sendResponse(res, 500, {
        status: STATUS_ERROR,
        message: INTERNAL_SERVER_ERROR,
      });
    }
  };
}
