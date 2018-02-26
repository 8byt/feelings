import api, { sendRequest } from '../../common/api';

import { getPostId } from './selectors';

export const types = {
  REQUEST_POSTS: 'REQUEST_POSTS',
  LOAD_POSTS: 'LOAD_POSTS',
  SEND_POST: 'SEND_POST',
  COMPLETE_POST: 'COMPLETE_POST',
};

export const actions = {
  requestPosts: () => ({
    type: types.REQUEST_POSTS,
  }),

  loadPosts: (payload, error) => ({
    type: types.LOAD_POSTS,
    payload,
    error,
  }),

  fetchPosts: () => async dispatch => {
    dispatch(actions.requestPosts());
    try {
      const json = await sendRequest(api.GET_POSTS);
      dispatch(actions.loadPosts(json));
    } catch (e) {
      dispatch(actions.loadPosts(e, true));
    }
  },

  sendPost: payload => ({
    type: types.SEND_POST,
    payload,
  }),

  completePost: (payload, error) => ({
    type: types.COMPLETE_POST,
    payload,
    error,
  }),

  submitPost: (path, feelingId) => async (dispatch, getState) => {
    dispatch(actions.sendPost({ path, feelingId }));
    try {
      const json = await sendRequest(api.ADD_POST, {
        feelingId,
        parentId: getPostId(getState(), path),
        userId: 1
      });
      dispatch(actions.completePost(json));
      dispatch(actions.fetchPosts());
    } catch (e) {
      dispatch(actions.completePost(e, true));
    }
  },
};
