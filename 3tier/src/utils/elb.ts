import { Construct } from '@aws-cdk/cdk';
import { VpcNetworkRef, InstanceTypePair, InstanceClass, SecurityGroupRef, InstanceSize, GenericLinuxImage } from '@aws-cdk/aws-ec2';
import { ApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';

export interface ELBProps {
  internetFacing?: boolean;
  deletionProtection?: boolean;
  ami: string;
  port: number;
  elbName: string;
  asgName: string;
}

export const creatAutoScalingWithELB = (parent: Construct, vpc: VpcNetworkRef, sg: SecurityGroupRef, elbProps: ELBProps) => {
  // internet load blancer
  const appLB = new ApplicationLoadBalancer(parent, elbProps.elbName, {
    vpc,
    internetFacing: elbProps.internetFacing,
    deletionProtection: elbProps.deletionProtection,
    securityGroup: sg,
    loadBalancerName: elbProps.elbName,
  });

  // lisnter:80
  const internetLS = appLB.addListener('listener', {
    open: true,
    port: elbProps.port,
    // defaultTargetGroups
  });

  const asg = new AutoScalingGroup(parent, elbProps.asgName, {
    vpc,
    // i2.micro
    instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Micro),
    // get the latest Amazon Linux image
    machineImage: new GenericLinuxImage({
      'ap-northeast-1': elbProps.ami,
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
