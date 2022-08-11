import "dotenv/config";
import { Building, Station } from "./types";
import { ApplicationResult } from "../common/types";
import { sendLineMessage } from "../messagingApi";
import { getLatestFile } from "../github";
import { getDateFromFileName } from "../utils";

const searchableStations: Station[] = [
  { name: "浦和駅", url: "/saitama/route/J002093/station/21982" },
];

export const sendShamaisonMessage = async () => {
  // get station from searchableStations
  const getStation = () => {
    const stationName = process.env.SHAMAISON_STATION as string;
    let station: Station | undefined = undefined;
    for (const _station of searchableStations) {
      if (stationName === _station.name) {
        station = _station;
      }
    }
    return station;
  };

  const createMessage = (
    date: Date,
    station: Station,
    buildings: Building[]
  ) => {
    // e.g: 🎉2022年01月01日 新宿駅の物件情報🎉
    const title = `🎉${date.getFullYear()}年${
      date.getMonth() + 1
    }月${date.getDate()}日 ${station.name}の物件情報🎉\n`;

    // e.g: 【シャーメゾン】JR山手線 新宿駅 徒歩10分 https://www.shamaison.com/tokyo/area/00000/00000000/
    const buildingInfo =
      buildings.length === 0
        ? "対象地域の物件情報はありません\n"
        : buildings
            .map((e) => {
              return `【${e.name}】\n${e.access}\n${e.url}\n`;
            })
            .join("\n");

    // e.g: ⭐カルディ公式サイト⭐https://www.shamaison.com/tokyo/route/0000000/station/00000
    const officialLink = `⭐シャーメゾン公式サイト⭐\nhttps://www.shamaison.com${station.url}`;

    return `${title}\n${buildingInfo}\n${officialLink}`;
  };

  try {
    const latestFile = await getLatestFile("SHAMAISON");
    if (!latestFile) throw new Error("can't get latest file");
    const date = getDateFromFileName(latestFile.name);
    const buildings: Building[] = JSON.parse(latestFile.data);
    const station = getStation();
    if (!station) throw new Error("can't get station");
    const message = createMessage(date, station, buildings);
    const result = await sendLineMessage("SHAMAISON", message);
    return result;
  } catch (e) {
    console.log("kaldi.sendKaldiMessage is failed");
    return "FAILED" as ApplicationResult;
  }
};
