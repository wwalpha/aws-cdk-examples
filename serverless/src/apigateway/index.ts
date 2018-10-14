import { CommonProps } from "../utils";
import { IRestApiResource, Resource } from "@aws-cdk/aws-apigateway";
import { LambdaOutput } from "../lambda";
export { default as RestApi } from './restapi';
// export { default as Resource } from './resource';
// export { default as Method } from './method';

export interface ApiGatewayInput extends CommonProps {
  lambda: LambdaOutput,
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
