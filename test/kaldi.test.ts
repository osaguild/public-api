import { sendKaldiMessage } from "../src/kaldi";

jest.setTimeout(10000);

describe("kaldi", () => {
  it("[success]sendKaldiMessage", async () => {
    const res = await sendKaldiMessage();
    expect(res).toBe("SUCCESS");
  });
});
