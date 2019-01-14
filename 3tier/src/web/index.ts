import { SecurityGroupRefProps, VpcNetworkRefProps } from '@aws-cdk/aws-ec2';
import { StackProps, FnImportValue } from '@aws-cdk/cdk';

export { default } from './web';

export interface WebProps {
  // ELBのDNS URL
  dnsName: FnImportValue;
  // WEBのセキュリティーグループ
  webSg: SecurityGroupRefProps;
}

export interface WebStackProps extends StackProps {
  // VPC
  vpc: VpcNetworkRefProps;
}
