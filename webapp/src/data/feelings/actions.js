import api, { sendRequest } from '../../common/api';

export const types = {
  REQUEST_FEELINGS: 'REQUEST_FEELINGS',
  LOAD_FEELINGS: 'LOAD_FEELINGS',
};

export const actions = {
  requestFeelings: () => ({
    type: types.REQUEST_FEELINGS
  }),

  loadFeelings: (payload, error) => ({
    type: types.LOAD_FEELINGS,
    payload,
    error,
  }),

  fetchFeelings: () => async dispatch => {
    const { path, method } = api.GET_FEELINGS;
    dispatch(actions.requestFeelings());
    try {
      const json = await sendRequest(path, method);
      dispatch(actions.loadFeelings(json));
    } catch (e) {
      dispatch(actions.loadFeelings(e, true));
    }
  }
};
