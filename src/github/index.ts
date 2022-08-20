import axios from "axios";
import { Buffer } from "buffer";
import { globalConfig } from "../config";

const GITHUB_API_URI = "https://api.github.com";
type AppType = "KALDI" | "SHAMAISON";

type Content = {
  name: string;
  url: string;
};

type File<T> = {
  name: string;
  data: T;
};

const getLatestFile = async <T>(appType: AppType) => {
  // make github uri to access files.
  const makeDataDirUri = (_appType: AppType) => {
    return _appType === "KALDI"
      ? `${GITHUB_API_URI}/repos/osaguild/scheduled-scraper/contents/data/kaldi?ref=${
          globalConfig().HOOK_TARGET_BRANCH
        }`
      : `${GITHUB_API_URI}/repos/osaguild/scheduled-scraper/contents/data/shamaison?ref=${
          globalConfig().HOOK_TARGET_BRANCH
        }`;
  };

  // content is metadata of file. you can access file using content.url.
  const responseContent = await axios.get(makeDataDirUri(appType));
  const contents: Content[] = responseContent.data;
  // bottom of array is latest data.
  const latestContent = contents[contents.length - 1];
  // get latest file data.
  const responseFile = await axios.get(latestContent.url);
  // set base64 decoded data. github api returns base64 encoded data.
  const encodedData = Buffer.from(
    responseFile.data.content,
    "base64"
  ).toString();
  return {
    name: latestContent.name,
    data: JSON.parse(encodedData),
  } as File<T>;
};

export { File, getLatestFile };
