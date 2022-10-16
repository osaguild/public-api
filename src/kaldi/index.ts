import { formatDateToYYYYMMDD } from "../utils/date";
import { Sale, KaldiSaleInfo } from "./types";

const findSales = (sales: Sale[], prefecture: string) =>
  sales
    .map((e) => (e.shopAddress.includes(prefecture) ? e : undefined))
    .filter((e): e is Exclude<typeof e, undefined> => e !== undefined);

const hasNewSale = (sales: Sale[]) => sales.some((e) => e.isNew);

const createKaldiMessage = (sales: Sale[], date: Date, prefecture: string) => {
  // e.g: 🎉2022年01月01日 東京都のセール情報🎉
  const title = `🎉${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日 ${prefecture}のセール情報🎉\n`;

  // e.g: 【新宿店】2022/1/1 〜 2022/1/7
  const saleInfo = sales
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

export { findSales, createKaldiMessage, hasNewSale, Sale, KaldiSaleInfo };
