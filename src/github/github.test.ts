import { getLatestFile } from "../github";
import { KaldiSaleInfo } from "../kaldi";
import { ShamaisonBuildingInfo } from "../shamaison";

jest.setTimeout(10000);

describe("getLatestFile()", () => {
  it("[success]kaldi", async () => {
    const res = await getLatestFile<KaldiSaleInfo>("KALDI");
    expect(res.name).toMatch(/[0-9]{8}.json/);
  });
  it("[success]shamaison", async () => {
    const res = await getLatestFile<ShamaisonBuildingInfo>("SHAMAISON");
    expect(res.name).toMatch(/[0-9]{8}.json/);
  });
});
