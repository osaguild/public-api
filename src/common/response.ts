import { Response } from "./types";

export const successResponse = (message: string): Response => {
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: message,
  };
};

export const badRequestErrorResponse = (message: string): Response => {
  return {
    statusCode: 400,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: message,
  };
};

export const notFoundErrorResponse = (message: string): Response => {
  return {
    statusCode: 404,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: message,
  };
};

export const unknownErrorResponse = (): Response => {
  return {
    statusCode: 500,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: "unknown error occurs",
  };
};
