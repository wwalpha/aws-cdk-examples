import { Construct } from '@aws-cdk/cdk';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { cloudwatch } from '../policy';
import { RoleProps } from '.';

/** Lambda基本ロール */
export default (parent: Construct, props: RoleProps): Role => {
  const role = new Role(parent, `${props.roleName}`, {
    roleName: `prefix(props)-Lambda-${props.roleName}`,
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
  });

  role.attachInlinePolicy(cloudwatch(parent, props.roleName));

  return role;
};
