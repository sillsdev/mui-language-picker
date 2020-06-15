import Axios from 'axios';
import { FETCH_LOCALIZATION, SET_LANGUAGE } from './types';

const isElectron = process.env.REACT_APP_MODE === 'electron';
const appPath = () => (isElectron ? '.' : '');

export const fetchLocalization = () => (dispatch: any) => {
  Axios.get(appPath() + '/localization/strings.json').then((strings) => {
    dispatch({
      payload: strings,
      type: FETCH_LOCALIZATION,
    });
  });
};

export const setLanguage = (lang: string) => {
  return {
    payload: lang,
    type: SET_LANGUAGE,
  };
};
