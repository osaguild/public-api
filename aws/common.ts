import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as r53 from "aws-cdk-lib/aws-route53";
import * as r53Target from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";

export interface CommonProps {
  taberogu: {
    getShop: cdk.aws_lambda.Function;
    getRanking: cdk.aws_lambda.Function;
  };
  kaldi: {
    hookScraping: cdk.aws_lambda.Function;
  };
}

export class Common extends Construct {
  constructor(scope: Construct, id: string, props: CommonProps) {
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

    // a record
    new r53.ARecord(this, "a-record", {
      recordName: context.API_DOMAIN,
      zone: hostedZone,
      target: r53.RecordTarget.fromAlias(new r53Target.ApiGateway(api)),
    });

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

    // add endpoint
    const apiV1 = api.root.addResource("v1");

    // taberogu
    const apiV1Taberogu = apiV1.addResource("taberogu");
    apiV1Taberogu.addMethod(
      "GET",
      new apigw.LambdaIntegration(props.taberogu.getShop)
    );
    const apiV1TaberoguRanking = apiV1Taberogu.addResource("ranking");
    apiV1TaberoguRanking.addMethod(
      "GET",
      new apigw.LambdaIntegration(props.taberogu.getRanking)
    );
    apiV1Taberogu.addMethod(
      "GET",
      new apigw.LambdaIntegration(props.taberogu.getShop)
    );

    // kaldi
    const apiV1Kaldi = apiV1.addResource("kaldi");
    const apiV1KaldiHook = apiV1Kaldi.addResource("hook");
    const apiV1KaldiHookScraping = apiV1KaldiHook.addResource("scraping");
    apiV1KaldiHookScraping.addMethod(
      "POST",
      new apigw.LambdaIntegration(props.kaldi.hookScraping)
    );
  }
}
