import { StackProps } from '@aws-cdk/cdk';

export { default as CloudFrontOriginAccessIdentity } from './cloudFrontOriginAccessIdentity';
export { default as Distribution } from './distribution';
export { default as ResourcePolicy } from './bucketPolicy';

export interface CloudFrontInput extends StackProps {
}

export interface CloudFrontOutput {
}

export { default as NewBucket } from './bucket';
