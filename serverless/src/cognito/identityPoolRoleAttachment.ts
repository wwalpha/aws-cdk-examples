import { cloudformation } from '@aws-cdk/aws-cognito';
import { Construct } from '@aws-cdk/cdk';

export interface RoleAttachmentProps {
  identityPoolId: string;
  unauthenticated: string;
  authenticated: string;
}

export default (parent: Construct, props: RoleAttachmentProps) => new cloudformation.IdentityPoolRoleAttachmentResource(
  parent,
  'IdentityPoolRoleAttachmentResource',
  {
    identityPoolId: props.identityPoolId,
    roles: {
      unauthenticated: props.unauthenticated,
      authenticated: props.authenticated,
    },
  },
);
