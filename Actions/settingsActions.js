import BASE_URL from "../baseURL";
import { setLanguage } from "redux-i18n";
import { setAppReady, setLoggedIn } from './AppActions/AppActionCreators';

export const LOAD_SETTINGS_BEGIN = "LOAD_SETTINGS_BEGIN";
export const LOAD_SETTINGS_SUCCESS = "LOAD_SETTINGS_SUCCESS";
export const LOAD_SETTINGS_FAILURE = "LOAD_SETTINGS_FAILURE";

export const STORE_SETTINGS_BEGIN = "STORE_SETTINGS_BEGIN";
export const STORE_SETTINGS_SUCCESS = "STORE_SETTINGS_SUCCESS";
export const STORE_SETTINGS_FAILURE = "STORE_SETTINGS_FAILURE";

export const loadSettingsBegin = () => ({
  type: LOAD_SETTINGS_BEGIN
});

export const loadSettingsSuccess = (deviceId, settings) => ({
  type: LOAD_SETTINGS_SUCCESS,
  payload: { deviceId, settings }
});

export const loadSettingsFailure = error => ({
  type: LOAD_SETTINGS_FAILURE,
  payload: { error }
});

export const storeSettingsBegin = () => ({
  type: STORE_SETTINGS_BEGIN
});

export const storeSettingsSuccess = settings => ({
  type: STORE_SETTINGS_SUCCESS,
  payload: { settings }
});

export const storeSettingsFailure = error => ({
  type: STORE_SETTINGS_FAILURE,
  payload: { error }
});

export const loadSettings = deviceId => {
  return dispatch => {
    dispatch(loadSettingsBegin());
    return fetch(`${BASE_URL}settings/${deviceId}`)
      .then(res => {
        return res.json();
      })
      .then(resJson => {
        if (resJson && resJson.languageCode) {
          dispatch(setLoggedIn(true));
          dispatch(setLanguage(resJson.languageCode));
        }
        else {
          dispatch(setLoggedIn(false));
        }
        dispatch(loadSettingsSuccess(deviceId, resJson));
      })
      .then(() => dispatch(setAppReady()))
      .catch(error => dispatch(loadSettingsFailure(error)));
  };
};

export const storeSettings = (deviceId, newSettings) => {
  return dispatch => {
    dispatch(storeSettingsBegin());
    fetch(`${BASE_URL}settings/${deviceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newSettings)
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res;
      })
      .then(() => {
        dispatch(setLanguage(newSettings.languageCode));
        dispatch(storeSettingsSuccess(newSettings));
      })
      .catch(error => dispatch(storeSettingsFailure(error)));
  };
};
