export interface CloudFrontResource {

}

export interface Distributions {
  DefaultRootObject: string;
  Resources: Resources[];
}

export interface Resources {
  [key: string]: Resource;
}

export type ResourceType = "S3" | "Api";

export interface Resource {
  Type: ResourceType;
  Properties: Properties;
}

export type ViewerProtocolPolicy = "allow-all" | "redirect-to-https" | "https-only";

export interface Properties {
  OriginPath?: string;
  AllowedMethods?: string[];
  ForwardedValues?: ForwardedValues;
  ViewerProtocolPolicy?: ViewerProtocolPolicy;
  PathPattern: string;
}

export interface ForwardedValues {
  QueryString?: boolean;
  Cookies?: Cookies;
  Headers?: string[];
}

export interface Cookies {
  Forward?: string;
}