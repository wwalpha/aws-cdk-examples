
import { IRestApiResource, Resource, RestApi } from '@aws-cdk/aws-apigateway';
import { StackProps } from '@aws-cdk/cdk';
export { default as Api } from './api';
export { default as Authorizer } from './authorizer';

export interface ApiGatewayInput extends StackProps {
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
