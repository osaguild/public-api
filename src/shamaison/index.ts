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
  floorPlan: string;
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

  // e.g: 【シャーメゾン】JR山手線 新宿駅 徒歩10分 https://www.shamaison.com/tokyo/area/00000/00000000/
  // get 100 buildings because of the limit of the message
  const buildingInfo =
    buildings.length === 0
      ? "対象地域の物件情報はありません\n"
      : buildings
          .slice(0, 50)
          .map((e) => {
            return `【${e.name}】\n${e.station} ${e.distance}\n${e.url}\n`;
          })
          .join("\n");

  // e.g: ※文字数制限のため上限50件として配信しています。
  const warn = "※文字数制限のため上限50件として配信しています。\n";

  // e.g: ⭐カルディ公式サイト⭐https://www.shamaison.com/tokyo/route/0000000/station/00000
  const officialLink = `⭐シャーメゾン公式サイト⭐\n${stations
    .map((e) => `${e.name}: https://www.shamaison.com${e.url}`)
    .join("\n")}`;

  return `${title}\n${buildingInfo}\n${warn}\n${officialLink}`;
};

export {
  createShamaisonMessage,
  Building,
  Room,
  Station,
  ShamaisonBuildingInfo,
};
