import {
  Building,
  Room,
  Station,
  ShamaisonBuildingInfo,
  FloorPlan,
} from "./types";

const findBuildings = (
  buildings: Building[],
  stations: string[],
  floorPlans: FloorPlan[]
) =>
  buildings
    .map((e) => (stations.indexOf(e.station) !== -1 ? e : undefined))
    .filter((e): e is Exclude<typeof e, undefined> => e !== undefined)
    .map((e) => (findRooms(e.rooms, floorPlans).length > 0 ? e : undefined))
    .filter((e): e is Exclude<typeof e, undefined> => e !== undefined);

const findRooms = (rooms: Room[], floorPlans: FloorPlan[]) =>
  rooms
    .map((e) => (floorPlans.indexOf(e.floorPlan) !== -1 ? e : undefined))
    .filter((e): e is Exclude<typeof e, undefined> => e !== undefined);

const createShamaisonMessage = (
  buildings: Building[],
  date: Date,
  stations: string[],
  floorPlans: FloorPlan[],
  scrapingTargetStations: Station[]
) => {
  // e.g: 🎉2022年01月01日の物件情報🎉
  const title = `🎉${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日の物件情報🎉\n`;

  // e.g: [検索条件：新宿駅/池袋駅/1LDK/2LDK/3LDK]
  const searchParam = `[検索条件：${stations.join("/")}/${floorPlans.join(
    "/"
  )}]\n`;

  // e.g: ⭐カルディ公式サイト⭐https://www.shamaison.com/tokyo/route/0000000/station/00000
  const officialLink = `⭐シャーメゾン公式サイト⭐\n${scrapingTargetStations
    .map((e) => `${e.name}: https://www.shamaison.com${e.url}`)
    .join("\n")}`;

  // e.g: 【シャーメゾン】JR山手線 新宿駅 徒歩10分 https://www.shamaison.com/tokyo/area/00000/00000000/
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
        ? `${title}${searchParam}\n${nextBuildingsInfo}${officialLink}`
        : `${title}${searchParam}\n${nextBuildingsInfo}${warn}\n${officialLink}`;

    // check message length and set confirmed message
    if (nextMessage.length <= 5000) {
      buildingsInfo = nextBuildingsInfo;
      message = nextMessage;
    } else {
      break;
    }
  }
  return message;
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
