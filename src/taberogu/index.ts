import axios from "axios";
import * as cheerio from "cheerio";
import {
  badRequestErrorResponse,
  notFoundErrorResponse,
  applicationErrorResponse,
  successResponse,
} from "../utils/response";
import { ValidationError, NotFoundError } from "../utils/error";
import {
  Prefecture,
  Shop,
  Ranking,
  ShopRequest,
  RankingRequest,
} from "./types";

const TABEROGU_URI = "https://tabelog.com";

const searchableAreas: Prefecture[] = [
  {
    name: "saitama",
    code: "saitama",
    cities: [
      {
        name: "saitama",
        code: "A1101",
      },
    ],
  },
];

const getPrefectureAndCityCode = (prefectureName: string, cityName: string) => {
  let prefectureCode: string | undefined = undefined;
  let cityCode: string | undefined = undefined;
  for (const prefecture of searchableAreas) {
    if (prefecture.name === prefectureName) {
      prefectureCode = prefecture.code;
      for (const city of prefecture.cities) {
        if (city.name === cityName) cityCode = city.code;
      }
    }
  }
  // if specified parameter isn't included, throw error
  if (!prefectureCode) throw new ValidationError("prefecture isn't included");
  if (!cityCode) throw new ValidationError("city isn't included");

  return { prefectureCode, cityCode };
};

const getShop = async (request: ShopRequest) => {
  const scraping = async (
    prefectureCode: string,
    cityCode: string,
    shopName: string
  ) => {
    // get html contents from taberogu
    const uri = encodeURI(
      `${TABEROGU_URI}/${prefectureCode}/${cityCode}/rstLst/?vs=1&sw=${shopName}`
    );
    const shopIds: string[] = [];
    const shopUrls: string[] = [];
    const shopStars: string[] = [];
    const res = await axios.get(uri);

    // search and get target dom value
    const $ = cheerio.load(res.data);
    $(".js-rst-cassette-wrap").each((i, e) => {
      shopIds.push($(e).attr("data-rst-id") as string);
      shopUrls.push($(e).attr("data-detail-url") as string);
    });
    $(".list-rst__rating-val").each((i, e) => {
      shopStars.push($(e).text());
    });

    // if target dom doesn't exist, throw error
    if (shopIds.length === 0 || shopUrls.length === 0 || shopStars.length === 0)
      throw new NotFoundError("can't find shop");

    return {
      id: shopIds[0],
      url: shopUrls[0],
      star: shopStars[0],
      unique: shopIds.length === 1 ? true : false,
    } as Shop;
  };

  try {
    const { prefectureCode, cityCode } = getPrefectureAndCityCode(
      request.queryStringParameters.prefecture,
      request.queryStringParameters.city
    );
    const shop = await scraping(
      prefectureCode,
      cityCode,
      request.queryStringParameters.shopName
    );

    return successResponse(JSON.stringify(shop));
  } catch (e) {
    return e instanceof ValidationError
      ? badRequestErrorResponse(e.message)
      : e instanceof NotFoundError
      ? notFoundErrorResponse(e.message)
      : applicationErrorResponse("unexpected error");
  }
};

const getRanking = async (request: RankingRequest) => {
  const scraping = async (prefectureCode: string, cityCode: string) => {
    // get ranking uris for scraping
    const uris = () => {
      const _uris: string[] = [];
      for (let page = 1; page <= 5; page++) {
        _uris.push(
          encodeURI(
            `${TABEROGU_URI}/${prefectureCode}/${cityCode}/rstLst/${page}/?Srt=D&SrtT=rt&sort_mode=1&select_sort_flg=1`
          )
        );
      }
      return _uris;
    };

    // asynchronous scraping for uris
    const promises = uris().map(async (uri, index) => {
      const shopIds: string[] = [];
      const shopUrls: string[] = [];
      const shopStars: string[] = [];
      const shopRanking: string[] = [];

      // get ranking every 20
      const res = await axios.get(uri);

      // search dom
      const $ = cheerio.load(res.data);
      $(".js-rst-cassette-wrap").each((i, e) => {
        shopIds.push($(e).attr("data-rst-id") as string);
        shopUrls.push($(e).attr("data-detail-url") as string);
        shopRanking.push((index * 20 + i + 1).toString());
      });
      $(".list-rst__rating-val").each((i, e) => {
        shopStars.push($(e).text());
      });

      // if target dom doesn't exist, throw error
      if (shopIds.length === 0) throw new NotFoundError("can't find ranking");

      return shopIds.map((e, i) => {
        return {
          id: shopIds[i],
          url: shopUrls[i],
          star: shopStars[i],
          ranking: shopRanking[i],
        } as Ranking;
      });
    });
    return await Promise.all(promises);
  };

  try {
    const { prefectureCode, cityCode } = getPrefectureAndCityCode(
      request.queryStringParameters.prefecture,
      request.queryStringParameters.city
    );
    const ranking = (await scraping(prefectureCode, cityCode)).flat();

    return successResponse(JSON.stringify(ranking));
  } catch (e) {
    return e instanceof ValidationError
      ? badRequestErrorResponse(e.message)
      : e instanceof NotFoundError
      ? notFoundErrorResponse(e.message)
      : applicationErrorResponse("unexpected error");
  }
};

export { getShop, getRanking, ShopRequest, RankingRequest, Shop, Ranking };
