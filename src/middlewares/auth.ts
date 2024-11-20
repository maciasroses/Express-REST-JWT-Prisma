import { sendResponse } from "../utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { FORBIDDEN, STATUS_ERROR, UNAUTHORIZED } from "../constants";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    sendResponse(res, 401, {
      status: STATUS_ERROR,
      message: UNAUTHORIZED,
    });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error(err);
      sendResponse(res, 403, {
        status: STATUS_ERROR,
        message: FORBIDDEN,
      });
      return;
    }

    (req as Request & { user?: JwtPayload }).user = user as JwtPayload;
    next();
  });
}
