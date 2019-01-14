import { VpcNetworkImportProps, SecurityGroupImportProps } from '@aws-cdk/aws-ec2';

export { default } from './web';
export { default as VpcNetwork } from './vpc';

export interface WebProps {
  // VPC
  vpc: VpcNetworkImportProps;
  // ELBのDNS URL
  dnsName: string;
  // WEBのセキュリティーグループ
  webSg: SecurityGroupImportProps;
}
