// response though api gateway
interface Response {
  statusCode: 200 | 400 | 404 | 500;
  headers: { "Access-Control-Allow-Origin": "*" };
  body: string;
}

const successResponse = (message: string): Response => {
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: message,
  };
};

const badRequestErrorResponse = (message: string): Response => {
  return {
    statusCode: 400,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: message,
  };
};

const notFoundErrorResponse = (message: string): Response => {
  return {
    statusCode: 404,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: message,
  };
};

const applicationErrorResponse = (message: string): Response => {
  return {
    statusCode: 500,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: message,
  };
};

export {
  Response,
  successResponse,
  badRequestErrorResponse,
  notFoundErrorResponse,
  applicationErrorResponse,
};
