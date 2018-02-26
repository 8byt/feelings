import api, { sendRequest } from '../../common/api';

import { actions as postActions } from '../posts/actions';
import { actions as feelingActions } from '../feelings/actions';

import { getLoginField } from './selectors';

export const types = {
  EDIT_LOGIN_FIELD: 'EDIT_LOGIN_FIELD',
  SEND_LOGIN: 'SEND_LOGIN',
  COMPLETE_LOGIN: 'COMPLETE_LOGIN',
  SET_CURRENT_USER: 'SET_CURRENT_USER',
};

export const actions = {
  editLoginField: (field, value) => ({
    type: types.EDIT_LOGIN_FIELD,
    payload: { field, value },
  }),

  sendLogin: () => ({
    type: types.SEND_LOGIN,
  }),

  completeLogin: (payload, error) => ({
    type: types.COMPLETE_LOGIN,
    payload,
    error,
  }),

  setCurrentUser: (payload, error) => ({
    type: types.SET_CURRENT_USER,
    payload,
    error,
  }),

  fetchCurrentUser: () => async dispatch => {
    try {
      const json = await sendRequest(api.GET_CURRENT_USER);
      dispatch(actions.setCurrentUser(json));
    } catch (e) {
      dispatch(actions.setCurrentUser(e, true));
    }
  },

  submitLogin: () => async (dispatch, getState) => {
    const username = getLoginField(getState(), 'username');
    const password = getLoginField(getState(), 'password');

    dispatch(actions.sendLogin());
    try {
      const json = await sendRequest(api.LOGIN, { username, password }, false);
      if (json.code === 200) {
        localStorage.setItem('expire', json.expire);
        localStorage.setItem('token', json.token);
        dispatch(actions.editLoginField('username', ''));
        dispatch(actions.editLoginField('password', ''));
        dispatch(actions.fetchCurrentUser());
        dispatch(actions.completeLogin({ username }));
        dispatch(feelingActions.fetchFeelings());
        dispatch(postActions.fetchPosts());
      }
    } catch (e) {
      console.log(e);
      dispatch(actions.completeLogin(e, true));
    }
  }
};
