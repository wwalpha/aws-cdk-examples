import { CommonProps } from '@utils';
import { IRestApiResource, Resource, RestApi } from '@aws-cdk/aws-apigateway';
export { default as RestApi } from './restapi';
export { default as Authorizer } from './authorizer';

export interface ApiGatewayInput extends CommonProps {
  // userPoolArn: string;
}

export interface ApiGatewayOutput {
  restApi: RestApi;
}

export interface ResourceProps {
  resouce: IRestApiResource;
  pathPart: string;
}

export interface MethodProps {
  resource: Resource;
  method: string;
}
