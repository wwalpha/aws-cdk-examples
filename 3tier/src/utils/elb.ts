import { Construct } from '@aws-cdk/cdk';
import { InstanceTypePair, InstanceClass, InstanceSize, AmazonLinuxImage, VpcPlacementStrategy, IVpcNetwork, ISecurityGroup } from '@aws-cdk/aws-ec2';
import { ApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';

export interface ELBProps {
  vpc: IVpcNetwork;
  elbSg: ISecurityGroup;
  asgSg?: ISecurityGroup;
  vpcPlacement: VpcPlacementStrategy;
  internetFacing?: boolean;
  deletionProtection?: boolean;
  ami: string;
  port: number;
  elbName: string;
  asgName: string;
}

export const creatAutoScalingWithELB = (scope: Construct, props: ELBProps) => {
  // internet load blancer
  const appLB = new ApplicationLoadBalancer(scope, props.elbName, {
    vpc: props.vpc,
    vpcPlacement: props.vpcPlacement,
    internetFacing: props.internetFacing,
    deletionProtection: props.deletionProtection,
    securityGroup: props.elbSg,
    loadBalancerName: props.elbName,
  });

  // lisnter:80
  const listener = appLB.addListener('listener', {
    open: true,
    port: props.port,
  });

  const asg = new AutoScalingGroup(scope, props.asgName, {
    vpc: props.vpc,
    vpcPlacement: props.vpcPlacement,
    // i2.micro
    instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Micro),
    // get the latest Amazon Linux image
    machineImage: new AmazonLinuxImage(),
    maxSize: 4,
    minSize: 0,
    desiredCapacity: 2,
  });

  // auto scaling security group
  props.asgSg && asg.addSecurityGroup(props.asgSg);

  listener.addTargets('fleet', {
    port: props.port,
    targets: [asg],
  });

  return appLB;
};
