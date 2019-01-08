import { App } from '@aws-cdk/cdk';
// import { EC2Stack } from '@ec2';
import { NetworkStack } from '@network';
// import { getResourceName } from '@const';

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

    new NetworkStack(this);
    // const network = new NetworkStack(this);

    // const ec2 = new EC2Stack(this, 'ec2', {
    //   sg: network.sg,
    //   vpc: network.vpc,
    // });

  }
}

new RootApp().run();
