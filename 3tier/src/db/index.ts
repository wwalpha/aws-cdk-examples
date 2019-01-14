import { VpcNetworkImportProps, SecurityGroupImportProps } from '@aws-cdk/aws-ec2';
import { StackProps } from '@aws-cdk/cdk';

export { default } from './db';

export interface DBStackProps extends StackProps {
  // WEBのセキュリティーグループ
  vpc: VpcNetworkImportProps;
  // Appのセキュリティーグループ
  appSg: SecurityGroupImportProps;
  // DBのセキュリティーグループ
  dbSg: SecurityGroupImportProps;
}

export interface DBProps {
  // DB Endpoint
  endpoint: string;
}
