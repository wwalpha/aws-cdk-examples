import { Stack, App } from '@aws-cdk/cdk';
import { TcpPort, VpcNetwork, SecurityGroup } from '@aws-cdk/aws-ec2';
import { getResourceName } from '@const';
import { createSecurityGroup, creatAutoScalingWithELB } from '@utils';
import { AppStackProps, AppProps } from '@app';

export default class AppStack extends Stack {

  public readonly outputs: AppProps;

  constructor(parent?: App, name?: string, props?: AppStackProps) {
    super(parent, name, props);

    if (!props) return;

    // VPC作成
    const vpc = VpcNetwork.import(this, 'vpc', props.vpc);
    const webSg = SecurityGroup.import(this, 'webSg', props.webSg);

    // intenal load blancer
    const internalSg = createSecurityGroup(this, vpc, getResourceName('internal-sg'));
    internalSg.addIngressRule(webSg, new TcpPort(8080));

    // internal LB + AutoScaling
    creatAutoScalingWithELB(
      this,
      vpc,
      internalSg,
      {
        vpcPlacement: {
          subnetName: 'app',
        },
        elbName: getResourceName('internal'),
        asgName: getResourceName('app-asg'),
        ami: 'ami-0392d5a72b96eb147',
        port: 8080,
        internetFacing: false,
      });

    // application
    const appSg = createSecurityGroup(this, vpc, getResourceName('app'));
    appSg.addIngressRule(internalSg, new TcpPort(8080));

    this.outputs = {
      appSg: appSg.export(),
    };
  }
}
