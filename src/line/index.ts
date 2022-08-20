import axios, { AxiosRequestConfig } from "axios";
import { v4 as uuidv4 } from "uuid";
import { globalConfig } from "../config";
import { ApplicationError } from "../utils/error";

const MESSAGING_API_URI = "https://api.line.me/v2/bot/message/broadcast";

type AppType = "KALDI" | "SHAMAISON";

type Message = {
  type: "text";
  text: string;
};

interface MessagingApiRequest {
  messages: Message[];
}

const sendLineMessage = async (appType: AppType, message: string) => {
  const config = (_appType: AppType) => {
    const getChannelAccessToken = () =>
      _appType === "KALDI"
        ? globalConfig().KALDI_CHANNEL_ACCESS_TOKEN
        : globalConfig().SHAMAISON_CHANNEL_ACCESS_TOKEN;

    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getChannelAccessToken()}`,
        "X-Line-Retry-Key": uuidv4(),
      },
    } as AxiosRequestConfig;
  };

  const request: MessagingApiRequest = {
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  };

  const response = await axios.post(
    MESSAGING_API_URI,
    request,
    config(appType)
  );
  if (response.status !== 200)
    throw new ApplicationError(
      `messaging api's response status is ${response.status}`
    );
};

export { sendLineMessage };
