import { cloudformation } from '@aws-cdk/aws-cognito';
import { Construct } from '@aws-cdk/cdk';
import { CognitoInput } from '.';
import { prefix } from '../utils/consts';

export default (parent: Construct, props: CognitoInput) => new cloudformation.UserPoolResource(
  parent,
  'UserPool',
  {
    adminCreateUserConfig: {
      // 管理者のみ追加
      allowAdminCreateUserOnly: true,
      // 無効期限10年
      unusedAccountValidityDays: 365,
      inviteMessageTemplate: {
        // 招待メールタイトル
        emailSubject: 'ユーザーID登録完了のお知らせ',
        // 招待メール本文
        emailMessage: `
          <br />
          このメールはシステムにより自動配信されました。
          <br />
          システムにログインできることをご確認ください。
          ユーザID：{username}
          パスワード：{####}
          <br />
          【照会先】システム管理担当者  xxxxxxx@xxx.co.jp
          ※このメールアドレスは送信専用です。返信できませんので、ご注意ください。
        `,
      }
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
    userPoolName: prefix(props),
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
    emailVerificationSubject: 'パスワード変更認証コードのお知らせ',
    emailVerificationMessage: `
      <br />
      このメールはシステムにより自動配信されました。
      <br />
      パスワード変更に必要な認証コードが発行されました。
      認証コードは{####}です。
      <br />
      【照会先】システム管理担当者  xxxxxxx@xxx.co.jp
      ※このメールアドレスは送信専用です。返信できませんので、ご注意ください。
    `,
  });
