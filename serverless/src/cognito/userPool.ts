import { cloudformation } from '@aws-cdk/aws-cognito';
import { Construct } from '@aws-cdk/cdk';
import { CognitoInput } from '.';

export default (parent: Construct, _props: CognitoInput) => new cloudformation.UserPoolResource(
  parent,
  'UserPoolResource',
  {
    adminCreateUserConfig: {
      // 管理者のみ追加
      allowAdminCreateUserOnly: true,
      // 無効期限10年
      unusedAccountValidityDays: 365,
    },
    policies: {
      // パスワードポリシー
      passwordPolicy: {
        // 数字必要
        requireNumbers: true,
        // 小文字必要
        requireLowercase: true,
        // 記号必要
        requireSymbols: false,
        // 大文字不必要
        requireUppercase: false,
        // 最小文字数：８
        minimumLength: 8,
      },
    },
    // プール名
    userPoolName: `prefix(props)`,
    // ユーザ属性定義
    schema: [
      {
        name: 'email',
        attributeDataType: 'String',
        developerOnlyAttribute: false,
        mutable: true,
        stringAttributeConstraints: {
          maxLength: '200',
          minLength: '0',
        },
        required: true,
      },
    ],
    // 自動認証属性
    autoVerifiedAttributes: [
      'email',
    ],
  });
