import { GetRequest } from "../utils/request";

type Prefecture = {
  name: string;
  code: string;
  cities: City[];
};

type City = {
  name: string;
  code: string;
};

type Shop = {
  id: string;
  url: string;
  star: string;
  unique: boolean;
};

type Ranking = {
  id: string;
  url: string;
  star: string;
  ranking: string;
};

interface ShopRequest extends GetRequest {
  queryStringParameters: {
    prefecture: string;
    city: string;
    shopName: string;
  };
}

interface RankingRequest extends GetRequest {
  queryStringParameters: {
    prefecture: string;
    city: string;
  };
}

export { Prefecture, City, Shop, Ranking, ShopRequest, RankingRequest };
