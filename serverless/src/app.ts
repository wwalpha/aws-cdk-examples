import { App, Stack, AwsAccountId, AwsRegion, AwsStackId, AwsStackName, StackProps } from '@aws-cdk/cdk';
// import { CloudFrontStack } from '.';
// import CognitoStack from './cognito/cognito';
// import CodePipelineStack from './codepipeline/codePipeline';
import { CognitoStack, CloudFrontStack, ApiGatewayStack, CodePipelineStack } from '.';
import { getResourceName, getProjectName } from '@const';

// import { Stack, App, AwsAccountId, AwsRegion, AwsStackId, AwsStackName } from '@aws-cdk/cdk';
// import { S3Stack } from '.';
// import { StackProps } from './utils';

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
  }
}

class RootApp extends App {
  constructor() {
    super();

    new RootStack(this, getProjectName(), {});
  }
}

new RootApp().run();
