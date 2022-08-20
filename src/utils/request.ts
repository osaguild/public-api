// post request via api gateway
interface PostRequest {
  body: string;
}

// get request via api gateway
interface GetRequest {
  queryStringParameters: object;
}

export { PostRequest, GetRequest };
