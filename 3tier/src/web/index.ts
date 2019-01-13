import { VpcNetworkRefProps, SecurityGroupRefProps } from '@aws-cdk/aws-ec2';

export { default } from './web';
export { default as VpcNetwork } from './vpc';

export interface WebProps {
  // VPC情報
  vpc: VpcNetworkRefProps;
  // ELBのDNS URL
  dnsName: string;
  // WEBのセキュリティーグループ
  webSg: SecurityGroupRefProps;
}
