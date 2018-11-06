import { Construct } from '@aws-cdk/cdk';
import { cloudformation } from '@aws-cdk/aws-apigateway';
import { prefix, CommonProps } from '@utils';

export default (parent: Construct, props: Authorizer) => new cloudformation.AuthorizerResource(
  parent,
  'AuthorizerResource',
  {
    name: `${prefix(props)}-Authorizer`,
    restApiId: props.restApiId,
    type: 'COGNITO_USER_POOLS',
    // authorizerName: `${prefix(props)}-Authorizer`,
    identitySource: 'method.request.header.Authorization',
    providerArns: [
      props.userPoolArn,
    ],
  },
);

export interface Authorizer extends CommonProps {
  restApiId: string;
  userPoolArn: string;
}
