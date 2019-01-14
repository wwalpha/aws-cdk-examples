import { Construct } from '@aws-cdk/cdk';
import { InstanceTypePair, InstanceClass, InstanceSize, AmazonLinuxImage, VpcPlacementStrategy, IVpcNetwork, ISecurityGroup } from '@aws-cdk/aws-ec2';
import { ApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';

export interface ELBProps {
  vpcPlacement: VpcPlacementStrategy;
  internetFacing?: boolean;
  deletionProtection?: boolean;
  ami: string;
  port: number;
  elbName: string;
  asgName: string;
}

export const creatAutoScalingWithELB = (parent: Construct, vpc: IVpcNetwork, sg: ISecurityGroup, elbProps: ELBProps) => {
  // internet load blancer
  const appLB = new ApplicationLoadBalancer(parent, elbProps.elbName, {
    vpc,
    vpcPlacement: elbProps.vpcPlacement,
    internetFacing: elbProps.internetFacing,
    deletionProtection: elbProps.deletionProtection,
    securityGroup: sg,
    loadBalancerName: elbProps.elbName,
  });

  // lisnter:80
  const listener = appLB.addListener('listener', {
    open: true,
    port: elbProps.port,
  });

  const asg = new AutoScalingGroup(parent, elbProps.asgName, {
    vpc,
    vpcPlacement: elbProps.vpcPlacement,
    // i2.micro
    instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Micro),
    // get the latest Amazon Linux image
    machineImage: new AmazonLinuxImage(),
    maxSize: 4,
    minSize: 0,
    desiredCapacity: 2,
  });

  listener.addTargets('fleet', {
    port: elbProps.port,
    targets: [asg],
  });

  return appLB;
};
