import axios from "axios";
import { Sale, HookRequestBody, Content } from "./types";
import { sendLineMessage } from "../messagingApi";
import {
  successResponse,
  badRequestErrorResponse,
  unknownErrorResponse,
} from "../common/response";
import { PostRequest } from "../common/types";
import "dotenv/config";
import { Buffer } from "buffer";
import { BadRequestError } from "../common/error";

export const hook = async (request: PostRequest) => {
  // e.g: 東京都
  const prefecture = process.env.PREFECTURE as string;

  const checkRequest = (body: HookRequestBody) => {
    // check completed status
    if (
      body.action !== "completed" ||
      body.workflow_run.status !== "completed" ||
      body.workflow_run.conclusion !== "success"
    )
      throw new BadRequestError("workflow isn't completed");

    // check target workflow for dev
    if (
      process.env.HOOK_TARGET_BRANCH === "develop" &&
      (body.workflow_run.name !== "scraping dev" ||
        body.workflow_run.path !== ".github/workflows/scraping-dev.yaml")
    )
      throw new BadRequestError("workflow is incorrect");

    // check target workflow for prd
    if (
      process.env.HOOK_TARGET_BRANCH === "main" &&
      (body.workflow_run.name !== "scraping prd" ||
        body.workflow_run.path !== ".github/workflows/scraping-prd.yaml")
    )
      throw new BadRequestError("workflow is incorrect");
  };

  const getSales = async () => {
    // get file lists from scheduled-scraper repository
    const resContents = await axios.get(
      `https://api.github.com/repos/osaguild/scheduled-scraper/contents/data/kaldi?ref=${process.env.HOOK_TARGET_BRANCH}`
    );
    const contents: Content[] = resContents.data;

    // bottom of array is newest scraping data.
    const targetContent = contents[contents.length - 1];
    const sDate = targetContent.name.slice(0, 8);
    const date = new Date(
      Number(sDate.slice(0, 4)),
      Number(sDate.slice(4, 6)) - 1,
      Number(sDate.slice(6, 8))
    );

    // get sales data from scheduled-scraper repository
    const resFile = await axios.get(targetContent.url);

    // decode base64. because github api returns base64 encoded data.
    const encodedSales = Buffer.from(resFile.data.content, "base64").toString();
    const sales: Sale[] = JSON.parse(encodedSales);

    return { date, sales };
  };

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

    // e.g: 【新宿店】2022年1月1日（月） 〜 2022年1月7日（日）
    const saleInfo =
      sales.length === 0
        ? "対象地域のセール情報はありません\n"
        : sales
            .map((e) => {
              return `【${e.shopName}】\n${e.salePeriod}\n`;
            })
            .join("\n");

    // e.g: ⭐カルディ公式サイト⭐https://map.kaldi.co.jp/kaldi/articleList?account=kaldi&accmd=1&ftop=1&kkw001=2010-03-12T13%3A10%3A35
    const officialLink = `⭐カルディ公式サイト⭐\nhttps://map.kaldi.co.jp/kaldi/articleList?account=kaldi&accmd=1&ftop=1&kkw001=2010-03-12T13%3A10%3A35`;

    return `${title}\n${saleInfo}\n${officialLink}`;
  };

  try {
    checkRequest(JSON.parse(request.body));
    const { date, sales } = await getSales();
    const selectedSales = selectSales(sales, prefecture);
    const message = createMessage(date, prefecture, selectedSales);
    await sendLineMessage(message);

    return successResponse("success to send message");
  } catch (e) {
    return e instanceof BadRequestError
      ? badRequestErrorResponse(e.message)
      : unknownErrorResponse();
  }
};
