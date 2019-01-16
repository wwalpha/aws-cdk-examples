import { Construct, Tags } from '@aws-cdk/cdk';
import { ApplicationLoadBalancer, ApplicationTargetGroup, TargetType, ApplicationProtocol, CfnTargetGroup } from '@aws-cdk/aws-elasticloadbalancingv2';
import { AutoScalingGroup, CfnLaunchConfiguration } from '@aws-cdk/aws-autoscaling';
import { IVpcNetwork, VpcPlacementStrategy, InstanceTypePair, InstanceClass, InstanceSize, IMachineImageSource, CfnSecurityGroup } from '@aws-cdk/aws-ec2';
import { getResourceName } from '@const';
import { createSecurityGroup } from '@utils';

export interface ELBProps {
  vpc: IVpcNetwork;
  vpcPlacement: VpcPlacementStrategy;
  internetFacing?: boolean;
  deletionProtection?: boolean;
  port: number;
  name: string;
  layerName: string;
}

export interface ELBRetProps {
  loadBalancer: ApplicationLoadBalancer;
  targetGroup: ApplicationTargetGroup;
}

export interface ASGProps {
  vpc: IVpcNetwork;
  vpcPlacement: VpcPlacementStrategy;
  layerName: string;
  machineImage: IMachineImageSource;
  tags?: Tags;
}

/**
 * Application Load Blancer作成
 *
 * @param scope
 * @param props
 */
export const createELB = (scope: Construct, props: ELBProps): ELBRetProps => {
  // application load blancer
  const appLB = new ApplicationLoadBalancer(scope, props.name, {
    vpc: props.vpc,
    vpcPlacement: props.vpcPlacement,
    internetFacing: props.internetFacing,
    deletionProtection: props.deletionProtection,
    loadBalancerName: props.name,
    securityGroup: createSecurityGroup(scope, props.vpc, `${props.layerName}-sg`),
  });

  const atgName = `${props.layerName}-tg`;
  const atg = new ApplicationTargetGroup(scope, atgName, {
    vpc: props.vpc,
    targetGroupName: atgName,
    targetType: TargetType.Instance,
    protocol: ApplicationProtocol.Http,
    port: props.port,
  });

  const cfnTg = atg.node.findChild('Resource') as CfnTargetGroup;
  cfnTg.addPropertyOverride('Name', getResourceName(atgName));

  // listener:80
  appLB.addListener('listener', {
    open: true,
    port: props.port,
    defaultTargetGroups: [atg],
  });

  return {
    loadBalancer: appLB,
    targetGroup: atg,
  };
};

/**
 * Auto Scaling Groupを作成
 * @param scope
 * @param props
 */
export const creatAutoScaling = (scope: Construct, props: ASGProps) => {
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
  config.propertyOverrides.securityGroups = [createSecurityGroup(scope, props.vpc, 'app-asg-sg').securityGroupId];
  config.propertyOverrides.launchConfigurationName = `${getResourceName(props.layerName)}-config`;

  return asg;
};
