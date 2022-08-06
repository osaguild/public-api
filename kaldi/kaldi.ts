import axios, { AxiosRequestConfig } from "axios";
import {
  Sale,
  MessagingApiRequest,
  HookRequest,
  Response,
  HookRequestBody,
  Content,
} from "./types";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import { Buffer } from "buffer";

const notFoundError = (message: string): Response => {
  return {
    statusCode: 404,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: message,
  };
};

const unknownError = (): Response => {
  return {
    statusCode: 500,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: "unknown error occurs",
  };
};

export const hook = async (request: HookRequest) => {
  // selected area
  const prefecture = process.env.PREFECTURE as string;

  /**
   * all parameters are constant except head_branch.
   * if parameter doesn't match, throw Error
   */
  const checkRequest = (body: HookRequestBody) => {
    // check completed status
    if (
      body.action !== "completed" ||
      body.workflow_run.status !== "completed" ||
      body.workflow_run.conclusion !== "success"
    )
      throw new Error("request params error. workflow is not completed");

    // check target branch. head_branch: develop or main
    if (
      body.workflow_run.head_branch !==
      (process.env.HOOK_TARGET_BRANCH as string)
    )
      throw new Error("request params error. not a target branch");

    // check target workflow
    if (
      process.env.HOOK_TARGET_BRANCH === "develop" &&
      (body.workflow_run.name !== "scraping dev" ||
        body.workflow_run.path !== ".github/workflows/scraping-dev.yaml")
    )
      throw new Error("request params error. not a target workflow");
    else if (
      process.env.HOOK_TARGET_BRANCH === "main" &&
      (body.workflow_run.name !== "scraping prd" ||
        body.workflow_run.path !== ".github/workflows/scraping-prd.yaml")
    )
      throw new Error("request params error. not a target workflow");
  };

  /**
   * use github rest api to get file contents
   */
  const getSales = async () => {
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
    const resFile = await axios.get(targetContent.url);
    // content is encoded base64 string. decode it to utf8 string.
    const encodedSales = Buffer.from(resFile.data.content, "base64").toString();
    const sales: Sale[] = JSON.parse(encodedSales);
    return { date, sales };
  };

  /**
   * select sale information on the specified prefecture.
   */
  const selectSales = (sales: Sale[], prefecture: string) => {
    return sales
      .map((e) => {
        return e.shopAddress.includes(prefecture) ? e : undefined;
      })
      .filter((e): e is Exclude<typeof e, undefined> => e !== undefined);
  };

  /**
   * if sales of your area is exist, send message with sales information.
   */
  const createMessage = (date: Date, prefecture: string, sales: Sale[]) => {
    const title = `🎉${date.getFullYear()}年${
      date.getMonth() + 1
    }月${date.getDate()}日 ${prefecture}のセール情報🎉\n`;
    const saleInfo =
      sales.length === 0
        ? "対象地域のセール情報はありません\n"
        : sales
            .map((e) => {
              return `【${e.shopName}】\n${e.salePeriod}\n`;
            })
            .join("\n");
    const officialLink = `⭐カルディ公式サイト⭐\nhttps://map.kaldi.co.jp/kaldi/articleList?account=kaldi&accmd=1&ftop=1&kkw001=2010-03-12T13%3A10%3A35`;

    return `${title}\n${saleInfo}\n${officialLink}`;
  };

  /**
   * send message to line using messaging api.
   */
  const sendLineMessage = async (message: string) => {
    const req: MessagingApiRequest = {
      messages: [
        {
          type: "text",
          text: message,
        },
      ],
    };

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
        "X-Line-Retry-Key": uuidv4(),
      },
    };

    const res = await axios.post(
      "https://api.line.me/v2/bot/message/broadcast",
      req,
      config
    );
    if (res.status !== 200) throw new Error("call messaging api is failed");

    return res.status;
  };

  try {
    checkRequest(JSON.parse(request.body));
    const { date, sales } = await getSales();
    const selectedSales = selectSales(sales, prefecture);
    const message = createMessage(date, prefecture, selectedSales);
    await sendLineMessage(message);
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "success to send message",
    } as Response;
  } catch (e) {
    if (e instanceof Error) return notFoundError(e.message);
    else return unknownError();
  }
};
