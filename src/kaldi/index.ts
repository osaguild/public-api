import "dotenv/config";
import { File, Sale } from "./types";
import { ApplicationResult } from "../common/types";
import { sendLineMessage } from "../messagingApi";
import { getLatestFile } from "../github";
import { getDateFromFileName, formatDateToYYYYMMDD } from "../utils";

export const sendKaldiMessage = async () => {
  // e.g: 東京都
  const prefecture = process.env.KALDI_PREFECTURE as string;

  const selectSales = (sales: Sale[], prefecture: string) => {
    // select target prefecture's sales data. unmatched sales data is ignored.
    return sales
      .map((e) => {
        return e.shopAddress.includes(prefecture) ? e : undefined;
      })
      .filter((e): e is Exclude<typeof e, undefined> => e !== undefined);
  };

  const createMessage = (date: Date, prefecture: string, sales: Sale[]) => {
    // e.g: 🎉2022年01月01日 東京都のセール情報🎉
    const title = `🎉${date.getFullYear()}年${
      date.getMonth() + 1
    }月${date.getDate()}日 ${prefecture}のセール情報🎉\n`;

    // e.g: 【新宿店】2022/1/1 〜 2022/1/7
    const saleInfo =
      sales.length === 0
        ? "対象地域のセール情報はありません\n"
        : sales
            .map((e) => {
              return `【${e.shopName}】\n${formatDateToYYYYMMDD(
                new Date(Date.parse(e.saleFrom))
              )} 〜 ${formatDateToYYYYMMDD(new Date(Date.parse(e.saleTo)))}\n`;
            })
            .join("\n");

    // e.g: ⭐カルディ公式サイト⭐https://map.kaldi.co.jp/kaldi/articleList?account=kaldi&accmd=1&ftop=1&kkw001=2010-03-12T13%3A10%3A35
    const officialLink = `⭐カルディ公式サイト⭐\nhttps://map.kaldi.co.jp/kaldi/articleList?account=kaldi&accmd=1&ftop=1&kkw001=2010-03-12T13%3A10%3A35`;

    return `${title}\n${saleInfo}\n${officialLink}`;
  };

  try {
    const latestFile = await getLatestFile("KALDI");
    if (!latestFile) throw new Error("can't get latest file");
    const date = getDateFromFileName(latestFile.name);
    const file: File = JSON.parse(latestFile.data);
    const selectedSales = selectSales(file.data, prefecture);
    const message = createMessage(date, prefecture, selectedSales);
    const result = await sendLineMessage("KALDI", message);
    return result;
  } catch (e) {
    console.log("kaldi.sendKaldiMessage is failed", e);
    return "FAILED" as ApplicationResult;
  }
};
