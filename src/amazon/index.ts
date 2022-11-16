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
  const scraping = async (userId: string) => {
    // get html contents from amazon wish list
    const uri = encodeURI(`${WISH_LIST_URI}/${userId}`);
    const ids: string[] = [];
    const titles: string[] = [];
    const prices: string[] = [];
    const res = await axios.get(uri);

    // search and get target dom value
    const $ = cheerio.load(res.data);
    $("#g-items li").each((_, e) => {
      if ($(e).attr("data-itemid"))
        ids.push($(e).attr("data-itemid") as string);
    });
    ids.forEach((e) => {
      titles.push($(`#itemName_${e}`).attr("title") as string);
      prices.push($(`#itemPrice_${e} .a-price-whole`).text() as string);
    });

    // if target dom doesn't exist, throw error
    if (ids.length === 0 || titles.length === 0 || prices.length === 0)
      throw new NotFoundError("can't find wish list");

    return ids.map((_, i) => {
      return {
        id: ids[i],
        title: titles[i],
        price: prices[i],
      } as WishList;
    });
  };

  try {
    const wishLists = await scraping(request.queryStringParameters.userId);
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
