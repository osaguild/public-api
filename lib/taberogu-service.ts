import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as r53 from "aws-cdk-lib/aws-route53";
import * as r53Target from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as path from "path";

export class TaberoguService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const target = scope.node.tryGetContext("target");
    const context = scope.node.tryGetContext(target);

    // hosted zone
    const hostedZone = r53.HostedZone.fromLookup(this, "hosted-zone", {
      domainName: "osaguild.com",
    });

    // certificate
    const certificate = new acm.DnsValidatedCertificate(this, "certificate", {
      domainName: context.CERTIFICATE_DOMAIN,
      subjectAlternativeNames: [context.CERTIFICATE_DOMAIN],
      hostedZone: hostedZone,
      region: "us-east-1",
    });

    // handler
    const taberoguGetShop = new lambda.Function(this, "taberogu-get-shop", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "../taberogu/")),
      handler: "taberogu.getShop",
      memorySize: 128,
      timeout: cdk.Duration.seconds(10),
      functionName: `public-api-${target}-taberogu-get-shop`,
      description: "taberogu get shop",
      environment: {
        HOGE: "hoge",
      },
    });

    const taberoguGetRanking = new lambda.Function(
      this,
      "taberogu-get-ranking",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset(path.join(__dirname, "../taberogu/")),
        handler: "taberogu.getRanking",
        memorySize: 256,
        timeout: cdk.Duration.seconds(60),
        functionName: `public-api-${target}-taberogu-get-ranking`,
        description: "taberogu get ranking",
        environment: {
          HOGE: "hoge",
        },
      }
    );

    // api gateway
    const api = new apigw.RestApi(this, `public-api-${target}`, {
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
      domainName: {
        domainName: context.API_DOMAIN,
        certificate: certificate,
      },
      restApiName: `public-api-${target}`,
      description: "public api",
    });

    // a record
    new r53.ARecord(this, "a-record", {
      recordName: context.API_DOMAIN,
      zone: hostedZone,
      target: r53.RecordTarget.fromAlias(new r53Target.ApiGateway(api)),
    });

    // add endpoint
    const apiV1 = api.root.addResource("v1");
    const apiV1Taberogu = apiV1.addResource("taberogu");
    apiV1Taberogu.addMethod(
      "GET",
      new apigw.LambdaIntegration(taberoguGetShop)
    );
    const apiV1TaberoguRanking = apiV1Taberogu.addResource("ranking");
    apiV1TaberoguRanking.addMethod(
      "GET",
      new apigw.LambdaIntegration(taberoguGetRanking)
    );
  }
}
