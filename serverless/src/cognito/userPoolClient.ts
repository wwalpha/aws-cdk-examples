import { cloudformation } from '@aws-cdk/aws-cognito';
import { Construct } from '@aws-cdk/cdk';

export default (parent: Construct, userPoolId: string) => new cloudformation.UserPoolClientResource(
  parent,
  'UserPoolClient',
  {
    clientName: 'mobile-client',
    generateSecret: false,
    userPoolId,
    // 認証フロー
    explicitAuthFlows: [
      'ADMIN_NO_SRP_AUTH',
    ],
    // Token更新 - 1日
    refreshTokenValidity: 1,
  },
);
