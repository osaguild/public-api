import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as r53 from "aws-cdk-lib/aws-route53";
import * as r53Target from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";

export interface CommonProps {
  taberogu: {
    getShop: cdk.aws_lambda.Function;
    getRanking: cdk.aws_lambda.Function;
  };
  hook: cdk.aws_lambda.Function;
}

export class Common extends Construct {
  constructor(scope: Construct, id: string, props: CommonProps) {
    super(scope, id);

    // prd or dev
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

    // api gateway
    const api = new apiGateway.RestApi(this, `public-api-${target}`, {
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS,
        allowMethods: apiGateway.Cors.ALL_METHODS,
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

    // taberogu
    const apiV1Taberogu = apiV1.addResource("taberogu");
    apiV1Taberogu.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(props.taberogu.getShop)
    );
    const apiV1TaberoguRanking = apiV1Taberogu.addResource("ranking");
    apiV1TaberoguRanking.addMethod(
      "GET",
      new apiGateway.LambdaIntegration(props.taberogu.getRanking)
    );

    // hook
    const apiV1Hook = apiV1.addResource("hook");
    apiV1Hook.addMethod("POST", new apiGateway.LambdaIntegration(props.hook));
  }
}
