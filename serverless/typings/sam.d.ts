
export interface SAM {
  Parameters: any
  Resources: Resources
}

export interface Resources {
  [key: string]: Resource;
}

export interface Resource {
  Type: string;
  DeletionPolicy?: string;
  Properties: Function;
}

export interface Function {
  // Function within your code that is called to begin execution.
  Handler: string;
  // Required. The runtime environment.
  Runtime: string;
  // Either CodeUri or InlineCode must be specified. 
  // S3 Uri or location to the function code. 
  // The S3 object this Uri references MUST be a Lambda deployment package.
  CodeUri?: string | S3Location;
  // Either CodeUri or InlineCode must be specified. 
  // The inline code for the lambda.
  InlineCode?: string;
  // A name for the function. If you don't specify a name, a unique name will be generated for you.
  FunctionName?: string;
  // Description of the function.
  Description?: string;
  // Size of the memory allocated per invocation of the function in MB. 
  // Defaults to 128.
  MemorySize?: number;
  // Maximum time that the function can run before it is killed in seconds. 
  // Defaults to 3.
  Timeout?: number;
  // ARN of an IAM role to use as this function's execution role.
  // If omitted, a default role is created for this function.
  Role?: string;
  // Names of AWS managed IAM policies or IAM policy documents or SAM Policy Templates that this function needs, 
  // which should be appended to the default role for this function. 
  // If the Role property is set, this property has no meaning.
  Policies?: string | string[] | IAMPolicy | IAMPolicy[] | SAMPolicy[];
  // Configuration for the runtime environment.
  Environment?: FunctionEnvironment;
  // Configuration to enable this function to access private resources within your VPC.
  VpcConfig?: VPCConfig;
  // A map (string to Event source object) that defines the events that trigger this function. 
  // Keys are limited to alphanumeric characters.
  Events?: Event;
  // A map (string to string) that specifies the tags to be added to this function.
  // Keys and values are limited to alphanumeric characters. 
  // Keys can be 1 to 127 Unicode characters in length and cannot be prefixed with aws:. Values can be 1 to 255 Unicode characters in length. 7
  // When the stack is created, SAM will automatically add a lambda:createdBy:SAM tag to this Lambda function.
  Tags?: Map;
  // String that specifies the function's X-Ray tracing mode. Accepted values are Active and PassThrough
  Tracing?: string;
  // The Amazon Resource Name (ARN) of an AWS Key Management Service (AWS KMS) key that Lambda uses to encrypt and decrypt your function's environment variables.
  KmsKeyArn?: string;
  // Configures SNS topic or SQS queue where Lambda sends events that it can't process.
  DeadLetterQueue?: Map | DeadLetterQueue;
  // Settings to enable Safe Lambda Deployments. Read the usage guide for detailed information.
  DeploymentPreference?: DeploymentPreference;
  // Name of the Alias. Read AutoPublishAlias Guide for how it works
  AutoPublishAlias?: string;
  // The maximum of concurrent executions you want to reserve for the function
  ReservedConcurrentExecutions?: number;
}

export interface IAMPolicy {

}

export interface SAMPolicy {

}

/**
 * The object describing the environment properties of a function.
 */
export interface FunctionEnvironment {
  Variables: {
    [key: string]: string;
  }
}

export interface Event {
  [key: string]: EventSource
}

export interface EventSource {
  Type: string;
  Properties: ApiProperties;
}

export interface ApiProperties {
  Path: string;
  Method: string;
}

export interface Map {
  [key: string]: string;
}

/**
 * Specifies the configurations to enable Safe Lambda Deployments
 */
export interface DeploymentPreference {
  Enabled: boolean;
  Type: string;
  Alarms: string[];
  Hooks: {
    PreTraffic: string;
    PostTraffic: string;
  }
}

/**
 * Specifies an SQS queue or SNS topic that AWS Lambda (Lambda) sends events to when it can't process them.
 */
export interface DeadLetterQueue {
  // SQS or SNS
  Type: string;
  // ARN of the SQS queue or SNS topic to use as DLQ.
  TargetArn: string;
}

/**
 * Specifies the location of an S3 object as a dictionary containing Bucket, Key, and optional Version properties.
 */
export interface S3Location {
  Bucket: string;
  Key: string;
  Version?: string;
}

export interface VPCConfig {
  SecurityGroupIds: string;
  SubnetIds: string;
}
