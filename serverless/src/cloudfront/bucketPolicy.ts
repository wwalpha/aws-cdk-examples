import { Construct } from '@aws-cdk/cdk';
import { cloudformation } from '@aws-cdk/aws-s3';
import { PolicyDocument, PolicyStatement, PolicyStatementEffect } from '@aws-cdk/aws-iam';
import { S3Output } from './s3';

const getPolicyDocument = (bucketArn: string, identity: string): object => {
  const policy = new PolicyDocument();

  const stmt = new PolicyStatement(PolicyStatementEffect.Allow);

  stmt.addAction('s3:GetObject');
  stmt.addResource(`${bucketArn}/*`);
  stmt.addAwsPrincipal(`arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${identity}`);

  policy.addStatement(stmt);

  return policy;
};

export default (parent: Construct, props: S3Output, identity: string) => new cloudformation.BucketPolicyResource(
  parent,
  'BucketPolicyResource',
  {
    bucket: props.bucketRef,
    policyDocument: getPolicyDocument(props.bucketArn as string, identity),
  },
);

// TakumiBucketPolicy:
// Type: AWS::S3::BucketPolicy
// Properties:
//   Bucket: !Ref TakumiBucket
//   PolicyDocument:
//     Statement:
//       - Action: s3:GetObject
//         Effect: Allow
//         Resource: !Sub arn:aws:s3:::${TakumiBucket}/*
//         Principal:
//           AWS: !Sub arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${CloudFrontOriginAccessIdentity}
