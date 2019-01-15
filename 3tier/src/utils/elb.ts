import { Construct, Tags } from '@aws-cdk/cdk';
import { ApplicationLoadBalancer, ApplicationTargetGroup, TargetType, ApplicationProtocol, CfnTargetGroup } from '@aws-cdk/aws-elasticloadbalancingv2';
import { AutoScalingGroup, CfnLaunchConfiguration } from '@aws-cdk/aws-autoscaling';
import { IVpcNetwork, ISecurityGroup, VpcPlacementStrategy, InstanceTypePair, InstanceClass, InstanceSize, IMachineImageSource } from '@aws-cdk/aws-ec2';
import { getResourceName } from '@const';

export interface ELBProps {
  vpc: IVpcNetwork;
  elbSg: ISecurityGroup;
  asgSg?: ISecurityGroup;
  vpcPlacement: VpcPlacementStrategy;
  internetFacing?: boolean;
  deletionProtection?: boolean;
  port: number;
  elbName: string;
  layerName: string;
  machineImage: IMachineImageSource;
  tags?: Tags;
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

  const atg = new ApplicationTargetGroup(scope, `${props.layerName}-tg`, {
    vpc: props.vpc,
    targetGroupName: `${props.layerName}-tg`,
    targetType: TargetType.Instance,
    protocol: ApplicationProtocol.Http,
    port: props.port,
  });

  const cfnTg = atg.node.findChild('Resource') as CfnTargetGroup;
  cfnTg.addPropertyOverride('Name', getResourceName(`${props.layerName}-tg`));

  // listener:80
  appLB.addListener('listener', {
    open: true,
    port: props.port,
    defaultTargetGroups: [atg],
  });

  const asg = new AutoScalingGroup(scope, props.layerName, {
    vpc: props.vpc,
    vpcPlacement: props.vpcPlacement,
    // i2.micro
    instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Micro),
    // get the latest Amazon Linux image
    machineImage: props.machineImage,
    maxSize: 4,
    minSize: 0,
    desiredCapacity: 2,
    tags: props.tags,
  });

  // Launch Config Name
  const config = asg.node.findChild('LaunchConfig') as CfnLaunchConfiguration;
  config.addPropertyOverride('LaunchConfigurationName', `${getResourceName(props.layerName)}-config`);

  // auto scaling security group
  props.asgSg && asg.addSecurityGroup(props.asgSg);

  asg.attachToApplicationTargetGroup(atg);

  return appLB;
};
