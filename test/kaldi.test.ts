import { hook } from "../src/kaldi";
import { HookRequestBody } from "../src/kaldi/types";
import { PostRequest } from "../src/common/types";
import * as clone from "clone";

jest.setTimeout(10000);

describe("kaldi", () => {
  const body: HookRequestBody = {
    action: "completed",
    workflow_run: {
      name: "scraping dev",
      path: ".github/workflows/scraping-dev.yaml",
      status: "completed",
      conclusion: "success",
    },
  };

  it("[success]hook scraping", async () => {
    const req: PostRequest = { body: JSON.stringify(body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(200);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("success to send message");
  });
  it("[failed]request param error[action]", async () => {
    const _body = clone(body);
    _body.action = "failed";
    const req: PostRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(400);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("workflow isn't completed");
  });
  it("[failed]request param error[status]", async () => {
    const _body = clone(body);
    _body.workflow_run.status = "failed";
    const req: PostRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(400);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("workflow isn't completed");
  });
  it("[failed]request param error[conclusion]", async () => {
    const _body = clone(body);
    _body.workflow_run.conclusion = "failed";
    const req: PostRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(400);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("workflow isn't completed");
  });
  it("[failed]request param error[name]", async () => {
    const _body = clone(body);
    _body.workflow_run.name = "test";
    const req: PostRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(400);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("workflow is incorrect");
  });
  it("[failed]request param error[path]", async () => {
    const _body = clone(body);
    _body.workflow_run.path = ".github/workflows/test.yaml";
    const req: PostRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(400);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("workflow is incorrect");
  });
});
