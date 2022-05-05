import Taberogu = require('../taberogu/taberogu');

test("success", async () => {
  // request data
  const event = {
    queryStringParameters: {
      name: "日高屋",
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
});

test("not found", async () => {
  // request data
  const event = {
    queryStringParameters: {
      name: "レストランラ・ヴォワール",
    },
  }
  // call api
  const res = await Taberogu.getShop(event);
  // check response
  expect(res.statusCode).toBe(404);
  expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
  expect(res.body).toBe("not found");
});