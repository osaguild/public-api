import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as taberogu from '../lib/taberogu-service';

export class PublicApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    new taberogu.TaberoguService(this, 'taberogu-service');
  }
}
