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
      "🎉2022年8月1日の物件情報🎉\n" +
      "[検索条件：新宿駅/池袋駅/浦和駅/1LDK/2LDK/3LDK]\n\n" +
      "【物件A】\n" +
      "新宿駅 徒歩10分\n" +
      "101 1LDK 12.5万円\n" +
      "102 2LDK 13万円\n" +
      "103 3LDK 15.7万円\n" +
      "https://www.shamaison.com/test/a/\n\n" +
      "【物件B】\n" +
      "池袋駅 徒歩15分\n" +
      "202 2LDK 13万円\n" +
      "https://www.shamaison.com/test/b/\n\n" +
      "【物件C】\n" +
      "浦和駅 徒歩20分\n" +
      "101 1LDK 9.5万円\n" +
      "303 2LDK 12.4万円\n" +
      "https://www.shamaison.com/test/c/\n\n" +
      "⭐シャーメゾン公式サイト⭐\n" +
      "新宿駅: https://www.shamaison.com/tokyo/route/1/station/1\n" +
      "池袋駅: https://www.shamaison.com/tokyo/route/1/station/2\n" +
      "浦和駅: https://www.shamaison.com/tokyo/route/2/station/3";
    expect(res).toBe(message);
  });

  it("[success]under 5000 character message", async () => {
    // 230 repeats length is 4994 characters
    const repeat = 230;
    const res = await createShamaisonMessage(
      controllableBuildings(repeat),
      new Date(2022, 7, 1),
      stations,
      floorPlans,
      scrapingTargetStations
    );
    const message =
      "🎉2022年8月1日の物件情報🎉\n" +
      "[検索条件：新宿駅/池袋駅/浦和駅/1LDK/2LDK/3LDK]\n\n" +
      "【物件A】\n" +
      "新宿駅 徒歩10分\n" +
      "101 1LDK 10万円\n" +
      "https://www.shamaison.com/test/a/\n\n" +
      "【物件B】\n" +
      "池袋駅 徒歩15分\n" +
      "101 1LDK 10万円\n" +
      "20 length characters".repeat(repeat) +
      "\n\n" +
      "【物件C】\n" +
      "浦和駅 徒歩20分\n" +
      "101 1LDK 10万円\n" +
      "https://www.shamaison.com/test/c/\n\n" +
      "⭐シャーメゾン公式サイト⭐\n" +
      "新宿駅: https://www.shamaison.com/tokyo/route/1/station/1\n" +
      "池袋駅: https://www.shamaison.com/tokyo/route/1/station/2\n" +
      "浦和駅: https://www.shamaison.com/tokyo/route/2/station/3";
    expect(res).toBe(message);
  });

  it("[success]over 5000 character message", async () => {
    // 231 repeats length is 4985 characters and building 3 isn't shown
    const repeat = 231;
    const res = await createShamaisonMessage(
      controllableBuildings(repeat),
      new Date(2022, 7, 1),
      stations,
      floorPlans,
      scrapingTargetStations
    );
    const message =
      "🎉2022年8月1日の物件情報🎉\n" +
      "[検索条件：新宿駅/池袋駅/浦和駅/1LDK/2LDK/3LDK]\n\n" +
      "【物件A】\n" +
      "新宿駅 徒歩10分\n" +
      "101 1LDK 10万円\n" +
      "https://www.shamaison.com/test/a/\n\n" +
      "【物件B】\n" +
      "池袋駅 徒歩15分\n" +
      "101 1LDK 10万円\n" +
      "20 length characters".repeat(repeat) +
      "\n\n※文字数制限のため2/3件を表示しています。\n\n" +
      "⭐シャーメゾン公式サイト⭐\n" +
      "新宿駅: https://www.shamaison.com/tokyo/route/1/station/1\n" +
      "池袋駅: https://www.shamaison.com/tokyo/route/1/station/2\n" +
      "浦和駅: https://www.shamaison.com/tokyo/route/2/station/3";
    expect(res).toBe(message);
  });
});

describe("findRooms()", () => {
  describe("test for floorPlans param", () => {
    it("[failed]set no param", async () => {
      const res = await findRooms(buildings[0].rooms, [], 0, 100, false);
      expect(res.length).toBe(0);
    });

    it("[success]set single param", async () => {
      const res = await findRooms(buildings[0].rooms, ["1LDK"], 0, 100, false);
      expect(res.length).toBe(1);
      expect(res[0].floorPlan).toBe("1LDK");
    });

    it("[failed]set single param but doesn't hit", async () => {
      const res = await findRooms(buildings[0].rooms, ["1DK"], 0, 100, false);
      expect(res.length).toBe(0);
    });

    it("[success]set multiple params", async () => {
      const res = await findRooms(
        buildings[0].rooms,
        ["1LDK", "2LDK"],
        0,
        100,
        false
      );
      expect(res.length).toBe(2);
      expect(res[0].floorPlan).toBe("1LDK");
      expect(res[1].floorPlan).toBe("2LDK");
    });

    it("[failed]set multiple params but doesn't hit", async () => {
      const res = await findRooms(
        buildings[0].rooms,
        ["1DK", "2DK"],
        0,
        100,
        false
      );
      expect(res.length).toBe(0);
    });
  });

  describe("test for minRent and maxRent", () => {
    it("[success]set the same rent for min and max rent", async () => {
      const res = await findRooms(
        buildings[0].rooms,
        ["1LDK", "2LDK", "3LDK"],
        12.5,
        15.7,
        false
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
        15.7,
        false
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
        15.6,
        false
      );
      // rooms: 12.5万円 / 13.0万円 / 15.7万円
      expect(res.length).toBe(2);
      expect(res[0].rent).toBe(12.5);
      expect(res[1].rent).toBe(13.0);
    });
  });

  describe("test for onlyNew", () => {
    it("[success]set the true", async () => {
      const res = await findRooms(
        buildings[0].rooms,
        ["1LDK", "2LDK", "3LDK"],
        0,
        100,
        true
      );
      // rooms: true / false / true
      expect(res.length).toBe(2);
      expect(res[0].isNew).toBe(true);
      expect(res[1].isNew).toBe(true);
    });

    it("[success]set the false", async () => {
      const res = await findRooms(
        buildings[0].rooms,
        ["1LDK", "2LDK", "3LDK"],
        0,
        100,
        false
      );
      // rooms: true / false / true
      expect(res.length).toBe(3);
      expect(res[0].isNew).toBe(true);
      expect(res[1].isNew).toBe(false);
      expect(res[2].isNew).toBe(true);
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
        100,
        false
      );
      expect(res.length).toBe(0);
    });

    it("[success]set single param", async () => {
      const res = await findBuildings(
        buildings,
        ["新宿駅"],
        ["1LDK", "2LDK", "3LDK"],
        0,
        100,
        false
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
        100,
        false
      );
      expect(res.length).toBe(0);
    });

    it("[success]set multiple param", async () => {
      const res = await findBuildings(
        buildings,
        ["新宿駅", "池袋駅"],
        ["1LDK", "2LDK", "3LDK"],
        0,
        100,
        false
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
        100,
        false
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
        12,
        false
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
        12,
        false
      );
      // not match
      expect(res.length).toBe(0);
    });
  });
  describe("test for onlyNew param", () => {
    it("[success]onlyNew", async () => {
      const _buildings = _.cloneDeep(buildings);
      const res = await findBuildings(
        _buildings,
        ["新宿駅", "池袋駅", "浦和駅"],
        ["1LDK", "2LDK", "3LDK"],
        0,
        100,
        true
      );
      // matches are 物件A 101,103 / 物件C 101,303
      expect(res.length).toBe(2);
      expect(res[0].name).toBe("物件A");
      expect(res[0].rooms.length).toBe(2);
      expect(res[0].rooms[0].roomNo).toBe("101");
      expect(res[0].rooms[1].roomNo).toBe("103");
      expect(res[1].name).toBe("物件C");
      expect(res[1].rooms.length).toBe(2);
      expect(res[1].rooms[0].roomNo).toBe("101");
      expect(res[1].rooms[1].roomNo).toBe("303");
    });

    it("[success]not onlyNew, all", async () => {
      const _buildings = _.cloneDeep(buildings);
      const res = await findBuildings(
        _buildings,
        ["新宿駅", "池袋駅", "浦和駅"],
        ["1LDK", "2LDK", "3LDK"],
        0,
        100,
        false
      );
      // not match
      // matches are 物件A 101,102,103 / 物件B 202 / 物件C 101,303
      expect(res.length).toBe(3);
      expect(res[0].name).toBe("物件A");
      expect(res[0].rooms.length).toBe(3);
      expect(res[0].rooms[0].roomNo).toBe("101");
      expect(res[0].rooms[1].roomNo).toBe("102");
      expect(res[0].rooms[2].roomNo).toBe("103");
      expect(res[1].name).toBe("物件B");
      expect(res[1].rooms.length).toBe(1);
      expect(res[1].rooms[0].roomNo).toBe("202");
      expect(res[2].name).toBe("物件C");
      expect(res[2].rooms.length).toBe(2);
      expect(res[2].rooms[0].roomNo).toBe("101");
      expect(res[2].rooms[1].roomNo).toBe("303");
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
        isNew: true,
      },
      {
        roomNo: "102",
        rent: 13.0,
        floorPlan: "2LDK",
        space: 60.33,
        url: "https://www.shamaison.com/test/a/102/",
        isNew: false,
      },
      {
        roomNo: "103",
        rent: 15.7,
        floorPlan: "3LDK",
        space: 76.22,
        url: "https://www.shamaison.com/test/a/103/",
        isNew: true,
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
        isNew: false,
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
        isNew: true,
      },
      {
        roomNo: "303",
        rent: 12.4,
        floorPlan: "2LDK",
        space: 62.32,
        url: "https://www.shamaison.com/test/c/303/",
        isNew: true,
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
      rooms: [
        {
          roomNo: "101",
          rent: 10.0,
          floorPlan: "1LDK",
          space: 50.0,
          url: "https://www.shamaison.com/test/a/101/",
          isNew: true,
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
      url: "20 length characters".repeat(repeat),
      rooms: [
        {
          roomNo: "101",
          rent: 10.0,
          floorPlan: "1LDK",
          space: 50.0,
          url: "https://www.shamaison.com/test/b/101/",
          isNew: true,
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
          rent: 10.0,
          floorPlan: "1LDK",
          space: 50.0,
          url: "https://www.shamaison.com/test/c/101/",
          isNew: true,
        },
      ],
    },
  ] as Building[];
};
