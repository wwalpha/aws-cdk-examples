import { VpcNetworkImportProps, SecurityGroupImportProps } from '@aws-cdk/aws-ec2';
import { StackProps } from '@aws-cdk/cdk';

export { default } from './web';

export interface WebProps {
  // ELBのDNS URL
  dnsName: string;
  // WEBのセキュリティーグループ
  webSg: SecurityGroupImportProps;
}

export interface WebStackProps extends StackProps {
  // VPC
  vpc: VpcNetworkImportProps;
}
