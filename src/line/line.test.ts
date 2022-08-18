import { sendLineMessage } from "../line";

jest.setTimeout(10000);

describe("sendLineMessage()", () => {
  it("[success]kaldi", async () => {
    const message = "unit test for kaldi";
    const res = await sendLineMessage("KALDI", message);
    expect(res).toBe(undefined);
  });

  it("[success]shamaison", async () => {
    const message = "unit test for shamaison";
    const res = await sendLineMessage("SHAMAISON", message);
    expect(res).toBe(undefined);
  });
});
