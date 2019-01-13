import { Stack, App, StackProps } from '@aws-cdk/cdk';
import { TcpPort, AnyIPv4 } from '@aws-cdk/aws-ec2';
import { getResourceName } from '@const';
import { WebProps, VpcNetwork } from '.';
import { SecurityGroup, creatAutoScalingWithELB } from '@utils';

export default class WebStack extends Stack {

  public readonly props: WebProps;

  constructor(parent?: App, name?: string, props?: StackProps) {
    super(parent, name, props);

    // VPC作成
    const vpc = VpcNetwork(this);

    // セキュリティグループ作成
    // internet load blancer
    const elbSg = SecurityGroup(this, vpc, getResourceName('internet-sg'));
    elbSg.addIngressRule(new AnyIPv4(), new TcpPort(80));

    // internet LB + AutoScaling
    const alb = creatAutoScalingWithELB(
      this,
      vpc,
      elbSg,
      {
        elbName: getResourceName('internet'),
        asgName: getResourceName('web-asg'),
        ami: 'ami-0ae06ebad9afaa5af',
        port: 80,
        internetFacing: true,
      });

    // web
    const webSg = SecurityGroup(this, vpc, getResourceName('web'));
    webSg.addIngressRule(elbSg, new TcpPort(80));

    this.props = {
      vpc: vpc.export(),
      dnsName: alb.dnsName,
      webSg: webSg.export(),
    };
  }
}
