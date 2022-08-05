import axios, { AxiosRequestConfig } from "axios";
import { Sale, MessagingApiRequest, HookRequest, Response } from "./types";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";

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
  /**
   * all parameters are constant except head_branch
   * if parameter doesn't match, throw Error
   * head_branch: develop or main
   */
  const checkRequest = (request: HookRequest) => {
    if (request.body.action !== "completed")
      throw new Error("request params error. action is incorrect");

    if (request.body.workflow_run.name !== "scraping")
      throw new Error("request params error. name is incorrect");

    if (
      request.body.workflow_run.head_branch !==
      (process.env.HOOK_TARGET_BRANCH as string)
    )
      throw new Error("request params error. head_branch is incorrect");

    if (request.body.workflow_run.path !== ".github/workflows/scraping.yaml")
      throw new Error("request params error. path is incorrect");

    if (request.body.workflow_run.event !== "workflow_dispatch")
      throw new Error("request params error. event is incorrect");

    if (request.body.workflow_run.status !== "completed")
      throw new Error("request params error. status is incorrect");

    if (request.body.workflow_run.conclusion !== "success")
      throw new Error("request params error. conclusion is incorrect");
  };

  const getSales = () => {
    return salesForTest;
  };

  const createMessage = (sales: Sale[]) => {
    return sales
      .map((e) => {
        return `${e.shopName} ${e.salePeriod}`;
      })
      .join("\n");
  };

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

    return res.status;
  };

  try {
    checkRequest(request);
    const sales = getSales();
    const message = createMessage(sales);
    const status = await sendLineMessage(message);
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: `http status of messaging api is ${status}`,
    } as Response;
  } catch (e) {
    if (e instanceof Error) return notFoundError(e.message);
    else return unknownError();
  }
};

// for development
const salesForTest: Sale[] = [
  {
    activeSale: "開催中",
    shopName: "アリオ葛西店",
    shopAddress: "東京都江戸川区東葛西9-3-3　アリオ葛西 1F",
    saleName: "お客様感謝セール",
    salePeriod: "2022年7月28日(木) ～ 2022年8月3日(水)",
    saleDetail: "コーヒー豆半額（一部除外品あり）／商品10%OFF",
  },
  {
    activeSale: "開催中",
    shopName: "桜新町店",
    shopAddress: "東京都世田谷区桜新町1丁目13-7　キャメルビル 1F",
    saleName: "お客様感謝セール",
    salePeriod: "2022年8月2日(火) ～ 2022年8月8日(月)",
    saleDetail: "コーヒー豆半額（一部除外品あり）／商品10%OFF",
  },
  {
    activeSale: "開催中",
    shopName: "恵比寿ガーデンプレイス店",
    shopAddress:
      "東京都渋谷区恵比寿4-20-7　恵比寿ガーデンプレイス センタープラザ B2F",
    saleName: "お客様感謝セール",
    salePeriod: "2022年8月2日(火) ～ 2022年8月8日(月)",
    saleDetail: "コーヒー豆半額（一部除外品あり）／商品10%OFF",
  },
  {
    activeSale: "予告",
    shopName: "浜田山店",
    shopAddress: "東京都杉並区浜田山3-34-27",
    saleName: "12周年記念セール",
    salePeriod: "2022年8月4日(木) ～ 2022年8月10日(水)",
    saleDetail: "コーヒー豆半額（一部除外品あり）／商品10%OFF",
  },
  {
    activeSale: "予告",
    shopName: "イオンモール多摩平の森店",
    shopAddress: "東京都日野市多摩平2-4-1　イオンモール多摩平の森 1F",
    saleName: "お客様感謝セール",
    salePeriod: "2022年8月9日(火) ～ 2022年8月15日(月)",
    saleDetail: "コーヒー豆半額（一部除外品あり）／商品10%OFF",
  },
];
