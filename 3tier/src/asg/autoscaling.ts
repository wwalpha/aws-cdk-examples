import { Stack, App, Construct } from '@aws-cdk/cdk';
import { AutoScalingProps, AutoScalingStackProps, ScalingGroupProps } from '@asg';
import { VpcNetwork, AmazonLinuxImage, TcpPort, SecurityGroup, IVpcNetwork } from '@aws-cdk/aws-ec2';
import { createELB, creatAutoScaling as createAutoScaling } from '@utils';
import { getResourceName } from '@const';

export default class AutoScalingStack extends Stack {

  public readonly outputs: AutoScalingProps;

  constructor(parent?: App, name?: string, props?: AutoScalingStackProps) {
    super(parent, name, props);

    if (!props) return;

    // VPC作成
    const vpc = VpcNetwork.import(this, 'vpc', props.vpc);
    const dbSg = SecurityGroup.import(this, 'webSg', props.dbSecurityGroup);

    // APP層のScaling
    const webAsg = webScaling(this, vpc);
    webAsg.loadBalancer.connections.allowFromAnyIPv4(new TcpPort(80));

    // APP層のScaling
    const appAsg = appScaling(this, vpc);
    appAsg.loadBalancer.connections.allowFrom(webAsg.autoScalingGroup.connections, new TcpPort(8080));

    // DB層Route
    appAsg.autoScalingGroup.connections.allowTo(dbSg.connections, new TcpPort(5432));
  }
}

const webScaling = (scope: Construct, vpc: IVpcNetwork): ScalingGroupProps => {
  // internet LB + AutoScaling
  const alb = createELB(scope, {
    vpc,
    vpcPlacement: {
      subnetName: 'web',
    },
    layerName: 'web',
    port: 80,
    internetFacing: true,
    name: getResourceName('internet'),
  });

  const asg = createAutoScaling(scope, {
    vpc,
    vpcPlacement: {
      subnetName: 'web',
    },
    layerName: 'web',
    machineImage: new AmazonLinuxImage(),
  });

  asg.attachToApplicationTargetGroup(alb.targetGroup);
  asg.connections.allowFrom(alb.loadBalancer.connections, new TcpPort(80));

  return {
    loadBalancer: alb.loadBalancer,
    autoScalingGroup: asg,
  };
};

const appScaling = (scope: Construct, vpc: IVpcNetwork): ScalingGroupProps => {
  const asg = createAutoScaling(scope, {
    vpc,
    vpcPlacement: {
      subnetName: 'app',
    },
    layerName: 'app',
    machineImage: new AmazonLinuxImage(),
  });

  // internal LB + AutoScaling
  const alb = createELB(scope, {
    vpc,
    vpcPlacement: {
      subnetName: 'app',
    },
    layerName: 'app',
    port: 8080,
    internetFacing: false,
    name: getResourceName('internal'),
  });

  asg.attachToApplicationTargetGroup(alb.targetGroup);
  asg.connections.allowFrom(alb.loadBalancer.connections, new TcpPort(8080));

  return {
    loadBalancer: alb.loadBalancer,
    autoScalingGroup: asg,
  };
  // const userData: string[] = [];
  // userData.push('#!/bin/bash');
  // userData.push('yum update - y');
  // userData.push('yum install -y java-1.8.0-openjdk-devel tomcat8 tomcat8-webapps');
  // userData.push('yum install -y git');
  // userData.push('alternatives --update java /usr/lib/jvm/jre-1.8.0-openjdk.x86_64/bin/java');
  // userData.push('curl -s http://get.sdkman.io | bash');

  // asg.addUserData(userData.join(','));
};
