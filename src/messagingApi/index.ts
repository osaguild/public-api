import axios, { AxiosRequestConfig } from "axios";
import { MessagingApiRequest } from "./types";
import { v4 as uuidv4 } from "uuid";

export const sendLineMessage = async (message: string) => {
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
