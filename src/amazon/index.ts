import axios from "axios";
import * as cheerio from "cheerio";
import {
  badRequestErrorResponse,
  notFoundErrorResponse,
  applicationErrorResponse,
  successResponse,
} from "../utils/response";
import { ValidationError, NotFoundError } from "../utils/error";
import { WishList, WishListRequest } from "./types";

const WISH_LIST_URI = "https://www.amazon.co.jp/hz/wishlist/ls";

const getWishList = async (request: WishListRequest) => {
  const scraping = async (id: string) => {
    // get html contents from amazon wish list
    const uri = encodeURI(`${WISH_LIST_URI}/${id}`);
    const itemIds: string[] = [];
    const itemNames: string[] = [];
    const itemPrices: string[] = [];
    const res = await axios.get(uri);

    // search and get target dom value
    const $ = cheerio.load(res.data);
    $("#g-items li").each((_, e) => {
      if ($(e).attr("data-itemid"))
        itemIds.push($(e).attr("data-itemid") as string);
    });
    itemIds.forEach((e) => {
      itemNames.push($(`#itemName_${e}`).attr("title") as string);
      itemPrices.push($(`#itemPrice_${e} .a-price-whole`).text() as string);
    });

    // if target dom doesn't exist, throw error
    if (
      itemIds.length === 0 ||
      itemNames.length === 0 ||
      itemPrices.length === 0
    )
      throw new NotFoundError("can't find wish list");

    return itemIds.map((_, i) => {
      return {
        itemId: itemIds[i],
        itemName: itemNames[i],
        itemPrice: itemPrices[i],
      } as WishList;
    });
  };

  try {
    const wishLists = await scraping(request.queryStringParameters.id);
    return successResponse(JSON.stringify(wishLists));
  } catch (e) {
    return e instanceof ValidationError
      ? badRequestErrorResponse(e.message)
      : e instanceof NotFoundError
      ? notFoundErrorResponse(e.message)
      : applicationErrorResponse("unexpected error");
  }
};

export { getWishList, WishListRequest, WishList };
