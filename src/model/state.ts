import { ILocalizedStrings } from '../localization/model';

export interface IState {
  loaded: boolean;
  lang: string;
  strings: ILocalizedStrings;
}
