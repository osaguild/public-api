import { Building, createShamaisonMessage } from "../shamaison";

jest.setTimeout(10000);

describe("createShamaisonMessage()", () => {
  it("[success]empty buildings", async () => {
    const res = await createShamaisonMessage(
      [] as Building[],
      new Date(2022, 7, 1),
      stations
    );
    const message =
      "🎉2022年8月1日 新宿駅/池袋駅/浦和駅の物件情報🎉\n\n対象地域の物件情報はありません。\n\n⭐シャーメゾン公式サイト⭐\n新宿駅: https://www.shamaison.com/tokyo/route/1/station/1\n池袋駅: https://www.shamaison.com/tokyo/route/1/station/2\n浦和駅: https://www.shamaison.com/tokyo/route/2/station/3";
    expect(res).toBe(message);
  });

  it("[success]multi buildings", async () => {
    const res = await createShamaisonMessage(
      buildings,
      new Date(2022, 7, 1),
      stations
    );
    const message =
      "🎉2022年8月1日 新宿駅/池袋駅/浦和駅の物件情報🎉\n\n【物件A】\n新宿駅 徒歩10分\nhttps://www.shamaison.com/test/a/\n\n【物件B】\n池袋駅 徒歩15分\nhttps://www.shamaison.com/test/b/\n\n【物件C】\n浦和駅 徒歩20分\nhttps://www.shamaison.com/test/c/\n\n⭐シャーメゾン公式サイト⭐\n新宿駅: https://www.shamaison.com/tokyo/route/1/station/1\n池袋駅: https://www.shamaison.com/tokyo/route/1/station/2\n浦和駅: https://www.shamaison.com/tokyo/route/2/station/3";
    expect(res).toBe(message);
  });

  it("[success]under 5000 character message", async () => {
    // 233 repeats length is 4988 characters
    const repeat = 233;
    const res = await createShamaisonMessage(
      controllableBuildings(repeat),
      new Date(2022, 7, 1),
      stations
    );
    const message = `🎉2022年8月1日 新宿駅/池袋駅/浦和駅の物件情報🎉\n\n【物件A】\n新宿駅 徒歩10分\nhttps://www.shamaison.com/test/a/\n\n【物件B】\n池袋駅 徒歩15分\n${"20 length characters".repeat(
      repeat
    )}\n\n【物件C】\n浦和駅 徒歩20分\nhttps://www.shamaison.com/test/c/\n\n⭐シャーメゾン公式サイト⭐\n新宿駅: https://www.shamaison.com/tokyo/route/1/station/1\n池袋駅: https://www.shamaison.com/tokyo/route/1/station/2\n浦和駅: https://www.shamaison.com/tokyo/route/2/station/3`;
    expect(res).toBe(message);
  });

  it("[success]over 5000 character message", async () => {
    // 234 repeats length is 4983 characters and building 3 isn't shown
    const repeat = 234;
    const res = await createShamaisonMessage(
      controllableBuildings(repeat),
      new Date(2022, 7, 1),
      stations
    );
    const message = `🎉2022年8月1日 新宿駅/池袋駅/浦和駅の物件情報🎉\n\n【物件A】\n新宿駅 徒歩10分\nhttps://www.shamaison.com/test/a/\n\n【物件B】\n池袋駅 徒歩15分\n${"20 length characters".repeat(
      repeat
    )}\n\n※文字数制限のため2/4件を表示しています。\n\n⭐シャーメゾン公式サイト⭐\n新宿駅: https://www.shamaison.com/tokyo/route/1/station/1\n池袋駅: https://www.shamaison.com/tokyo/route/1/station/2\n浦和駅: https://www.shamaison.com/tokyo/route/2/station/3`;
    expect(res).toBe(message);
  });
});

// below is the data for test
const stations = [
  {
    name: "新宿駅",
    url: "/tokyo/route/1/station/1",
  },
  {
    name: "池袋駅",
    url: "/tokyo/route/1/station/2",
  },
  {
    name: "浦和駅",
    url: "/tokyo/route/2/station/3",
  },
];

const buildings = [
  {
    name: "物件A",
    address: "東京都新宿区xxx",
    station: "新宿駅",
    distance: "徒歩10分",
    yearBuilt: "2022-10-01T00:00:00+09:00",
    numberOfStairs: 1,
    url: "https://www.shamaison.com/test/a/",
    rooms: [
      {
        roomNo: "101",
        rent: 12.5,
        floorPlan: "1LDK",
        space: 50.0,
        url: "https://www.shamaison.com/test/a/101/",
      },
      {
        roomNo: "102",
        rent: 13.0,
        floorPlan: "2LDK",
        space: 60.33,
        url: "https://www.shamaison.com/test/a/102/",
      },
      {
        roomNo: "103",
        rent: 15.7,
        floorPlan: "3LDK",
        space: 76.22,
        url: "https://www.shamaison.com/test/a/103/",
      },
    ],
  },
  {
    name: "物件B",
    address: "東京都豊島区xxx",
    station: "池袋駅",
    distance: "徒歩15分",
    yearBuilt: "2022-11-01T00:00:00+09:00",
    numberOfStairs: 2,
    url: "https://www.shamaison.com/test/b/",
    rooms: [
      {
        roomNo: "202",
        rent: 13.0,
        floorPlan: "2LDK",
        space: 60.15,
        url: "https://www.shamaison.com/test/b/202/",
      },
    ],
  },
  {
    name: "物件C",
    address: "埼玉県さいたま市xxx",
    station: "浦和駅",
    distance: "徒歩20分",
    yearBuilt: "2022-12-01T00:00:00+09:00",
    numberOfStairs: 3,
    url: "https://www.shamaison.com/test/c/",
    rooms: [
      {
        roomNo: "101",
        rent: 9.5,
        floorPlan: "1LDK",
        space: 40.51,
        url: "https://www.shamaison.com/test/c/101/",
      },
      {
        roomNo: "303",
        rent: 12.4,
        floorPlan: "2LDK",
        space: 62.32,
        url: "https://www.shamaison.com/test/c/303/",
      },
    ],
  },
];

const controllableBuildings = (repeat: number) => {
  return [
    {
      name: "物件A",
      address: "東京都新宿区xxx",
      station: "新宿駅",
      distance: "徒歩10分",
      yearBuilt: "2022-10-01T00:00:00+09:00",
      numberOfStairs: 1,
      url: "https://www.shamaison.com/test/a/",
      rooms: [],
    },
    {
      name: "物件B",
      address: "東京都豊島区xxx",
      station: "池袋駅",
      distance: "徒歩15分",
      yearBuilt: "2022-11-01T00:00:00+09:00",
      numberOfStairs: 2,
      url: "20 length characters".repeat(repeat),
      rooms: [],
    },
    {
      name: "物件C",
      address: "埼玉県さいたま市xxx",
      station: "浦和駅",
      distance: "徒歩20分",
      yearBuilt: "2022-12-01T00:00:00+09:00",
      numberOfStairs: 3,
      url: "https://www.shamaison.com/test/c/",
      rooms: [],
    },
  ];
};
