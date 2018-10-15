import { CommonProps } from '../../utils';

export { default as NewBucket } from './bucket';


export interface S3Input extends CommonProps {
}

export interface S3Output {
  bucketArn: string;
  bucketName: string;
  bucketDomainName: string;
  bucketRef: string;
}

export interface S3EventInput extends CommonProps {
  s3: S3Output,
}

export interface S3EventOutput {
}
