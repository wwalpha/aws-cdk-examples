import { VpcNetworkImportProps, SecurityGroupImportProps } from '@aws-cdk/aws-ec2';

export { default } from './network';
export { default as VpcNetwork } from './vpc';

export interface NetworkProps {
  // VPC情報
  vpc: VpcNetworkImportProps;
  webSg: SecurityGroupImportProps;
  appSg: SecurityGroupImportProps;
  dbSg: SecurityGroupImportProps;
}
