import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Common, CommonProps } from "./common";
import { Taberogu } from "./taberogu";
import { Hook } from "./hook";

export class PublicApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const taberogu = new Taberogu(this, "taberogu");
    const hook = new Hook(this, "hook");

    const commonProps: CommonProps = {
      taberogu: {
        getShop: taberogu.getShop,
        getRanking: taberogu.getRanking,
      },
      hook: hook.hook,
    };
    new Common(this, "common", commonProps);
  }
}
