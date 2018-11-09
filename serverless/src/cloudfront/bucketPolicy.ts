import { PolicyStatement, PolicyStatementEffect } from '@aws-cdk/aws-iam';

export default (bucketArn: string, identityRef: string): PolicyStatement => {
  const stmt = new PolicyStatement(PolicyStatementEffect.Allow);

  stmt.addAction('s3:GetObject');
  stmt.addResource(`${bucketArn}/*`);
  stmt.addAwsPrincipal(`arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${identityRef}`);

  return stmt;
};
