import { hook } from "../kaldi/kaldi";
import { HookRequest, HookRequestBody } from "../kaldi/types";
import * as clone from "clone";

jest.setTimeout(10000);

describe("kaldi", () => {
  const bodyTest: HookRequestBody = {
    action: "completed",
    workflow_run: {
      name: "scraping test",
      head_branch: "develop",
      path: ".github/workflows/scraping-test.yaml",
      status: "completed",
      conclusion: "success",
    },
  };
  const bodyScheduled: HookRequestBody = {
    action: "completed",
    workflow_run: {
      name: "scheduled scraping",
      head_branch: "develop",
      path: ".github/workflows/scheduled-scraping.yaml",
      status: "completed",
      conclusion: "success",
    },
  };

  it("[success]hook scraping test", async () => {
    const req: HookRequest = { body: JSON.stringify(bodyTest) };
    const res = await hook(req);
    expect(res.statusCode).toBe(200);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("success to send message");
  });
  it("[success]hook scheduled scraping", async () => {
    const req: HookRequest = { body: JSON.stringify(bodyScheduled) };
    const res = await hook(req);
    expect(res.statusCode).toBe(200);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("success to send message");
  });
  it("[failed]request param error[action]", async () => {
    const _body = clone(bodyScheduled);
    _body.action = "failed";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. workflow is not completed");
  });
  it("[failed]request param error[status]", async () => {
    const _body = clone(bodyScheduled);
    _body.workflow_run.status = "failed";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. workflow is not completed");
  });
  it("[failed]request param error[conclusion]", async () => {
    const _body = clone(bodyScheduled);
    _body.workflow_run.conclusion = "failed";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. workflow is not completed");
  });
  it("[failed]request param error[name] for scraping test", async () => {
    const _body = clone(bodyTest);
    _body.workflow_run.name = "test";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. not a target workflow");
  });
  it("[failed]request param error[path] for scraping test", async () => {
    const _body = clone(bodyTest);
    _body.workflow_run.path = ".github/workflows/test.yaml";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. not a target workflow");
  });
  it("[failed]request param error[name] for scheduled scraping", async () => {
    const _body = clone(bodyScheduled);
    _body.workflow_run.name = "test";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. not a target workflow");
  });
  it("[failed]request param error[path] for scheduled scraping", async () => {
    const _body = clone(bodyScheduled);
    _body.workflow_run.path = ".github/workflows/test.yaml";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. not a target workflow");
  });
  it("[failed]request param error[head_branch]", async () => {
    const _body = clone(bodyScheduled);
    _body.workflow_run.head_branch = "main";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. not a target branch");
  });
});
