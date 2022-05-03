import Taberogu = require('../taberogu/taberogu');

test("taberogu", async () => {
  const res = await Taberogu.get(null);

  expect(res.statusCode).toBe(200); 
  expect(res.body).toBe("success");
});
