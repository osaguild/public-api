/**
 * request though api gateway
 * if request type is application/json you need to json parse it.
 */
export interface PostRequest {
  body: string;
}

/**
 * request though api gateway
 */
export interface GetRequest {
  queryStringParameters: object;
}

/**
 * response though api gateway
 */
export interface Response {
  statusCode: 200 | 400 | 404 | 500;
  headers: { "Access-Control-Allow-Origin": "*" };
  body: string;
}
