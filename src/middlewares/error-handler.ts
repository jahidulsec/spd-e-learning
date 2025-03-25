import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../types/error";

// Define a structured error response type
interface ErrorResponse {
  success: boolean;
  error: string;
  message: string;
  statusCode: number;
  code: number;
  errors?: { field?: string; message: string; code: string }[];
}

const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let code = 50001;
  let error = "Internal Server Error";
  let message = "Internal Server Error";
  let errorDetails: ErrorResponse["errors"] | undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    code = 40002;
    error = "Bad Request";
    message = "Invalid input data";
    errorDetails = err.errors.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
      code: "INVALID_INPUT",
    }));
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 503;
    code = 50301;
    error = "Server Unavailable";
    message = err.message.split("\n").pop() || "Check internet connection";
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    code = 40004;
    error = "Bad Request";
    message = err.message.split("\n").pop() || "Invalid database input";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      code = 40902; // Conflict due to unique constraint
      error = "Bad Request";
      message = err.message.split("\n").pop() || "Unique data requied";
    } else if (err.code === "P2003") {
      statusCode = 404;
      code = 40402; // foreign key conflict
      error = "Bad Request";
      message = `${err?.meta?.field_name as string} does not exist`;
    } else {
      statusCode = 400;
      code = 40003; // General invalid input
      error = "Bad Request";
      message = err.message.split("\n").pop() || "Database request error";
    }
  } else if ("statusCode" in err && err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
    error = err.error;
    code = err.errorCode;
  }

  res.status(statusCode).json({
    success: false,
    code: code,
    error: error,
    message: message,
    errors: errorDetails,
  });
};

export { errorHandler };
