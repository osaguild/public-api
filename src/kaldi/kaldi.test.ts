import { findSales, hasNewSale, createKaldiMessage } from "../kaldi";
import { Sale } from "./types";

jest.setTimeout(10000);

describe("findSales()", () => {
  it("[success]not hit", async () => {
    const res = await findSales(sales, "神奈川県");
    expect(res.length).toBe(0);
  });

  it("[success]hit single sale", async () => {
    const res = await findSales(sales, "埼玉県");
    expect(res.length).toBe(1);
  });

  it("[success]hit multiple sales", async () => {
    const res = await findSales(sales, "東京都");
    expect(res.length).toBe(2);
  });
});

describe("hasNewSale()", () => {
  it("[success]included new sale", async () => {
    const res = await hasNewSale(sales);
    expect(res).toBe(true);
  });

  it("[success]not included sale", async () => {
    const res = await hasNewSale(notHaveNewSales);
    expect(res).toBe(false);
  });
});

describe("createKaldiMessage()", () => {
  it("[success]single sale", async () => {
    const _sales = await findSales(sales, "埼玉県");
    const res = await createKaldiMessage(
      _sales,
      new Date(2022, 7, 1),
      "埼玉県"
    );
    const message =
      "🎉2022年8月1日 埼玉県のセール情報🎉\n\n【ショップC】\n2022/8/15 〜 2022/8/22\n\n⭐カルディ公式サイト⭐\nhttps://map.kaldi.co.jp/kaldi/articleList?account=kaldi&accmd=1&ftop=1&kkw001=2010-03-12T13%3A10%3A35";
    expect(res).toBe(message);
  });
  it("[success]multiple sale", async () => {
    const _sales = await findSales(sales, "東京都");
    const res = await createKaldiMessage(
      _sales,
      new Date(2022, 7, 1),
      "埼玉県"
    );
    const message =
      "🎉2022年8月1日 埼玉県のセール情報🎉\n\n【ショップA】\n2022/8/1 〜 2022/8/7\n\n【ショップB】\n2022/8/8 〜 2022/8/14\n\n⭐カルディ公式サイト⭐\nhttps://map.kaldi.co.jp/kaldi/articleList?account=kaldi&accmd=1&ftop=1&kkw001=2010-03-12T13%3A10%3A35";
    expect(res).toBe(message);
  });
});

const sales: Sale[] = [
  {
    activeSale: "ACTIVE _SALE",
    shopName: "ショップA",
    shopAddress: "東京都新宿区xxxxx 1F",
    saleName: "お客様感謝セール",
    saleFrom: "2022-08-01T00:00:00+09:00",
    saleTo: "2022-08-07T00:00:00+09:00",
    saleDetail: "コーヒー豆半額（一部除外品あり）／商品10%OFF",
    isNew: false,
  },
  {
    activeSale: "SALE_NOTICE",
    shopName: "ショップB",
    shopAddress: "東京都新宿区xxxxx 1F",
    saleName: "お客様感謝セール",
    saleFrom: "2022-08-08T00:00:00+09:00",
    saleTo: "2022-08-14T00:00:00+09:00",
    saleDetail: "コーヒー豆半額（一部除外品あり）／商品10%OFF",
    isNew: true,
  },
  {
    activeSale: "ACTIVE _SALE",
    shopName: "ショップC",
    shopAddress: "埼玉県さいたま市xxxxx 1F",
    saleName: "お客様感謝セール",
    saleFrom: "2022-08-15T00:00:00+09:00",
    saleTo: "2022-08-22T00:00:00+09:00",
    saleDetail: "コーヒー豆半額（一部除外品あり）／商品10%OFF",
    isNew: true,
  },
];

const notHaveNewSales: Sale[] = [
  {
    activeSale: "ACTIVE _SALE",
    shopName: "ショップA",
    shopAddress: "東京都新宿区xxxxx 1F",
    saleName: "お客様感謝セール",
    saleFrom: "2022-08-01T00:00:00+09:00",
    saleTo: "2022-08-07T00:00:00+09:00",
    saleDetail: "コーヒー豆半額（一部除外品あり）／商品10%OFF",
    isNew: false,
  },
  {
    activeSale: "SALE_NOTICE",
    shopName: "ショップB",
    shopAddress: "東京都新宿区xxxxx 1F",
    saleName: "お客様感謝セール",
    saleFrom: "2022-08-08T00:00:00+09:00",
    saleTo: "2022-08-14T00:00:00+09:00",
    saleDetail: "コーヒー豆半額（一部除外品あり）／商品10%OFF",
    isNew: false,
  },
  {
    activeSale: "ACTIVE _SALE",
    shopName: "ショップC",
    shopAddress: "埼玉県さいたま市xxxxx 1F",
    saleName: "お客様感謝セール",
    saleFrom: "2022-08-15T00:00:00+09:00",
    saleTo: "2022-08-22T00:00:00+09:00",
    saleDetail: "コーヒー豆半額（一部除外品あり）／商品10%OFF",
    isNew: false,
  },
];
