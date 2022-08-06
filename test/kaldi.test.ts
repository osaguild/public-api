import { hook } from "../kaldi/kaldi";
import { HookRequest, HookRequestBody } from "../kaldi/types";
import * as clone from "clone";

jest.setTimeout(10000);

describe("kaldi", () => {
  const body: HookRequestBody = {
    action: "completed",
    workflow_run: {
      name: "scraping",
      head_branch: "develop",
      path: ".github/workflows/scraping.yaml",
      event: "workflow_dispatch",
      status: "completed",
      conclusion: "success",
    },
  };
  it("[success]hook", async () => {
    const req: HookRequest = { body: JSON.stringify(body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(200);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("http status of messaging api is 200");
  });
  it("[failed]request param error[action]", async () => {
    const _body = clone(body);
    _body.action = "failed";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. action is incorrect");
  });
  it("[failed]request param error[name]", async () => {
    const _body = clone(body);
    _body.workflow_run.name = "test";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. name is incorrect");
  });
  it("[failed]request param error[head_branch]", async () => {
    const _body = clone(body);
    _body.workflow_run.head_branch = "main";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. head_branch is incorrect");
  });
  it("[failed]request param error[path]", async () => {
    const _body = clone(body);
    _body.workflow_run.path = ".github/workflows/test.yaml";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. path is incorrect");
  });
  it("[failed]request param error[event]", async () => {
    const _body = clone(body);
    _body.workflow_run.event = "issue_comment";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. event is incorrect");
  });
  it("[failed]request param error[status]", async () => {
    const _body = clone(body);
    _body.workflow_run.status = "failed";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. status is incorrect");
  });
  it("[failed]request param error[conclusion]", async () => {
    const _body = clone(body);
    _body.workflow_run.conclusion = "failed";
    const req: HookRequest = { body: JSON.stringify(_body) };
    const res = await hook(req);
    expect(res.statusCode).toBe(404);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.body).toBe("request params error. conclusion is incorrect");
  });
});
