import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models";
import { sendResponse } from "../utils";
import { Request, Response } from "express";
import { validateUserSchema } from "../schemas";
import {
  STATUS_ERROR,
  STATUS_SUCCESS,
  VALIDATION_ERROR,
  INTERNAL_SERVER_ERROR,
  REGISTER_MESSAGES,
  LOGIN_MESSAGES,
} from "../constants";
import type { IUser } from "../interfaces";

const JWT_SECRET = process.env.JWT_SECRET;

export const authRegister = async (req: Request, res: Response) => {
  const dataToValidate = req.body;

  const errors = validateUserSchema("register", dataToValidate);

  if (Object.keys(errors).length > 0) {
    sendResponse(res, 400, {
      errors,
      status: STATUS_ERROR,
      message: VALIDATION_ERROR,
    });
    return;
  }

  if (dataToValidate.password !== dataToValidate.confirmPassword) {
    sendResponse(res, 400, {
      status: STATUS_ERROR,
      message: REGISTER_MESSAGES.passwordsDontMatch,
    });
    return;
  }

  try {
    const userAlreadyExists = await UserModel.read({
      email: dataToValidate.email,
    });
    if (userAlreadyExists) {
      sendResponse(res, 400, {
        status: STATUS_ERROR,
        message: REGISTER_MESSAGES.emailAlreadyExists,
      });
      return;
    }

    const { confirmPassword, password, ...data } = dataToValidate;

    const hashedPassword = await bcrypt.hash(dataToValidate.password, 10);
    const user = await UserModel.create({
      data: { ...data, password: hashedPassword },
    });

    sendResponse(res, 201, {
      data: user,
      status: STATUS_SUCCESS,
      message: REGISTER_MESSAGES.success_message,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, {
      status: STATUS_ERROR,
      message: INTERNAL_SERVER_ERROR,
    });
  }
};

export const authLogin = async (req: Request, res: Response) => {
  const dataToValidate = req.body;

  const errors = validateUserSchema("login", dataToValidate);

  if (Object.keys(errors).length > 0) {
    sendResponse(res, 400, {
      errors,
      status: STATUS_ERROR,
      message: VALIDATION_ERROR,
    });
    return;
  }

  try {
    const user = (await UserModel.read({
      email: dataToValidate.email,
    })) as IUser;

    if (
      !user ||
      !(await bcrypt.compare(dataToValidate.password, user.password))
    ) {
      sendResponse(res, 404, {
        status: STATUS_ERROR,
        message: LOGIN_MESSAGES.invalidCredentials,
      });
      return;
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET as string, {
      expiresIn: "1d",
    });

    sendResponse(res, 200, {
      data: { token, user },
      status: STATUS_SUCCESS,
      message: LOGIN_MESSAGES.success_message,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, {
      status: STATUS_ERROR,
      message: INTERNAL_SERVER_ERROR,
    });
  }
};
