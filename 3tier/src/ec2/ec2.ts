import { Stack, App, Construct } from '@aws-cdk/cdk';
import { NetworkProps, ELBProps } from '@ec2';
import { ApplicationLoadBalancer, ApplicationLoadBalancerRefProps } from '@aws-cdk/aws-elasticloadbalancingv2';
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import { VpcNetworkRef, SecurityGroupRef, InstanceTypePair, InstanceClass, InstanceSize, AmazonLinuxImage, IMachineImageSource } from '@aws-cdk/aws-ec2';

export default class EC2Stack extends Stack {

  public readonly elbProps: ApplicationLoadBalancerRefProps;

  constructor(parent?: App, name?: string, props?: NetworkProps) {
    super(parent, name, props);

    if (!props) return;

    const vpc = VpcNetworkRef.import(this, 'vpc', props.vpc);
    const internetSg = SecurityGroupRef.import(this, 'internet-sg', props.sg.internet);

    // internet LB + AutoScaling
    const internetLB = creatAutoScalingWithELB(
      this,
      vpc,
      internetSg,
      {
        port: 80,
        deletionProtection: true,
        internetFacing: true,
      });

    // internal LB + AutoScaling
    creatAutoScalingWithELB(
      this,
      vpc,
      internetSg,
      {
        port: 8080,
        deletionProtection: true,
        internetFacing: true,
      });

    this.elbProps = internetLB.export();
  }
}

const creatAutoScalingWithELB = (parent: Construct, vpc: VpcNetworkRef, sg: SecurityGroupRef, elbProps: ELBProps) => {
  // internet load blancer
  const appLB = new ApplicationLoadBalancer(parent, `LB-${sg.id}`, {
    vpc,
    internetFacing: elbProps.internetFacing,
    deletionProtection: elbProps.deletionProtection,
    securityGroup: sg,
  });

  // lisnter:80
  const internetLS = appLB.addListener('internet-listener', {
    open: true,
    port: elbProps.port,
    // defaultTargetGroups
  });

  const asg = new AutoScalingGroup(parent, 'asg', {
    vpc,
    // i2.micro
    instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Micro),
    // get the latest Amazon Linux image
    machineImage: new AmazonLinuxImage({

    }),
    maxSize: 4,
    minSize: 0,
    desiredCapacity: 2,
  });

  internetLS.addTargets('fleet', {
    port: elbProps.port,
    targets: [asg],
  });

  return appLB;
};
