import { sendShamaisonMessage } from "../src/shamaison";

jest.setTimeout(10000);

describe("sendShamaisonMessage()", () => {
  it("[success]", async () => {
    const res = await sendShamaisonMessage();
    expect(res).toBe("SUCCESS");
  });
});
