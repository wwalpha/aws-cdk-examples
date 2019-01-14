import { VpcNetworkImportProps, SecurityGroupImportProps, IVpcNetwork, ISecurityGroup } from '@aws-cdk/aws-ec2';
import { StackProps } from '@aws-cdk/cdk';

export { default } from './autoscaling';

export interface AutoScalingProps {
  // ELBのDNS URL
  dnsName: string;
}

export interface AutoScalingStackProps extends StackProps {
  // VPC
  vpc: VpcNetworkImportProps;
  // DB Endpoint
  dbEndpoint: string;
  // Web層Security Group
  webSg: SecurityGroupImportProps;
  // App層Security Group
  appSg: SecurityGroupImportProps;
}

export interface WebScalingProps {
  // VPC
  vpc: IVpcNetwork;
  // Web層Security Group
  webSg?: ISecurityGroup;
  // App層Security Group
  appSg?: ISecurityGroup;
}
