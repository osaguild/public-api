import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export class Taberogu extends Construct {
  // lambda functions
  getShop: cdk.aws_lambda.Function;
  getRanking: cdk.aws_lambda.Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const target = scope.node.tryGetContext("target");

    this.getShop = new lambda.Function(this, "taberogu-get-shop", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "../src/")),
      handler: "./taberogu/index.getShop",
      memorySize: 128,
      timeout: cdk.Duration.seconds(10),
      functionName: `public-api-${target}-taberogu-get-shop`,
      description: "taberogu get shop",
      environment: {
        HOGE: "hoge",
      },
    });

    this.getRanking = new lambda.Function(this, "taberogu-get-ranking", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "../src/")),
      handler: "./taberogu/index.getRanking",
      memorySize: 256,
      timeout: cdk.Duration.seconds(60),
      functionName: `public-api-${target}-taberogu-get-ranking`,
      description: "taberogu get ranking",
      environment: {
        HOGE: "hoge",
      },
    });
  }
}
