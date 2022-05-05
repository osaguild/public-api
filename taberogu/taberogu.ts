const axios = require('axios');
const cheerio = require('cheerio');

export async function getShop(event: any): Promise<any> {

  // check request params
  let prefectureCode;
  let cityCode;

  const searchableArea = {
    prefectures: [{
      name: "saitama",
      code: "saitama",
      cities: [{
        name: "saitama",
        code: "A1101",
      }],
    }],
  };

  for (const prefecture of searchableArea.prefectures) {
    if (prefecture.name === event.queryStringParameters.prefecture) {
      prefectureCode = prefecture.code;
      for (const city of prefecture.cities) {
        if (city.name === event.queryStringParameters.city) {
          cityCode = city.code;
        };
      };
    };
  };

  if (!prefectureCode) {
    return {
      statusCode: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "request params error. prefecture is not found",
    };
  } else if (!cityCode) {
    return {
      statusCode: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "request params error. city is not found",
    };
  }

  // api call
  const uri = encodeURI(`https://tabelog.com/${prefectureCode}/${cityCode}/rstLst/?vs=1&sw=${event.queryStringParameters.shopName}`);
  const res = await axios.get(uri);

  // search dom
  const $ = cheerio.load(res.data);
  const shopIds: string[] = [];
  const shopUrls: string[] = [];
  const shopStars: string[] = [];
  $(".js-rst-cassette-wrap").each((index: number, element: string) => {
    shopIds.push($(element).attr("data-rst-id"));
    shopUrls.push($(element).attr("data-detail-url"));
  });
  $(".list-rst__rating-val").each((index: null, element: string) => {
    shopStars.push($(element).text());
  });

  // create response body
  const body = {
    id: shopIds[0],
    url: shopUrls[0],
    star: shopStars[0],
    unique: shopIds.length === 1 ? true : false,
  };

  // return http response
  if (shopIds.length === 0) {
    return {
      statusCode: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "not found",
    };
  } else {
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(body),
    };
  }
};

export async function getRanking(event: any): Promise<any> {

  // check request params
  let prefectureCode;
  let cityCode;

  const searchableArea = {
    prefectures: [{
      name: "saitama",
      code: "saitama",
      cities: [{
        name: "saitama",
        code: "A1101",
      }],
    }],
  };

  for (const prefecture of searchableArea.prefectures) {
    if (prefecture.name === event.queryStringParameters.prefecture) {
      prefectureCode = prefecture.code;
      for (const city of prefecture.cities) {
        if (city.name === event.queryStringParameters.city) {
          cityCode = city.code;
        };
      };
    };
  };

  if (!prefectureCode) {
    return {
      statusCode: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "request params error. prefecture is not found",
    };
  } else if (!cityCode) {
    return {
      statusCode: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "request params error. city is not found",
    };
  }

  // api call
  const shopIds: string[] = [];
  const shopUrls: string[] = [];
  const shopStars: string[] = [];
  const shopRanking: string[] = [];

  for (let page = 1; page <= 5; page++) {
    const uri = encodeURI(`https://tabelog.com/${prefectureCode}/${cityCode}/rstLst/${page}/?Srt=D&SrtT=rt&sort_mode=1&select_sort_flg=1`);
    const res = await axios.get(uri);

    // search dom
    const $ = cheerio.load(res.data);
    $(".js-rst-cassette-wrap").each((index: number, element: string) => {
      shopIds.push($(element).attr("data-rst-id"));
      shopUrls.push($(element).attr("data-detail-url"));
      shopRanking.push(((page - 1) * 20 + index + 1).toString());
    });
    $(".list-rst__rating-val").each((index: number, element: string) => {
      shopStars.push($(element).text());
    });
  };

  // create response body
  const body: Object[] = [];
  for (let i = 0; i < shopIds.length; i++) {
    body.push({
      id: shopIds[i],
      url: shopUrls[i],
      star: shopStars[i],
      ranking: shopRanking[i],
    });
  };

  // return http response
  if (shopIds.length === 0) {
    return {
      statusCode: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "not found",
    };
  } else {
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(body),
    };
  }
}