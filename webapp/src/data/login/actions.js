import moment from 'moment';

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

  loadCurrentUser: (payload, error) => ({
    type: types.SET_CURRENT_USER,
    payload,
    error,
  }),

  fetchCurrentUser: () => async dispatch => {
    try {
      const json = await sendRequest(api.GET_CURRENT_USER);
      dispatch(actions.loadCurrentUser(json));
    } catch (e) {
      dispatch(actions.loadCurrentUser(e, true));
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
  },

  submitNewAccount: () => async (dispatch, getState) => {
    const username = getLoginField(getState(), 'username');
    const password = getLoginField(getState(), 'password');
    const firstName = getLoginField(getState(), 'firstName');
    const lastName = getLoginField(getState(), 'lastName');

    try {
      const json = await sendRequest(api.CREATE_ACCOUNT, {
        email: username,
        password,
        name: `${firstName} ${lastName}`,
      }, false);
      console.log(json);
      if (json.code === 200) {
        dispatch(actions.submitLogin());
        dispatch(actions.editLoginField('firstName', ''));
        dispatch(actions.editLoginField('lastName', ''));
      }
    } catch (e) {
      console.log(e);
      dispatch(actions.completeLogin(e, true));
    }
  },

  checkUserSession: () => async dispatch => {
    const tokenExpire = localStorage.getItem('expire');
    if (tokenExpire && moment(tokenExpire).isAfter(moment())) {
      dispatch(actions.fetchCurrentUser());
      dispatch(feelingActions.fetchFeelings());
      dispatch(postActions.fetchPosts());
    } else {
      localStorage.removeItem('expire');
      localStorage.removeItem('token');
    }
  },

  logOut: () => async dispatch => {
    localStorage.removeItem('expire');
    localStorage.removeItem('token');
    dispatch(actions.loadCurrentUser({ currentUser: {} }));
    dispatch(postActions.loadPosts({ posts: [], users: [] }));
  },
};
