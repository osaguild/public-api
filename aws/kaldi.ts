import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import "dotenv/config";

export class Kaldi extends Construct {
  // lambda function
  hookScraping: cdk.aws_lambda.Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const target = scope.node.tryGetContext("target");

    this.hookScraping = new lambda.Function(this, "kaldi-hook-scraping", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "../kaldi/")),
      handler: "kaldi.hookScraping",
      memorySize: 128,
      timeout: cdk.Duration.seconds(10),
      functionName: `public-api-${target}-kaldi-hook-scraping`,
      description: "kaldi hook scraping",
      environment: {
        LINE_CHANNEL_ACCESS_TOKEN: process.env
          .LINE_CHANNEL_ACCESS_TOKEN as string,
      },
    });
  }
}
