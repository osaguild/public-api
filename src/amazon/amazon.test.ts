import { getWishList, WishList } from "../amazon";

jest.setTimeout(60000);

describe("getWishList()", () => {
  it("[success]", async () => {
    const req = {
      queryStringParameters: {
        id: "Y0W746THVC7X",
      },
    };
    const res = await getWishList(req);
    const resBody: WishList[] = JSON.parse(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(resBody[0].itemId).toBe("I28DKRDNB8EA12");
    expect(resBody[0].itemName).toBe(
      "PAW WING パウ・ウイング 犬 用 パッド くつ ペット 靴下 滑り止め 肉球 保護 傷防止 すべり 止め フット パッド (【L】×1セット, ブラック)"
    );
    expect(resBody[0].itemPrice).toBe("2,240");
  });
});
