import axios from "axios";
import * as cheerio from "cheerio";
import {
  Prefecture,
  GetShopRequest,
  GetRankingRequest,
  Response,
  Shop,
  Ranking,
} from "./type";

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

const notFoundError = (message: string): Response => {
  return {
    statusCode: 404,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: message,
  };
};

const unknownError = (): Response => {
  return {
    statusCode: 500,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: "unknown error occurs",
  };
};

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
  if (!prefectureCode)
    throw new Error("request params error. prefecture is not found");
  else if (!cityCode)
    throw new Error("request params error. city is not found");

  return { prefectureCode, cityCode };
};

export const getShop = async (request: GetShopRequest) => {
  const scraping = async (
    prefectureCode: string,
    cityCode: string,
    shopName: string
  ) => {
    // api call
    const uri = encodeURI(
      `https://tabelog.com/${prefectureCode}/${cityCode}/rstLst/?vs=1&sw=${shopName}`
    );
    const shopIds: string[] = [];
    const shopUrls: string[] = [];
    const shopStars: string[] = [];
    const res = await axios.get(uri);
    // search dom
    const $ = cheerio.load(res.data);
    $(".js-rst-cassette-wrap").each((i, e) => {
      shopIds.push($(e).attr("data-rst-id") as string);
      shopUrls.push($(e).attr("data-detail-url") as string);
    });
    $(".list-rst__rating-val").each((i, e) => {
      shopStars.push($(e).text());
    });
    if (shopIds.length === 0 || shopUrls.length === 0 || shopStars.length === 0)
      throw new Error("not found");
    return {
      id: shopIds[0],
      url: shopUrls[0],
      star: shopStars[0],
      unique: shopIds.length === 1 ? true : false,
    } as Shop;
  };

  try {
    // check request params
    const { prefectureCode, cityCode } = getPrefectureAndCityCode(
      request.queryStringParameters.prefecture,
      request.queryStringParameters.city
    );

    // scraping
    const shop = await scraping(
      prefectureCode,
      cityCode,
      request.queryStringParameters.shopName
    );

    // return response
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(shop),
    } as Response;
  } catch (e) {
    if (e instanceof Error) return notFoundError(e.message);
    else return unknownError();
  }
};

export const getRanking = async (request: GetRankingRequest) => {
  const scraping = async (prefectureCode: string, cityCode: string) => {
    const shopIds: string[] = [];
    const shopUrls: string[] = [];
    const shopStars: string[] = [];
    const shopRanking: string[] = [];
    // get ranking every 20
    for (let page = 1; page <= 5; page++) {
      // api call
      const uri = encodeURI(
        `https://tabelog.com/${prefectureCode}/${cityCode}/rstLst/${page}/?Srt=D&SrtT=rt&sort_mode=1&select_sort_flg=1`
      );
      const res = await axios.get(uri);

      // search dom
      const $ = cheerio.load(res.data);
      $(".js-rst-cassette-wrap").each((i, e) => {
        shopIds.push($(e).attr("data-rst-id") as string);
        shopUrls.push($(e).attr("data-detail-url") as string);
        shopRanking.push(((page - 1) * 20 + i + 1).toString());
      });
      $(".list-rst__rating-val").each((i, e) => {
        shopStars.push($(e).text());
      });
    }
    return shopIds.map((e, i) => {
      return {
        id: shopIds[i],
        url: shopUrls[i],
        star: shopStars[i],
        ranking: shopRanking[i],
      } as Ranking;
    });
  };

  try {
    // check request params
    const { prefectureCode, cityCode } = getPrefectureAndCityCode(
      request.queryStringParameters.prefecture,
      request.queryStringParameters.city
    );

    // scraping
    const ranking = await scraping(prefectureCode, cityCode);

    // return response
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(ranking),
    } as Response;
  } catch (e) {
    if (e instanceof Error) return notFoundError(e.message);
    else return unknownError();
  }
};
