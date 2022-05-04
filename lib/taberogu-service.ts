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

    // hosted zone
    const hostedZone = r53.HostedZone.fromLookup(
      this, "hosted-zone", {
      domainName: "osaguild.com",
    });

    // certificate
    const certificate = new acm.DnsValidatedCertificate(
      this, "certificate", {
      domainName: "*.dev.osaguild.com",
      subjectAlternativeNames: ["*.dev.osaguild.com"],
      hostedZone: hostedZone,
      region: "us-east-1",
    });

    // handler
    const handler = new lambda.Function(
      this, "taberogu-handler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "../taberogu/")),
      handler: "taberogu.getShop",
      memorySize: 128,
      timeout: cdk.Duration.seconds(10),
      functionName: "taberogu",
      description: "taberogu",
      environment: {
        "HOGE": "hoge",
      },
    });

    // api gateway
    const api = new apigw.RestApi(this, "api", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
      domainName: {
        domainName: "api.dev.osaguild.com",
        certificate: certificate,
      },
      restApiName: "api",
      description: "api",
    });

    // a record
    const aRecord = new r53.ARecord(this, "a-record", {
      recordName: "api.dev.osaguild.com",
      zone: hostedZone,
      target: r53.RecordTarget.fromAlias(new r53Target.ApiGateway(api)),
    });

    // add endpoint
    const apiV1 = api.root.addResource("v1");
    const apiV1Taberogu = apiV1.addResource("taberogu");
    apiV1Taberogu.addMethod("GET", new apigw.LambdaIntegration(handler));
  }
}