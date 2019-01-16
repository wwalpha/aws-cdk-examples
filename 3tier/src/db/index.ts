import { VpcNetworkImportProps, SecurityGroupImportProps } from '@aws-cdk/aws-ec2';
import { StackProps } from '@aws-cdk/cdk';

export { default } from './db';

export interface DBStackProps extends StackProps {
  // WEBのセキュリティーグループ
  vpc: VpcNetworkImportProps;
}

export interface DBProps {
  // DB Endpoint
  endpoint: string;
  // DB Security Group
  dbSecurityGroup: SecurityGroupImportProps;
}
