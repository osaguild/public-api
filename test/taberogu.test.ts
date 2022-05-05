import Taberogu = require('../taberogu/taberogu');

test("success", async () => {
  // request data
  const event = {
    queryStringParameters: {
      prefecture: "saitama",
      city: "saitama",
      shopName: "日高屋",
    },
  }
  // call api
  const res = await Taberogu.getShop(event);
  const body = JSON.parse(res.body);
  // check response
  expect(res.statusCode).toBe(200);
  expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
  expect(body.id).toBe("11012499");
  expect(body.url).toBe("https://tabelog.com/saitama/A1101/A110101/11012499/");
  expect(body.star).toBe("3.05");
  expect(body.unique).toBe(false);
});

test("not found", async () => {
  // request data
  const event = {
    queryStringParameters: {
      prefecture: "saitama",
      city: "saitama",
      shopName: "レストランラ・ヴォワール",
    },
  }
  // call api
  const res = await Taberogu.getShop(event);
  // check response
  expect(res.statusCode).toBe(404);
  expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
  expect(res.body).toBe("not found");
});

test("hit one", async () => {
  // request data
  const event = {
    queryStringParameters: {
      prefecture: "saitama",
      city: "saitama",
      shopName: "ひとり味",
    },
  }
  // call api
  const res = await Taberogu.getShop(event);
  const body = JSON.parse(res.body);
  // check response
  expect(res.statusCode).toBe(200);
  expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
  expect(body.id).toBe("11038373");
  expect(body.url).toBe("https://tabelog.com/saitama/A1101/A110102/11038373/");
  expect(body.star).toBe("3.27");
  expect(body.unique).toBe(true);
});

test("request param error[prefecture]", async () => {
  // request data
  const event = {
    queryStringParameters: {
      prefecture: "tokyo",
      city: "saitama",
      shopName: "レストランラ・ヴォワール",
    },
  }
  // call api
  const res = await Taberogu.getShop(event);
  // check response
  expect(res.statusCode).toBe(404);
  expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
  expect(res.body).toBe("request params error. prefecture is not found");
});

test("request param error[city]", async () => {
  // request data
  const event = {
    queryStringParameters: {
      prefecture: "saitama",
      city: "urawa",
      shopName: "レストランラ・ヴォワール",
    },
  }
  // call api
  const res = await Taberogu.getShop(event);
  // check response
  expect(res.statusCode).toBe(404);
  expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
  expect(res.body).toBe("request params error. city is not found");
});

test("request param error[prefecture and city]", async () => {
  // request data
  const event = {
    queryStringParameters: {
      prefecture: "tokyo",
      city: "urawa",
      shopName: "レストランラ・ヴォワール",
    },
  }
  // call api
  const res = await Taberogu.getShop(event);
  // check response
  expect(res.statusCode).toBe(404);
  expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
  expect(res.body).toBe("request params error. prefecture is not found");
});