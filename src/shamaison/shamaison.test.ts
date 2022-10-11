import {
  Building,
  Station,
  FloorPlan,
  createShamaisonMessage,
  findRooms,
  findBuildings,
} from "../shamaison";
import * as lodash from "lodash";

jest.setTimeout(10000);
const _ = lodash;

describe("createShamaisonMessage()", () => {
  it("[success]multi buildings", async () => {
    const res = await createShamaisonMessage(
      buildings,
      new Date(2022, 7, 1),
      stations,
      floorPlans,
      scrapingTargetStations
    );
    const message =
      "🎉2022年8月1日の物件情報🎉\n[検索条件：新宿駅/池袋駅/浦和駅/1LDK/2LDK/3LDK]\n\n【物件A】\n新宿駅 徒歩10分\nhttps://www.shamaison.com/test/a/\n\n【物件B】\n池袋駅 徒歩15分\nhttps://www.shamaison.com/test/b/\n\n【物件C】\n浦和駅 徒歩20分\nhttps://www.shamaison.com/test/c/\n\n⭐シャーメゾン公式サイト⭐\n新宿駅: https://www.shamaison.com/tokyo/route/1/station/1\n池袋駅: https://www.shamaison.com/tokyo/route/1/station/2\n浦和駅: https://www.shamaison.com/tokyo/route/2/station/3";
    expect(res).toBe(message);
  });

  it("[success]under 5000 character message", async () => {
    // 232 repeats length is 4992 characters
    const repeat = 232;
    const res = await createShamaisonMessage(
      controllableBuildings(repeat),
      new Date(2022, 7, 1),
      stations,
      floorPlans,
      scrapingTargetStations
    );
    const message = `🎉2022年8月1日の物件情報🎉\n[検索条件：新宿駅/池袋駅/浦和駅/1LDK/2LDK/3LDK]\n\n【物件A】\n新宿駅 徒歩10分\nhttps://www.shamaison.com/test/a/\n\n【物件B】\n池袋駅 徒歩15分\n${"20 length characters".repeat(
      repeat
    )}\n\n【物件C】\n浦和駅 徒歩20分\nhttps://www.shamaison.com/test/c/\n\n⭐シャーメゾン公式サイト⭐\n新宿駅: https://www.shamaison.com/tokyo/route/1/station/1\n池袋駅: https://www.shamaison.com/tokyo/route/1/station/2\n浦和駅: https://www.shamaison.com/tokyo/route/2/station/3`;
    expect(res).toBe(message);
  });

  it("[success]over 5000 character message", async () => {
    // 233 repeats length is 4985 characters and building 3 isn't shown
    const repeat = 233;
    const res = await createShamaisonMessage(
      controllableBuildings(repeat),
      new Date(2022, 7, 1),
      stations,
      floorPlans,
      scrapingTargetStations
    );
    const message = `🎉2022年8月1日の物件情報🎉\n[検索条件：新宿駅/池袋駅/浦和駅/1LDK/2LDK/3LDK]\n\n【物件A】\n新宿駅 徒歩10分\nhttps://www.shamaison.com/test/a/\n\n【物件B】\n池袋駅 徒歩15分\n${"20 length characters".repeat(
      repeat
    )}\n\n※文字数制限のため2/4件を表示しています。\n\n⭐シャーメゾン公式サイト⭐\n新宿駅: https://www.shamaison.com/tokyo/route/1/station/1\n池袋駅: https://www.shamaison.com/tokyo/route/1/station/2\n浦和駅: https://www.shamaison.com/tokyo/route/2/station/3`;
    expect(res).toBe(message);
  });
});

describe("findRooms()", () => {
  describe("test for floorPlans param", () => {
    it("[failed]set no param", async () => {
      const res = await findRooms(buildings[0].rooms, [], 0, 100);
      expect(res.length).toBe(0);
    });

    it("[success]set single param", async () => {
      const res = await findRooms(buildings[0].rooms, ["1LDK"], 0, 100);
      expect(res.length).toBe(1);
      expect(res[0].floorPlan).toBe("1LDK");
    });

    it("[failed]set single param but doesn't hit", async () => {
      const res = await findRooms(buildings[0].rooms, ["1DK"], 0, 100);
      expect(res.length).toBe(0);
    });

    it("[success]set multiple params", async () => {
      const res = await findRooms(buildings[0].rooms, ["1LDK", "2LDK"], 0, 100);
      expect(res.length).toBe(2);
      expect(res[0].floorPlan).toBe("1LDK");
      expect(res[1].floorPlan).toBe("2LDK");
    });

    it("[failed]set multiple params but doesn't hit", async () => {
      const res = await findRooms(buildings[0].rooms, ["1DK", "2DK"], 0, 100);
      expect(res.length).toBe(0);
    });
  });

  describe("test for minRent and maxRent", () => {
    it("[success]set the same rent for min and max rent", async () => {
      const res = await findRooms(
        buildings[0].rooms,
        ["1LDK", "2LDK", "3LDK"],
        12.5,
        15.7
      );
      // rooms: 12.5万円 / 13.0万円 / 15.7万円
      expect(res.length).toBe(3);
      expect(res[0].rent).toBe(12.5);
      expect(res[1].rent).toBe(13.0);
      expect(res[2].rent).toBe(15.7);
    });

    it("[success]set higher than min rent", async () => {
      const res = await findRooms(
        buildings[0].rooms,
        ["1LDK", "2LDK", "3LDK"],
        12.6,
        15.7
      );
      // rooms: 12.5万円 / 13.0万円 / 15.7万円
      expect(res.length).toBe(2);
      expect(res[0].rent).toBe(13.0);
      expect(res[1].rent).toBe(15.7);
    });

    it("[success]set lower than max rent", async () => {
      const res = await findRooms(
        buildings[0].rooms,
        ["1LDK", "2LDK", "3LDK"],
        12.5,
        15.6
      );
      // rooms: 12.5万円 / 13.0万円 / 15.7万円
      expect(res.length).toBe(2);
      expect(res[0].rent).toBe(12.5);
      expect(res[1].rent).toBe(13.0);
    });
  });
});

describe("findBuildings()", () => {
  describe("test for building param", () => {
    it("[failed]set no param", async () => {
      const res = await findBuildings(
        buildings,
        [],
        ["1LDK", "2LDK", "3LDK"],
        0,
        100
      );
      expect(res.length).toBe(0);
    });

    it("[success]set single param", async () => {
      const res = await findBuildings(
        buildings,
        ["新宿駅"],
        ["1LDK", "2LDK", "3LDK"],
        0,
        100
      );
      expect(res.length).toBe(1);
      expect(res[0].station).toBe("新宿駅");
    });

    it("[failed]set single param but doesn't hit", async () => {
      const res = await findBuildings(
        buildings,
        ["東京駅"],
        ["1LDK", "2LDK", "3LDK"],
        0,
        100
      );
      expect(res.length).toBe(0);
    });

    it("[success]set multiple param", async () => {
      const res = await findBuildings(
        buildings,
        ["新宿駅", "池袋駅"],
        ["1LDK", "2LDK", "3LDK"],
        0,
        100
      );
      expect(res.length).toBe(2);
      expect(res[0].station).toBe("新宿駅");
      expect(res[1].station).toBe("池袋駅");
    });

    it("[failed]set multiple param but doesn't hit", async () => {
      const res = await findBuildings(
        buildings,
        ["東京駅", "渋谷駅"],
        ["1LDK", "2LDK", "3LDK"],
        0,
        100
      );
      expect(res.length).toBe(0);
    });
  });

  describe("test for rooms param", () => {
    it("[success]1LDK, 8-12万円", async () => {
      const _buildings = _.cloneDeep(buildings);
      const res = await findBuildings(
        _buildings,
        ["新宿駅", "池袋駅", "浦和駅"],
        ["1LDK"],
        8,
        12
      );
      // matches are 物件C 101
      expect(res.length).toBe(1);
      expect(res[0].name).toBe("物件C");
      expect(res[0].rooms.length).toBe(1);
      expect(res[0].rooms[0].roomNo).toBe("101");
    });

    it("[success]3LDK , 10-12万円", async () => {
      const _buildings = _.cloneDeep(buildings);
      const res = await findBuildings(
        _buildings,
        ["新宿駅", "池袋駅", "浦和駅"],
        ["1LDK", "2LDK", "3LDK"],
        10,
        12
      );
      // not match
      expect(res.length).toBe(0);
    });
  });
});

// below is the data for test
const scrapingTargetStations: Station[] = [
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

const stations = ["新宿駅", "池袋駅", "浦和駅"];

const floorPlans: FloorPlan[] = ["1LDK", "2LDK", "3LDK"];

const buildings: Building[] = [
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
  ] as Building[];
};
