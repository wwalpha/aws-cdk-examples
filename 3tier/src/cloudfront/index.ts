import { StackProps, FnImportValue } from '@aws-cdk/cdk';

export { default as CloudFrontStack } from './cloudfront';
export { default as S3 } from './s3';

export interface CfProps extends StackProps {
  dnsName: FnImportValue;
}
