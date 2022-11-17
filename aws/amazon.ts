import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export class Amazon extends Construct {
  // lambda functions
  getWishList: cdk.aws_lambda.Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const target = scope.node.tryGetContext("target");

    this.getWishList = new lambda.Function(this, "amazon-get-wish-list", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "../src/")),
      handler: "./amazon/index.getWishList",
      memorySize: 128,
      timeout: cdk.Duration.seconds(10),
      functionName: `public-api-${target}-amazon-get-wish-list`,
      description: "amazon get wish list",
      environment: {
        HOGE: "hoge",
      },
    });
  }
}
