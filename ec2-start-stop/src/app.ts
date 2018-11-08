import { App, Stack, AwsAccountId, AwsRegion, AwsStackId, AwsStackName } from '@aws-cdk/cdk';
import { CommonProps, prefix } from '@utils';
import { EC2_StartStop } from '@lambda';
import { Rules } from '@cloudwatch';

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

    const lambda = EC2_StartStop(this);

    Rules(this, lambda);
  }
}

class RootApp extends App {
  constructor() {
    super();

    const ENV_TYPE = 'dev';
    const PROJECT_NAME = 'ec2-start-stop';

    const props: CommonProps = {
      envType: ENV_TYPE,
      project: PROJECT_NAME,
    };

    new RootStack(this, prefix(props), props);
  }
}

new RootApp().run();
