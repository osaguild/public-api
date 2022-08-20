import { PostRequest } from "../utils/request";
import { ApplicationError, ValidationError } from "../utils/error";
import {
  successResponse,
  badRequestErrorResponse,
  applicationErrorResponse,
} from "../utils/response";
import { globalConfig } from "../config";
import { getLatestFile } from "../github";
import { KaldiSaleInfo, findSales, createKaldiMessage } from "../kaldi";
import { formatFileNameToDate } from "../utils/date";
import { sendLineMessage } from "../line";
import {
  createShamaisonMessage,
  ShamaisonBuildingInfo,
  findBuildings,
} from "../shamaison";

interface RequestBody {
  action: string;
  workflow_run: {
    name: string;
    path: string;
    status: string;
    conclusion: string;
  };
}

export const hook = async (request: PostRequest) => {
  // check if the request matches the target github webhook.
  const validate = (body: RequestBody) => {
    // check completed status
    if (
      body.action !== "completed" ||
      body.workflow_run.status !== "completed" ||
      body.workflow_run.conclusion !== "success"
    )
      throw new ValidationError("workflow isn't completed");
    // check target workflow for dev
    if (
      globalConfig().HOOK_TARGET_BRANCH === "develop" &&
      (body.workflow_run.name !== "scraping dev" ||
        body.workflow_run.path !== ".github/workflows/scraping-dev.yaml")
    )
      throw new ValidationError("workflow is incorrect at develop");
    // check target workflow for prd
    if (
      globalConfig().HOOK_TARGET_BRANCH === "main" &&
      (body.workflow_run.name !== "scraping prd" ||
        body.workflow_run.path !== ".github/workflows/scraping-prd.yaml")
    )
      throw new ValidationError("workflow is incorrect at main");
  };

  // send kaldi message
  const sendKaldiMessage = async () => {
    const file = await getLatestFile<KaldiSaleInfo>("KALDI");
    const kaldiSaleInfo = file.data;
    const sales = findSales(
      kaldiSaleInfo.data,
      globalConfig().KALDI_TARGET_PREFECTURE
    );
    const message = createKaldiMessage(
      sales,
      formatFileNameToDate(file.name),
      globalConfig().KALDI_TARGET_PREFECTURE
    );
    await sendLineMessage("KALDI", message);
  };

  // send shamaison message
  const sendShamaisonMessage = async () => {
    const file = await getLatestFile<ShamaisonBuildingInfo>("SHAMAISON");
    const shamaisonBuildingInfo = file.data;
    const buildings = findBuildings(
      shamaisonBuildingInfo.data,
      globalConfig().SHAMAISON_TARGET_FLOOR_PLANS
    );
    const message = createShamaisonMessage(
      buildings,
      formatFileNameToDate(file.name),
      shamaisonBuildingInfo.stations
    );
    await sendLineMessage("SHAMAISON", message);
  };

  try {
    validate(JSON.parse(request.body));
    await Promise.all([sendKaldiMessage(), sendShamaisonMessage()]);
    return successResponse("success");
  } catch (e) {
    console.log(e);
    return e instanceof ValidationError
      ? badRequestErrorResponse(e.message)
      : e instanceof ApplicationError
      ? applicationErrorResponse(e.message)
      : applicationErrorResponse("unexpected error");
  }
};
