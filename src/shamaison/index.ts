type Building = {
  name: string;
  address: string;
  station: string;
  distance: string;
  yearBuilt: string;
  numberOfStairs: number;
  url: string;
  rooms: Room[];
};

type Room = {
  roomNo: string;
  rent: number;
  floorPlan: FloorPlan;
  space: number;
  url: string;
};

type Station = {
  name: string;
  url: string;
};

type ShamaisonBuildingInfo = {
  createdAt: string;
  stations: Station[];
  data: Building[];
};

type FloorPlan =
  | "1R"
  | "1K"
  | "1DK"
  | "1LDK"
  | "2K"
  | "2DK"
  | "2LDK"
  | "3K"
  | "3DK"
  | "3LDK"
  | "4K"
  | "4DK"
  | "4LDK"
  | "5K"
  | "5DK"
  | "5LDK";

const findBuildings = (buildings: Building[], floorPlans: FloorPlan[]) =>
  buildings
    .map((e) => (findRooms(e.rooms, floorPlans).length > 0 ? e : undefined))
    .filter((e): e is Exclude<typeof e, undefined> => e !== undefined);

const findRooms = (rooms: Room[], floorPlans: FloorPlan[]) =>
  rooms
    .map((e) => (floorPlans.indexOf(e.floorPlan) !== -1 ? e : undefined))
    .filter((e): e is Exclude<typeof e, undefined> => e !== undefined);

const createShamaisonMessage = (
  buildings: Building[],
  date: Date,
  stations: Station[]
) => {
  // e.g: 🎉2022年01月01日 新宿駅/池袋駅/東京駅の物件情報🎉
  const title = `🎉${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日 ${stations
    .map((e) => `${e.name}`)
    .join("/")}の物件情報🎉\n`;

  // e.g: ⭐カルディ公式サイト⭐https://www.shamaison.com/tokyo/route/0000000/station/00000
  const officialLink = `⭐シャーメゾン公式サイト⭐\n${stations
    .map((e) => `${e.name}: https://www.shamaison.com${e.url}`)
    .join("\n")}`;

  // e.g(n/a): 対象地域の物件情報はありません。
  // e.g(hit): 【シャーメゾン】JR山手線 新宿駅 徒歩10分 https://www.shamaison.com/tokyo/area/00000/00000000/
  if (buildings.length === 0) {
    const noApplicableBuilding = "対象地域の物件情報はありません。\n\n";
    return `${title}\n${noApplicableBuilding}${officialLink}`;
  } else {
    let message = "";
    let buildingsInfo = "";
    for (let i = 0; i < buildings.length; i++) {
      // if your message over 5000 characters, show warn message
      const warn = `※文字数制限のため${i + 1}/${
        buildings.length + 1
      }件を表示しています。\n`;

      // if message length isn't over 5000 characters, set building info
      const nextBuildingsInfo =
        buildingsInfo +
        `【${buildings[i].name}】\n${buildings[i].station} ${buildings[i].distance}\n${buildings[i].url}\n\n`;

      // if message length isn't over 5000 characters, set next message
      const nextMessage =
        i === buildings.length - 1
          ? `${title}\n${nextBuildingsInfo}${officialLink}`
          : `${title}\n${nextBuildingsInfo}${warn}\n${officialLink}`;

      // check message length and set confirmed message
      if (nextMessage.length <= 5000) {
        buildingsInfo = nextBuildingsInfo;
        message = nextMessage;
      } else {
        break;
      }
    }
    return message;
  }
};

export {
  findBuildings,
  findRooms,
  createShamaisonMessage,
  Building,
  Room,
  Station,
  FloorPlan,
  ShamaisonBuildingInfo,
};
