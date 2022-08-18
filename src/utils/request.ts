import { ValidationError } from "./error";

// post request via api gateway
interface PostRequest {
  body: string;
}

// get request via api gateway
interface GetRequest {
  queryStringParameters: string;
}

const parseRequestBody = <T>(body: string) => {
  try {
    return JSON.parse(body) as T;
  } catch (e) {
    throw new ValidationError("request body doesn't match format");
  }
};

export { PostRequest, GetRequest, parseRequestBody };
