import { Response } from "express";

export function sendResponse(
  res: Response,
  statusCode: number,
  { data = {}, status = "success", message = "", errors = {} }
) {
  res.status(statusCode).send({
    data,
    status,
    message,
    errors,
  });
}
