import { CommonProps } from '../utils';

export { default as CloudFrontOriginAccessIdentity } from './cloudFrontOriginAccessIdentity';
export { default as Distribution } from './distribution';
export { default as BucketPolicy } from './bucketPolicy';


export interface CloudFrontInput extends CommonProps {
  bucketArn?: string;
  bucketName?: string;
  bucketDomainName?: string;
  bucketRef: string;
}

export interface CloudFrontOutput {
}
