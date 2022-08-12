import axios from "axios";
import { Buffer } from "buffer";
import { Content, File } from "./types";
import { AppType } from "../messagingApi/types";

export const getLatestFile = async (appType: AppType) => {
  const appDir = () => {
    if (appType === "KALDI") {
      return "kaldi";
    } else if (appType === "SHAMAISON") {
      return "shamaison";
    } else {
      throw new Error("appType is not defined");
    }
  };

  try {
    // get file lists from scheduled-scraper repository
    const resContents = await axios.get(
      `https://api.github.com/repos/osaguild/scheduled-scraper/contents/data/${appDir()}?ref=${
        process.env.HOOK_TARGET_BRANCH
      }`
    );
    const contents: Content[] = resContents.data;

    // bottom of array is newest scraping data.
    const targetContent = contents[contents.length - 1];

    // get sales data from scheduled-scraper repository
    const resFile = await axios.get(targetContent.url);

    // data decoded base64. because github api returns base64 encoded data.
    return {
      name: targetContent.name,
      data: Buffer.from(resFile.data.content, "base64").toString(),
    } as File;
  } catch (e) {
    console.log("github.getLatestFile is failed", e);
    return undefined;
  }
};
