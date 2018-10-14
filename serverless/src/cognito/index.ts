import { CommonProps } from '../utils';
import { LambdaOutput } from '../lambda';
import { S3Output } from '../s3';

export { default as UserPool } from './userPool';
export { default as UserPoolClient } from './userPoolClient';
export { default as IdentityPool } from './identityPool';
export { default as IdentityPoolRoleAttachment } from './identityPoolRoleAttachment';


export interface CognitoInput extends CommonProps {
  lambda: LambdaOutput,
  s3: S3Output,
}

export interface CognitoOutput {
  userPoolId: string;
  userPoolClientId: string;
  identityPoolId: string;
}
