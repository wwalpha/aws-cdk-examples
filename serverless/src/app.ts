import { App, Stack, AwsAccountId, AwsRegion, AwsStackId, AwsStackName, StackProps } from '@aws-cdk/cdk';
import { getResourceName, getProjectName } from '@const';
import { LambdaWarmup } from './warmup';
import jszip = require('jszip');
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { ApiGatewayStack } from '@api';
import { CognitoStack } from '@cognito';
import { CloudFrontStack } from '@cloudfront';
import { CodePipelineStack } from '@codepipeline';

class RootStack extends Stack {

  constructor(parent: App, name: string, props: StackProps) {
    super(parent, name, props);

    this.templateOptions.metadata = {

      // all CloudFormation's pseudo-parameters are supported via the `cdk.AwsXxx` classes
      PseudoParameters: [
        new AwsAccountId(),
        new AwsRegion(),
        new AwsStackId(),
        new AwsStackName(),
      ],
    };

    // Cognito
    new CognitoStack(parent, getResourceName('Cognito'), props);
    // Api Gateway
    new ApiGatewayStack(parent, getResourceName('ApiGateway'), props);
    // CloudFront
    new CloudFrontStack(parent, getResourceName('CloudFront'), props);
    // Code Pipeline
    new CodePipelineStack(parent, getResourceName('CodePipeline'), props);

    LambdaWarmup(this);
  }
}

class RootApp extends App {
  constructor() {
    super();

    new RootStack(this, getProjectName(), {});
  }
}

// Upload用ソースZip化
const source2Zip = async () => {
  const zip = new jszip();

  zip.file('index.js', readFileSync(join(__dirname, 'warmup/app.js')));

  const value = await zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
  });

  writeFileSync(join(__dirname, 'warmup/app.zip'), value);
};

source2Zip().then(() => {
  new RootApp().run();
});
