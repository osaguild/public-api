import { GetRequest } from "../utils/request";

type WishList = {
  itemId: string;
  itemName: string;
  itemPrice: string;
};

interface WishListRequest extends GetRequest {
  queryStringParameters: {
    id: string;
  };
}

export { WishList, WishListRequest };
