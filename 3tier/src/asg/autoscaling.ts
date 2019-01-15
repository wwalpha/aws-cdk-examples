import { Stack, App, Construct } from '@aws-cdk/cdk';
import { TcpPort, VpcNetwork, SecurityGroup, AnyIPv4, SubnetType, GenericLinuxImage, AmazonLinuxImage } from '@aws-cdk/aws-ec2';
import { getResourceName } from '@const';
import { createSecurityGroup, creatAutoScalingWithELB } from '@utils';
import { AutoScalingProps, AutoScalingStackProps, WebScalingProps } from '@asg';

export default class AutoScalingStack extends Stack {

  public readonly outputs: AutoScalingProps;

  constructor(parent?: App, name?: string, props?: AutoScalingStackProps) {
    super(parent, name, props);

    if (!props) return;

    // VPC作成
    const vpc = VpcNetwork.import(this, 'vpc', props.vpc);
    const webSg = SecurityGroup.import(this, 'webSg', props.webSg);
    const appSg = SecurityGroup.import(this, 'appSg', props.appSg);

    // APP層のScaling
    webScaling(this, {
      appSg,
      webSg,
      vpc,
    });

    // APP層のScaling
    appScaling(this, {
      appSg,
      webSg,
      vpc,
    });
  }
}

const webScaling = (parent: Construct, props: WebScalingProps) => {
  const elbSg = createSecurityGroup(parent, props.vpc, getResourceName('internet-sg'));
  elbSg.addIngressRule(new AnyIPv4(), new TcpPort(80));

  // internet LB + AutoScaling
  const alb = creatAutoScalingWithELB(
    parent,
    {
      vpc: props.vpc,
      elbSg,
      asgSg: props.webSg,
      vpcPlacement: {
        subnetsToUse: SubnetType.Public,
      },
      elbName: getResourceName('internet'),
      layerName: 'web',
      machineImage: new GenericLinuxImage({
        'ap-northeast-1': 'ami-0213c957664c78fac',
      }),
      port: 80,
      internetFacing: true,
    });

  // web
  props.webSg && props.webSg.addIngressRule(elbSg, new TcpPort(80));

  return alb;
};

const appScaling = (parent: Construct, props: WebScalingProps) => {
  // intenal load blancer
  const elbSg = createSecurityGroup(parent, props.vpc, getResourceName('internal-sg'));
  props.webSg && elbSg.addIngressRule(props.webSg, new TcpPort(8080));

  // internal LB + AutoScaling
  const alb = creatAutoScalingWithELB(
    parent,
    {
      vpc: props.vpc,
      elbSg,
      asgSg: props.appSg,
      vpcPlacement: {
        subnetName: 'app',
      },
      elbName: getResourceName('internal'),
      layerName: 'app',
      machineImage: new AmazonLinuxImage(),
      port: 8080,
      internetFacing: false,
    });

  // application
  props.appSg && props.appSg.addIngressRule(elbSg, new TcpPort(8080));

  return alb;
};
