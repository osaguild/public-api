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
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "../src/")),
      handler: "./hook/index.hook",
      memorySize: 128,
      timeout: cdk.Duration.seconds(10),
      functionName: `public-api-${target}-hook`,
      description: "hook",
      environment: {
        KALDI_CHANNEL_ACCESS_TOKEN: process.env
          .KALDI_CHANNEL_ACCESS_TOKEN as string,
        SHAMAISON_CHANNEL_ACCESS_TOKEN: process.env
          .SHAMAISON_CHANNEL_ACCESS_TOKEN as string,
        HOOK_TARGET_BRANCH: process.env.HOOK_TARGET_BRANCH as string,
        KALDI_PREFECTURE: process.env.KALDI_PREFECTURE as string,
      },
    });
  }
}
