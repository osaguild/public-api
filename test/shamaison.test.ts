import { sendShamaisonMessage } from "../src/shamaison";

jest.setTimeout(10000);

describe("kaldi", () => {
  it("[success]sendShamaisonMessage", async () => {
    const res = await sendShamaisonMessage();
    expect(res).toBe("SUCCESS");
  });
});
