import { getShop, getRanking, Shop, Ranking } from "../taberogu";

jest.setTimeout(60000);

describe("getShop()", () => {
  it("[success]multiple shops", async () => {
    const req = {
      queryStringParameters: {
        prefecture: "saitama",
        city: "saitama",
        shopName: "酒蔵 力",
      },
    };
    const res = await getShop(req);
    const resBody: Shop = JSON.parse(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(resBody.id).toBe("11000484");
    expect(resBody.url).toBe(
      "https://tabelog.com/saitama/A1101/A110102/11000484/"
    );
    expect(Number(resBody.star)).toBeGreaterThan(3.3);
    expect(resBody.unique).toBe(false);
  });

  it("[success]single shop", async () => {
    const req = {
      queryStringParameters: {
        prefecture: "saitama",
        city: "saitama",
        shopName: "ひとり味",
      },
    };
    const res = await getShop(req);
    const resBody: Shop = JSON.parse(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(resBody.id).toBe("11038373");
    expect(resBody.url).toBe(
      "https://tabelog.com/saitama/A1101/A110102/11038373/"
    );
    expect(Number(resBody.star)).toBeGreaterThan(3);
    expect(resBody.unique).toBe(true);
  });

  it("[failed]not found error", async () => {
    const req = {
      queryStringParameters: {
        prefecture: "saitama",
        city: "saitama",
        shopName: "レストランラ・ヴォワール",
      },
    };
    const res = await getShop(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("can't find shop");
  });

  it("[failed]request param error(prefecture)", async () => {
    const req = {
      queryStringParameters: {
        prefecture: "tokyo",
        city: "saitama",
        shopName: "レストランラ・ヴォワール",
      },
    };
    const res = await getShop(req);
    expect(res.statusCode).toBe(400);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("prefecture isn't included");
  });

  it("[failed]request param error(city)", async () => {
    const req = {
      queryStringParameters: {
        prefecture: "saitama",
        city: "urawa",
        shopName: "レストランラ・ヴォワール",
      },
    };
    const res = await getShop(req);
    expect(res.statusCode).toBe(400);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("city isn't included");
  });
});

describe("getRanking()", () => {
  it("[success]", async () => {
    const req = {
      queryStringParameters: {
        prefecture: "saitama",
        city: "saitama",
      },
    };
    const res = await getRanking(req);
    const resBody: Ranking[] = JSON.parse(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(Number(resBody[0].star)).toBeGreaterThan(3.5);
    expect(resBody[0].ranking).toBe("1");
    expect(Number(resBody[99].star)).toBeGreaterThan(3.5);
    expect(resBody[99].ranking).toBe("100");
  });

  it("[failed]request param error(prefecture)", async () => {
    const req = {
      queryStringParameters: {
        prefecture: "tokyo",
        city: "saitama",
      },
    };
    const res = await getRanking(req);
    expect(res.statusCode).toBe(400);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("prefecture isn't included");
  });

  it("[failed]request param error(city)", async () => {
    const req = {
      queryStringParameters: {
        prefecture: "saitama",
        city: "urawa",
      },
    };
    const res = await getRanking(req);
    expect(res.statusCode).toBe(400);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("city isn't included");
  });
});
