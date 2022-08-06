import axios, { AxiosRequestConfig } from "axios";
import {
  Sale,
  MessagingApiRequest,
  HookRequest,
  Response,
  HookRequestBody,
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
  /**
   * all parameters are constant except head_branch. if parameter doesn't match, throw Error
   * head_branch: develop or main
   */
  const checkRequest = (body: HookRequestBody) => {
    if (body.action !== "completed")
      throw new Error("request params error. action is incorrect");

    if (body.workflow_run.name !== "scraping")
      throw new Error("request params error. name is incorrect");

    if (
      body.workflow_run.head_branch !==
      (process.env.HOOK_TARGET_BRANCH as string)
    )
      throw new Error("request params error. head_branch is incorrect");

    if (body.workflow_run.path !== ".github/workflows/scraping.yaml")
      throw new Error("request params error. path is incorrect");

    if (body.workflow_run.event !== "workflow_dispatch")
      throw new Error("request params error. event is incorrect");

    if (body.workflow_run.status !== "completed")
      throw new Error("request params error. status is incorrect");

    if (body.workflow_run.conclusion !== "success")
      throw new Error("request params error. conclusion is incorrect");
  };

  /**
   * use github rest api to get file contents
   * decode base64 string to utf8 string
   */
  const getSales = async () => {
    const _res = await axios.get(
      "https://api.github.com/repos/osaguild/scheduled-scraper/contents/data/kaldi?ref=develop"
    );
    const _url = _res.data[_res.data.length - 1].url;
    const res_ = await axios.get(_url);
    const _sales = Buffer.from(res_.data.content, "base64").toString();
    return JSON.parse(_sales) as Sale[];
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
    checkRequest(JSON.parse(request.body));
    const sales = await getSales();
    const selectedSales = selectSales(sales, "東京都");
    const message = createMessage(selectedSales);
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
