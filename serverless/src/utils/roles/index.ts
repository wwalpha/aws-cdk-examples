import { CommonProps } from '..';

export interface RoleProps extends CommonProps {
  roleName: string;
}

export { default as LambdaRole } from './lambda';
export {
  unauthenticatedRole as UnauthenticatedRole,
  authenticatedRole as AuthenticatedRole,
} from './cognito';

export {
  dynamodbDataSourceRole as DynamodbDataSourceRole,
  lambdaDataSourceRole as LambdaDataSourceRole,
} from './appsync';