import "dotenv/config";

type Config = {
  HOOK_TARGET_BRANCH: "main" | "develop";
  KALDI_TARGET_PREFECTURE: string;
  KALDI_CHANNEL_ACCESS_TOKEN: string;
  SHAMAISON_CHANNEL_ACCESS_TOKEN: string;
};

const globalConfig = () => {
  const HOOK_TARGET_BRANCH = process.env.HOOK_TARGET_BRANCH;
  const KALDI_TARGET_PREFECTURE = process.env.KALDI_TARGET_PREFECTURE;
  const KALDI_CHANNEL_ACCESS_TOKEN = process.env.KALDI_CHANNEL_ACCESS_TOKEN;
  const SHAMAISON_CHANNEL_ACCESS_TOKEN =
    process.env.SHAMAISON_CHANNEL_ACCESS_TOKEN;
  return {
    HOOK_TARGET_BRANCH,
    KALDI_TARGET_PREFECTURE,
    KALDI_CHANNEL_ACCESS_TOKEN,
    SHAMAISON_CHANNEL_ACCESS_TOKEN,
  } as Config;
};

export { Config, globalConfig };
