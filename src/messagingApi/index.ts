import axios, { AxiosRequestConfig } from "axios";
import { v4 as uuidv4 } from "uuid";
import { AppType, MessagingApiRequest } from "./types";
import { ApplicationResult } from "../common/types";

export const sendLineMessage = async (appType: AppType, message: string) => {
  const req: MessagingApiRequest = {
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  };

  const config = () => {
    const token = () => {
      if (appType === "KALDI") {
        return process.env.KALDI_CHANNEL_ACCESS_TOKEN;
      } else if (appType === "SHAMAISON") {
        return process.env.SHAMAISON_CHANNEL_ACCESS_TOKEN;
      } else {
        throw new Error("appType is not defined");
      }
    };

    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`,
        "X-Line-Retry-Key": uuidv4(),
      },
    } as AxiosRequestConfig;
  };

  try {
    const res = await axios.post(
      "https://api.line.me/v2/bot/message/broadcast",
      req,
      config()
    );
    if (res.status !== 200) throw new Error("http status isn't 200");

    return "SUCCESS" as ApplicationResult;
  } catch (e) {
    console.log("messageingApi.sendLineMessage is failed", e);
    return "FAILED" as ApplicationResult;
  }
};
