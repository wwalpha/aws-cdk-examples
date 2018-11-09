import { App } from '@aws-cdk/cdk';
import { EC2Stack } from '@ec2';
import { getResourceName } from '@const';

// class RootStack extends Stack {

//   constructor(parent: App, name: string, props: StackProps) {
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

//   }
// }

class RootApp extends App {
  constructor() {
    super();

    new EC2Stack(this, getResourceName('EC2'));
  }
}

new RootApp().run();
