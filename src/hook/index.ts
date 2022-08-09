import { HookRequestBody } from "./types";
import { PostRequest } from "../common/types";
import { ApplicationError, BadRequestError } from "../common/error";
import {
  successResponse,
  badRequestErrorResponse,
  applicationErrorResponse,
  unknownErrorResponse,
} from "../common/response";
import { sendKaldiMessage } from "../kaldi";

const checkRequest = (body: HookRequestBody) => {
  // check completed status
  if (
    body.action !== "completed" ||
    body.workflow_run.status !== "completed" ||
    body.workflow_run.conclusion !== "success"
  )
    throw new BadRequestError("workflow isn't completed");

  // check target workflow for dev
  if (
    process.env.HOOK_TARGET_BRANCH === "develop" &&
    (body.workflow_run.name !== "scraping dev" ||
      body.workflow_run.path !== ".github/workflows/scraping-dev.yaml")
  )
    throw new BadRequestError("workflow is incorrect");

  // check target workflow for prd
  if (
    process.env.HOOK_TARGET_BRANCH === "main" &&
    (body.workflow_run.name !== "scraping prd" ||
      body.workflow_run.path !== ".github/workflows/scraping-prd.yaml")
  )
    throw new BadRequestError("workflow is incorrect");
};

export const hook = async (request: PostRequest) => {
  try {
    checkRequest(JSON.parse(request.body));
    const kaldiResult = await sendKaldiMessage();
    if (kaldiResult === "SUCCESS") return successResponse("success");
    else throw new ApplicationError("kaldi failed");
  } catch (e) {
    return e instanceof BadRequestError
      ? badRequestErrorResponse(e.message)
      : e instanceof ApplicationError
      ? applicationErrorResponse(e.message)
      : unknownErrorResponse();
  }
};
