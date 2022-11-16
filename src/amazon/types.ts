import { GetRequest } from "../utils/request";

type WishList = {
  id: string;
  title: string;
  price: string;
};

interface WishListRequest extends GetRequest {
  queryStringParameters: {
    userId: string;
  };
}

export { WishList, WishListRequest };
