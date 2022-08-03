import { hookScrapingEvent } from "../kaldi/kaldi";

jest.setTimeout(10000);

describe("kaldi", () => {
  it("hook", async () => {
    const res = await hookScrapingEvent("dummy");
    expect(res.body).toBe("http status of messaging api is 200");
  });
});
