export interface Prefecture {
  name: string;
  code: string;
  cities: City[];
}
export interface City {
  name: string;
  code: string;
}
export interface GetShopRequest {
  queryStringParameters: {
    prefecture: string;
    city: string;
    shopName: string;
  };
}
export interface GetRankingRequest {
  queryStringParameters: {
    prefecture: string;
    city: string;
  };
}
export interface Response {
  statusCode: 200 | 400 | 404 | 500;
  headers: { "Access-Control-Allow-Origin": "*" };
  body: string;
}
export interface Shop {
  id: string;
  url: string;
  star: string;
  unique: boolean;
}
export interface Ranking {
  id: string;
  url: string;
  star: string;
  ranking: string;
}
