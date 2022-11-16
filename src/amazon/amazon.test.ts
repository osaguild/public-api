import { getWishList, WishList } from "../amazon";

jest.setTimeout(60000);

describe("getWishList()", () => {
  it("[success]", async () => {
    const req = {
      queryStringParameters: {
        userId: "3T1F97J6M6OO6",
      },
    };
    const res = await getWishList(req);
    const resBody: WishList[] = JSON.parse(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(resBody[0].id).toBe("I3MBZSASBK30CP");
    expect(resBody[0].title).toBe(
      "ラディカル・マーケット 脱・私有財産の世紀: 公正な社会への資本主義と民主主義改革"
    );
    expect(resBody[0].price).toBe("3,520");
  });
});
