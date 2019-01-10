import { App } from '@aws-cdk/cdk';
// import { EC2Stack } from '@ec2';
import { NetworkStack } from '@network';
import { getResourceName } from '@const';
import { EC2Stack } from '@ec2';
import CloudFrontStack from './cloudfront/cloudfront';
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

    const network = new NetworkStack(this, getResourceName('Network'));

    const ec2 = new EC2Stack(this, getResourceName('EC2'), {
      sg: network.sg,
      vpc: network.vpc,
    });

    new CloudFrontStack(this, getResourceName('CDN'), {
      albRefProps: ec2.albRefProps,
    });
  }
}

new RootApp().run();
