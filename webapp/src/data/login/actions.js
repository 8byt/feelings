import api, { sendRequest } from '../../common/api';

export const types = {
  REQUEST_LOGIN: 'REQUEST_LOGIN',
  COMPLETE_LOGIN: 'COMPLETE_LOGIN',
};

export const actions = {
  requestLogin: () => ({
    type: types.REQUEST_LOGIN,
  }),

  completeLogin: (payload, error) => ({
    type: types.COMPLETE_LOGIN,
    payload,
    error,
  }),

  submitLogin: ({ username, password }) => async dispatch => {
    const { path, method } = api.LOGIN;
    dispatch(actions.requestLogin());
    try {
      const json = await sendRequest(path, method, { username, password }, false);
      localStorage.setItem('expire', json.expire);
      localStorage.setItem('token', json.token);
      dispatch(actions.completeLogin({ username }));
    } catch (e) {
      console.log(e);
      dispatch(actions.completeLogin(e, true));
    }
  }
};
