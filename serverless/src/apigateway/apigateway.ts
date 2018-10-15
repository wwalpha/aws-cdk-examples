import { Construct } from "@aws-cdk/cdk";
import { ApiGatewayInput, ApiGatewayOutput, RestApi, Authorizer } from ".";
import { HttpMethod } from "../utils/consts";
import { LambdaIntegration, AuthorizationType } from "@aws-cdk/aws-apigateway";
import { Function, Code, Runtime } from "@aws-cdk/aws-lambda";
import { BucketRef } from "@aws-cdk/aws-s3";

// import { Construct } from "@aws-cdk/cdk";
// // import { AwsIntegration, AuthorizationType, MethodOptions, cloudformation } from "@aws-cdk/aws-apigateway";
// // import { Role, ServicePrincipal } from "@aws-cdk/aws-iam";
// // import { HttpMethod, bucketName, prefix, } from "../utils/consts";
// // import { s3 } from "../utils/policy";
// import { RestApi, ApiGatewayInput, ApiGatewayOutput } from ".";

export const dummyCode = (parent: Construct) => Code.bucket(BucketRef.import(parent, 'Bucket',
  {
    bucketArn: 'arn:aws:s3:::deployment-projects',
  }),
  `test/dummy.zip`
);


export default (parent: Construct, props: ApiGatewayInput): ApiGatewayOutput => {
  const api = RestApi(parent, props);

  const authorizer = Authorizer(parent, {
    restApiId: api.restApiId,
    ...props,
  });

  const lambda = new Function(parent, 'xxxx', {
    code: dummyCode(parent),
    handler: 'app.handler',
    runtime: Runtime.NodeJS810,
  });
  const process = api.root.addResource('process');
  process.addMethod(
    HttpMethod.GET, new LambdaIntegration(lambda, {

    }), {
      authorizationType: "COGNITO_USER_POOLS" as AuthorizationType,
      apiKeyRequired: false,
      authorizerId: authorizer.ref,
    });


  // upload.addMethod(HttpMethod.POST, new LambdaIntegration(functionRef(parent, props.lambda['ImageToWord'])), {
  //   authorizationType: AuthorizationType.IAM,
  // });

  // upload.addMethod(HttpMethod.PUT, new AwsIntegration({
  //   service: 's3',
  //   path: '{bucket}/users/{userId}/{item}',
  //   options: {
  //     credentialsRole: uploadRole(parent, props),
  //     requestParameters: {
  //       'integration.request.header.bucket': "'test'"
  //     },
  //     integrationResponses: [{
  //       statusCode: '200',
  //     }],
  //   }
  // }), IAM);

  return {}
}

// // const IAM: MethodOptions = { authorizationType: AuthorizationType.IAM };

// // const uploadRole = (parent: Construct, props: ApiGatewayInput): Role => {
// //   const role = new Role(parent, `${prefix(props)}-UploadMethodRole`, {
// //     assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
// //   });

// //   role.attachInlinePolicy(s3(parent, `UploadMethodPolicy`, bucketName(props)));

// //   return role;
// // }
