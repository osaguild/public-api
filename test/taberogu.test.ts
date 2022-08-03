import { getShop, getRanking } from "../taberogu/taberogu";
import {
  GetShopRequest,
  GetRankingRequest,
  Shop,
  Ranking,
} from "../taberogu/types";

jest.setTimeout(60000);

describe("test for getShop()", () => {
  it("[success]hit multiple shops", async () => {
    // request
    const req: GetShopRequest = {
      queryStringParameters: {
        prefecture: "saitama",
        city: "saitama",
        shopName: "酒蔵 力",
      },
    };
    // call api
    const res = await getShop(req);
    const body: Shop = JSON.parse(res.body);
    // check response
    expect(res.statusCode).toBe(200);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(body.id).toBe("11000484");
    expect(body.url).toBe(
      "https://tabelog.com/saitama/A1101/A110102/11000484/"
    );
    expect(Number(body.star)).toBeGreaterThan(3.3);
    expect(body.unique).toBe(false);
  });

  it("[success]hit one shop", async () => {
    // request data
    const req: GetShopRequest = {
      queryStringParameters: {
        prefecture: "saitama",
        city: "saitama",
        shopName: "ひとり味",
      },
    };
    // call api
    const res = await getShop(req);
    const body: Shop = JSON.parse(res.body);
    // check response
    expect(res.statusCode).toBe(200);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(body.id).toBe("11038373");
    expect(body.url).toBe(
      "https://tabelog.com/saitama/A1101/A110102/11038373/"
    );
    expect(Number(body.star)).toBeGreaterThan(3);
    expect(body.unique).toBe(true);
  });

  it("[failed]not found error", async () => {
    // request data
    const req: GetShopRequest = {
      queryStringParameters: {
        prefecture: "saitama",
        city: "saitama",
        shopName: "レストランラ・ヴォワール",
      },
    };
    // call api
    const res = await getShop(req);
    // check response
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("not found");
  });

  it("[failed]request param error[prefecture]", async () => {
    // request data
    const req: GetShopRequest = {
      queryStringParameters: {
        prefecture: "tokyo",
        city: "saitama",
        shopName: "レストランラ・ヴォワール",
      },
    };
    // call api
    const res = await getShop(req);
    // check response
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. prefecture is not found");
  });

  it("[failed]request param error[city]", async () => {
    // request data
    const req: GetShopRequest = {
      queryStringParameters: {
        prefecture: "saitama",
        city: "urawa",
        shopName: "レストランラ・ヴォワール",
      },
    };
    // call api
    const res = await getShop(req);
    // check response
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. city is not found");
  });
});

describe("test for getRanking()", () => {
  it("[success]ranking", async () => {
    // request data
    const req: GetRankingRequest = {
      queryStringParameters: {
        prefecture: "saitama",
        city: "saitama",
      },
    };
    // call api
    const res = await getRanking(req);
    const body: Ranking[] = JSON.parse(res.body);
    // check response
    expect(res.statusCode).toBe(200);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(Number(body[0].star)).toBeGreaterThan(3.5);
    expect(body[0].ranking).toBe("1");
    expect(Number(body[99].star)).toBeGreaterThan(3.5);
    expect(body[99].ranking).toBe("100");
  });

  it("[failed]request param error[prefecture]", async () => {
    // request data
    const req: GetRankingRequest = {
      queryStringParameters: {
        prefecture: "tokyo",
        city: "saitama",
      },
    };
    // call api
    const res = await getRanking(req);
    // check response
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. prefecture is not found");
  });

  it("[failed]request param error[city]", async () => {
    // request data
    const req: GetRankingRequest = {
      queryStringParameters: {
        prefecture: "saitama",
        city: "urawa",
      },
    };
    // call api
    const res = await getRanking(req);
    // check response
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. city is not found");
  });
});
