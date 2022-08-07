import { GetRequest } from "../common/types";

export interface Prefecture {
  name: string;
  code: string;
  cities: City[];
}
export interface City {
  name: string;
  code: string;
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

export interface GetShopRequest extends GetRequest {
  queryStringParameters: {
    prefecture: string;
    city: string;
    shopName: string;
  };
}
export interface GetRankingRequest extends GetRequest {
  queryStringParameters: {
    prefecture: string;
    city: string;
  };
}
