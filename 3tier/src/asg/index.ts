import { VpcNetwork, VpcNetworkImportProps, SecurityGroupImportProps } from '@aws-cdk/aws-ec2';
import { StackProps } from '@aws-cdk/cdk';
import { ApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';

export { default } from './autoscaling';

export interface AutoScalingProps {
  // ELBのDNS URL
  dnsName: string;
}

export interface AutoScalingStackProps extends StackProps {
  // VPC
  vpc: VpcNetworkImportProps;
  dbSecurityGroup: SecurityGroupImportProps;
  // DB Endpoint
  dbEndpoint: string;
}

export interface WebScalingProps {
  // VPC
  vpc: VpcNetwork;
}

export interface ScalingGroupProps {
  loadBalancer: ApplicationLoadBalancer;
  autoScalingGroup: AutoScalingGroup;
}
