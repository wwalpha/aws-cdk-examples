import { CommonProps } from "../utils";
import { IRestApiResource, Resource } from "@aws-cdk/aws-apigateway";
export { default as RestApi } from './restapi';
export { default as Authorizer } from './authorizer';
// export { default as Method } from './method';

export interface ApiGatewayInput extends CommonProps {
  userPoolArn: string,
}

export interface ApiGatewayOutput {
}

export interface ResourceProps {
  resouce: IRestApiResource
  pathPart: string
}

export interface MethodProps {
  resource: Resource
  method: string
}
