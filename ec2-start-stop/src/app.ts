import { App, Stack, AwsAccountId, AwsRegion, AwsStackId, AwsStackName } from '@aws-cdk/cdk';
import { CommonProps, prefix } from '@utils';
import { EC2_StartStop } from '@lambda';
import jszip = require('jszip');
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { EventRules } from '@cloudwatch';

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

    EventRules(this, lambda);
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

const source2Zip = async () => {
  const zip = new jszip();

  zip.file('index.js', readFileSync(join(__dirname, 'start-stop.js')));

  const value = await zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
  });

  writeFileSync(join(__dirname, 'start-stop.zip'), value);
};

source2Zip().then(() => {
  new RootApp().run();
});
