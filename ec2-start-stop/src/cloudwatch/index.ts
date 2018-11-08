export { default as EventRules } from './cloudwatch';

export interface Rules {
  Start?: Rule;
  Stop?: Rule;
}

export interface Rule {
  Name: string;
  Schedule: string;
  Description?: string;
  Targets?: string[];
}
