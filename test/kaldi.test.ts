import { sendKaldiMessage } from "../src/kaldi";

jest.setTimeout(10000);

describe("sendKaldiMessage()", () => {
  it("[success]", async () => {
    const res = await sendKaldiMessage();
    expect(res).toBe("SUCCESS");
  });
});
