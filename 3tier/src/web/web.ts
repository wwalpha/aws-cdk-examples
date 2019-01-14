import { Stack, App, Output } from '@aws-cdk/cdk';
import { TcpPort, AnyIPv4, VpcNetworkRef, SubnetType } from '@aws-cdk/aws-ec2';
import { getResourceName } from '@const';
import { WebProps, WebStackProps } from '.';
import { SecurityGroup, creatAutoScalingWithELB } from '@utils';

export default class WebStack extends Stack {

  public readonly props: WebProps;

  constructor(parent?: App, name?: string, props?: WebStackProps) {
    super(parent, name, props);
    if (!props) return;

    // VPC
    const vpc = VpcNetworkRef.import(this, 'vpc', props.vpc);
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
        vpcPlacement: {
          subnetsToUse: SubnetType.Public,
        },
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
      dnsName: new Output(this, 'DnsName', {
        export: getResourceName('DNSName'),
        value: alb.dnsName,
      }).makeImportValue(),
      webSg: webSg.export(),
    };
  }
}
