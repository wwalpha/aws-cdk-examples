import { AwsRegion, AwsAccountId, Construct } from '@aws-cdk/cdk';
import { Policy, PolicyStatement, PolicyStatementEffect } from '@aws-cdk/aws-iam';

export const cloudwatch = (parent: Construct, roleName: string) => new Policy(parent, `${roleName}-Basic`, {
  statements: [
    new PolicyStatement(PolicyStatementEffect.Allow)
      .addAction('logs:CreateLogGroup')
      .addAction('logs:CreateLogStream')
      .addAction('logs:PutLogEvents')
      .addResource(`arn:aws:logs:${new AwsRegion()}:*:*`)
  ],
});

export const polly = (parent: Construct, roleName: string) => new Policy(parent, `${roleName}-Polly`, {
  statements: [
    new PolicyStatement(PolicyStatementEffect.Allow)
      .addAction('polly:ListSpeechSynthesisTasks')
      .addAllResources(),
    new PolicyStatement(PolicyStatementEffect.Allow)
      .addAction('polly:SynthesizeSpeech')
      .addResources(
        `arn:aws:polly:${new AwsRegion()}:${new AwsAccountId()}:lexicon/*`
      )
  ],
});

export const rekognition = (parent: Construct, roleName: string) => new Policy(parent, `${roleName}-Rekognition`, {
  statements: [
    new PolicyStatement(PolicyStatementEffect.Allow)
      .addAction('rekognition:DetectText')
      .addAllResources()
  ]
});

export const dynamodb = (parent: Construct, roleName: string) => new Policy(parent, `${roleName}-Dynamodb`, {
  statements: [
    new PolicyStatement(PolicyStatementEffect.Allow)
      .addAction('dynamodb:PutItem')
      .addAction('dynamodb:DeleteItem')
      .addAction('dynamodb:GetItem')
      .addAction('dynamodb:Scan')
      .addAction('dynamodb:Query')
      .addAction('dynamodb:UpdateItem')
      .addAction('dynamodb:DescribeStream')
      .addAction('dynamodb:GetRecords')
      .addAction('dynamodb:GetShardIterator')
      .addAction('dynamodb:ListStreams')
      .addResource(`arn:aws:dynamodb:${new AwsRegion()}:*:table/*`),
    new PolicyStatement(PolicyStatementEffect.Allow)
      .addAction('dynamodb:Scan')
      .addAction('dynamodb:Query')
      .addResource(`arn:aws:dynamodb:${new AwsRegion()}:*:table/*/index/*`),
  ],
});

export const s3 = (parent: Construct, roleName: string, bucketName?: string) => new Policy(parent, `${roleName}-S3`, {
  statements: [
    new PolicyStatement(PolicyStatementEffect.Allow)
      .addAction('s3:HeadBucket')
      .addAction('s3:ListBucket')
      .addResource(`arn:aws:s3:::*`),
    new PolicyStatement(PolicyStatementEffect.Allow)
      .addAction('s3:PutObject')
      .addAction('s3:GetObject')
      .addAction('s3:DeleteObject')
      .addAction('s3:ReplicateObject')
      .addAction('s3:RestoreObject')
      .addResource(`arn:aws:s3:::${bucketName === undefined ? '*' : bucketName}`)
      .addResource(`arn:aws:s3:::${bucketName === undefined ? '*' : bucketName}/*`),
  ],
});
