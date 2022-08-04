import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Common, CommonProps } from "./common";
import { TaberoguService } from "./taberoguService";
import { kaldiService } from "./kaldiService";

export class PublicApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const taberogu = new TaberoguService(this, "taberogu-service");
    const kaldi = new kaldiService(this, "kaldi-service");

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
