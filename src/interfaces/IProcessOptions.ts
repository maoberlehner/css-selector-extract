import { ISelectorFilter } from './ISelectorFilter';

export interface IProcessOptions {
  css: string;
  filters: ISelectorFilter[]|string[];
  postcssSyntax?: any;
}