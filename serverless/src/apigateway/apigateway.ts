import { Construct } from '@aws-cdk/cdk';
import { ApiGatewayInput, ApiGatewayOutput, RestApi } from '.';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { prefix, CommonProps } from '@utils';
import { Schema, Type, safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { SAM, Resource, ApiProperties, FunctionEnvironment } from 'typings/sam';
import { LAMBDA_FILE } from '@const';
import * as API from '@aws-cdk/aws-apigateway';
// import { CommonProps } from 'src/utils';

// import { Construct } from "@aws-cdk/cdk";
// // import { AwsIntegration, AuthorizationType, MethodOptions, cloudformation } from "@aws-cdk/aws-apigateway";
// // import { Role, ServicePrincipal } from "@aws-cdk/aws-iam";
// // import { HttpMethod, bucketName, prefix, } from "@utils";
// // import { s3 } from "@utils/policy";
// import { RestApi, ApiGatewayInput, ApiGatewayOutput } from ".";

export default (parent: Construct, props: ApiGatewayInput): ApiGatewayOutput => {
  const api = RestApi(parent, props);

  const subType = new Type('!Sub', {
    kind: 'scalar',
    resolve: data => (data),
  });

  const config: SAM = safeLoad(readFileSync(LAMBDA_FILE, 'utf-8'), {
    schema: Schema.create([subType]),
  });

  Object.keys(config.Resources).forEach((key) => {
    const resource = config.Resources[key];

    // Lambda Function以外処理しない
    if ('AWS::Serverless::Function' !== resource.Type) return;

    const { Events } = resource.Properties;
    // Event情報なし、対象外
    if (!Events) return;

    const event = Object.keys(Events).find(item => Events[item].Type === 'Api');
    // Api Eventなし
    if (!event) return;

    // Lambda Function作成
    const funcRef = getFunction(parent, props, key, resource);

    // Lambda Function追加
    addMethod(api, Events[event].Properties, new API.LambdaIntegration(funcRef));
  });

  // config.
  // const authorizer = Authorizer(parent, {
  //   restApiId: api.restApiId,
  //   ...props,
  // });

  // const lambda = new Function(parent, 'xxxx', {
  //   code: dummyCode(parent),
  //   handler: 'app.handler',
  //   runtime: Runtime.NodeJS810,
  // });
  // const process = api.root.addResource('process');
  // process.addMethod(
  //   HttpMethod.GET, new LambdaIntegration(lambda, {

  //   }), {
  //     authorizationType: 'COGNITO_USER_POOLS' as AuthorizationType,
  //     apiKeyRequired: false,
  //     authorizerId: authorizer.ref,
  //   });

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
  // new Output(parent, 'RestApi', {
  //   export: `${prefix(props)}-RestApi`,
  //   value: api.restApiId,
  // });

  return { restApi: api };
};

const apis = {} as any;

/** Lambda Function */
const addMethod = (api: API.RestApi, { Method, Path }: ApiProperties, funcRef: API.LambdaIntegration) => {
  const paths = Path.split('/');

  let item: API.IRestApiResource = api.root;

  // Pathごとリソースを作成する
  paths.forEach((path) => {
    if (path === '') return;

    if (apis[path]) {
      item = apis[path].resource;
      return;
    }

    // 存在しないの場合、Rootから作成
    item = item ? item.addResource(path) : api.root.addResource(path);
    apis[path] = {
      resource: item,
    };
  });

  item.addMethod(Method, funcRef);
};

const getFunction = (parent: Construct, props: CommonProps, name: string, { Properties }: Resource) => new Function(parent, name, {
  code: Code.inline('dummy'),
  handler: Properties.Handler,
  runtime: getRuntime(Properties.Runtime),
  functionName: `${prefix(props)}-${getName(Properties.FunctionName)}`,
  timeout: Properties.Timeout,
  memorySize: Properties.MemorySize,
  environment: getEnvironment(props, Properties.Environment),
  description: Properties.Description,
  // deadLetterQueue: Properties.DeadLetterQueue,
});

const getEnvironment = (props: CommonProps, env?: FunctionEnvironment) => {
  if (!env || !env.Variables) return undefined;

  Object.keys(env.Variables).forEach((key) => {
    if (env.Variables[key]) {
      env.Variables[key] = `${prefix(props)}-${getName(env.Variables[key])}`;
    }
  });

  return env.Variables;
};

const getName = (name?: string) => {
  if (!name) return '';

  const splits = name.split('-');

  return name[splits.length - 1];
};
const getRuntime = (runtime: string): Runtime => {
  if (runtime === 'nodejs8.10') return Runtime.NodeJS810;
  if (runtime === 'python3.6') return Runtime.Python36;
  if (runtime === 'python2.7') return Runtime.Python27;
  if (runtime === 'java8') return Runtime.Java8;

  throw new Error('UnSupported Runtime');
};

// // const IAM: MethodOptions = { authorizationType: AuthorizationType.IAM };

// // const uploadRole = (parent: Construct, props: ApiGatewayInput): Role => {
// //   const role = new Role(parent, `${prefix(props)}-UploadMethodRole`, {
// //     assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
// //   });

// //   role.attachInlinePolicy(s3(parent, `UploadMethodPolicy`, bucketName(props)));

// //   return role;
// // }
