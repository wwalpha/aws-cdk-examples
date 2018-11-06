import { App, Stack, AwsAccountId, AwsRegion, AwsStackId, AwsStackName } from '@aws-cdk/cdk';
// import { CloudFrontStack } from '.';
// import CognitoStack from './cognito/cognito';
// import CodePipelineStack from './codepipeline/codePipeline';
import { CognitoStack, CloudFrontStack } from '.';
import { prefix, CommonProps } from '@utils';

// import { Stack, App, AwsAccountId, AwsRegion, AwsStackId, AwsStackName } from '@aws-cdk/cdk';
// import { S3Stack } from '.';
// import { CommonProps } from './utils';

class RootStack extends Stack {

  constructor(parent: App, name: string, props: CommonProps) {
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
    new CognitoStack(parent, `${prefix(props)}-Cognito`, props);

    // new ApiGatewayStack(parent, `${prefix(props)}-Api`);

    // // new apigatew
    // // CloudFront
    new CloudFrontStack(parent, `${prefix(props)}-CloudFront`, props);

    // new CodePipelineStack(parent, `${prefix(props)}-CodePipeline`, props);
  }
}

// class RootStack extends Stack {
//   constructor(parent: App, name: string, props: CommonProps) {
//     super(parent, name, props);

//     this.templateOptions.metadata = {

//       // all CloudFormation's pseudo-parameters are supported via the `cdk.AwsXxx` classes
//       PseudoParameters: [
//         new AwsAccountId(),
//         new AwsRegion(),
//         new AwsStackId(),
//         new AwsStackName(),
//       ],
//     };

//     // S3
//     new S3Stack(parent, `${name}-S3`, props);
//     // DynamoDB
//     // new DynamodbStack(parent, `${name}-Dynamodb`, comProps);

//     // // All Lambda
//     // const lambda = Lambda();

//     // new CognitoStack(parent, `${name}-Cognito`, {
//     //   ...comProps,
//     //   lambda: lambda,
//     //   s3: s3.output,
//     // });

//     // // S3 Event
//     // S3Event(this, {
//     //   ...comProps,
//     //   bucket: s3,
//     // });

//     // RestApi(this, {
//     //   ...comProps,
//     //   lambda,
//     // });

//     // CodeBuild
//     // CodeBuild(this, comProps);

//   }
// }
// const ENV_TYPE = 'dev';
// const PROJECT_NAME = 'Serverless';

// const comProps: CommonProps = {
//   envType: ENV_TYPE,
//   project: PROJECT_NAME,
// };

// const app = new App();

// new RootStack(app, `${ENV_TYPE}-${PROJECT_NAME}`, comProps);

// app.run();

class MyApp extends App {
  constructor() {
    super();

    const ENV_TYPE = 'dev';
    const PROJECT_NAME = 'Serverless';

    const props: CommonProps = {
      envType: ENV_TYPE,
      project: PROJECT_NAME,
    };

    new RootStack(this, prefix(props), props);
  }
}

new MyApp().run();
