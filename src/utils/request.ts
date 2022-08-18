import { ValidationError } from "./error";

// post request via api gateway
interface PostRequest {
  body: string;
}

// get request via api gateway
interface GetRequest {
  queryStringParameters: object;
}

const parsePostRequestBody = <T>(body: string) => {
  try {
    return JSON.parse(body) as T;
  } catch (e) {
    throw new ValidationError("request body doesn't match format");
  }
};

const convertQueryStringToRequestBody = <T>(queryString: object) => {
  try {
    const requestBody = { ...queryString } as T;
    return requestBody;
  } catch (e) {
    throw new ValidationError("request body doesn't match format");
  }
};
export {
  PostRequest,
  GetRequest,
  parsePostRequestBody,
  convertQueryStringToRequestBody,
};
