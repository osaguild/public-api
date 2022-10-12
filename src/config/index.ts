import "dotenv/config";
import { FloorPlan } from "../shamaison";

type Config = {
  HOOK_TARGET_BRANCH: "main" | "develop";
  KALDI_TARGET_PREFECTURE: string;
  KALDI_CHANNEL_ACCESS_TOKEN: string;
  SHAMAISON_CHANNEL_ACCESS_TOKEN: string;
  SHAMAISON_TARGET_FLOOR_PLANS: FloorPlan[];
  SHAMAISON_TARGET_STATIONS: string[];
  SHAMAISON_TARGET_MIN_RENT: number;
  SHAMAISON_TARGET_MAX_RENT: number;
  SHAMAISON_TARGET_ONLY_NEW: boolean;
};

const HOOK_TARGET_BRANCH = process.env.HOOK_TARGET_BRANCH;
const KALDI_TARGET_PREFECTURE = process.env.KALDI_TARGET_PREFECTURE;
const KALDI_CHANNEL_ACCESS_TOKEN = process.env.KALDI_CHANNEL_ACCESS_TOKEN;
const SHAMAISON_CHANNEL_ACCESS_TOKEN =
  process.env.SHAMAISON_CHANNEL_ACCESS_TOKEN;
const SHAMAISON_TARGET_FLOOR_PLANS = JSON.parse(
  process.env.SHAMAISON_TARGET_FLOOR_PLANS as string
);
const SHAMAISON_TARGET_STATIONS = JSON.parse(
  process.env.SHAMAISON_TARGET_STATIONS as string
);
const SHAMAISON_TARGET_MIN_RENT = Number(
  process.env.SHAMAISON_TARGET_MIN_RENT as string
);
const SHAMAISON_TARGET_MAX_RENT = Number(
  process.env.SHAMAISON_TARGET_MAX_RENT as string
);
const SHAMAISON_TARGET_ONLY_NEW = Boolean(
  process.env.SHAMAISON_TARGET_ONLY_NEW as string
);

const globalConfig = {
  HOOK_TARGET_BRANCH,
  KALDI_TARGET_PREFECTURE,
  KALDI_CHANNEL_ACCESS_TOKEN,
  SHAMAISON_CHANNEL_ACCESS_TOKEN,
  SHAMAISON_TARGET_FLOOR_PLANS,
  SHAMAISON_TARGET_STATIONS,
  SHAMAISON_TARGET_MIN_RENT,
  SHAMAISON_TARGET_MAX_RENT,
  SHAMAISON_TARGET_ONLY_NEW,
} as Config;

export { Config, globalConfig };
