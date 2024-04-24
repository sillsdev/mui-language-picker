// Describing the shape of the book names's slice of state
export interface LangTag {
  full: string;
  iana?: string[];
  iso639_3?: string;
  localname?: string;
  localnames?: string[];
  name: string;
  names?: string[];
  nophonvars?: boolean;
  region?: string;
  regionname?: string;
  regions?: string[];
  script: string;
  sldr: boolean;
  suppress?: boolean;
  tag: string;
  tags?: string[];
  variants?: string[];
  defaultFont?: string;
  fonts?: string[];
  windows?: string;
}

export interface IRanked {
  index: number;
  rank: number;
}

export interface LangTagMap {
  [code: string]: number[];
}

export interface ScriptName {
  [code: string]: string;
}

export interface IFamily {
  defaults?: {
    ttf: string;
    woff?: string;
    woff2?: string;
  };
  distributable: boolean;
  fallback?: string;
  family: string;
  familyid: string;
  files?: {
    [fileid: string]: {
      axes: {
        ital?: number;
        wght: number;
      };
      flourl?: string;
      packagepath: string;
      url?: string;
      zippath?: string;
    };
  };
  license?: 'OFL' | 'GPL3' | 'GPL' | 'Freeware' | 'proprietary' | 'shareware';
  packageurl?: string;
  siteurl?: string;
  source?:
    | 'SIL'
    | 'Google'
    | 'Microsoft'
    | 'NLCI'
    | 'STAR'
    | 'Evertype'
    | 'Lao Script';
  status?: 'current' | 'archived' | 'deprecated';
  version?: string;
  ziproot?: string;
}

export interface IFamilies {
  [key: string]: IFamily;
}

export interface ICodeFamily {
  defaultfamily: string;
  apiversion: number;
  families: IFamilies;
}
export interface FontMap {
  [code: string]: string;
}

// Describing the different ACTION NAMES available
export const FETCH_LANGTAGS = 'FETCH_LANGTAGS';
export const FETCH_SCRIPTFONTS = 'FETCH_SCRIPTFONTS';

interface FetchLangTags {
  type: typeof FETCH_LANGTAGS;
  payload: { data: LangTag[] };
}

interface FetchScriptFonts {
  type: typeof FETCH_SCRIPTFONTS;
  payload: { data: string };
}

export type LangTagMsgs = FetchLangTags | FetchScriptFonts;
