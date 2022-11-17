import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import "dotenv/config";

export class Hook extends Construct {
  // lambda function
  hook: cdk.aws_lambda.Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const target = scope.node.tryGetContext("target");

    this.hook = new lambda.Function(this, "hook", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "../src/")),
      handler: "./hook/index.hook",
      memorySize: 128,
      timeout: cdk.Duration.seconds(10),
      functionName: `public-api-${target}-hook`,
      description: "hook",
      environment: {
        HOOK_TARGET_BRANCH: process.env.HOOK_TARGET_BRANCH as string,
        KALDI_CHANNEL_ACCESS_TOKEN: process.env
          .KALDI_CHANNEL_ACCESS_TOKEN as string,
        KALDI_TARGET_PREFECTURE: process.env.KALDI_TARGET_PREFECTURE as string,
        SHAMAISON_CHANNEL_ACCESS_TOKEN: process.env
          .SHAMAISON_CHANNEL_ACCESS_TOKEN as string,
        SHAMAISON_TARGET_STATIONS: process.env
          .SHAMAISON_TARGET_STATIONS as string,
        SHAMAISON_TARGET_FLOOR_PLANS: process.env
          .SHAMAISON_TARGET_FLOOR_PLANS as string,
        SHAMAISON_TARGET_MIN_RENT: process.env
          .SHAMAISON_TARGET_MIN_RENT as string,
        SHAMAISON_TARGET_MAX_RENT: process.env
          .SHAMAISON_TARGET_MAX_RENT as string,
        SHAMAISON_TARGET_ONLY_NEW: process.env
          .SHAMAISON_TARGET_ONLY_NEW as string,
      },
    });
  }
}
