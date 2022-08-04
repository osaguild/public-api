import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Common, CommonProps } from "./common";
import { Taberogu } from "./taberogu";
import { Kaldi } from "./kaldi";

export class PublicApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const taberogu = new Taberogu(this, "taberogu-service");
    const kaldi = new Kaldi(this, "kaldi-service");

    const commonProps: CommonProps = {
      taberogu: {
        getShop: taberogu.getShop,
        getRanking: taberogu.getRanking,
      },
      kaldi: {
        hookScraping: kaldi.hookScraping,
      },
    };
    new Common(this, "common-service", commonProps);
  }
}
