import { getFeedbackText } from './selectors';

import api, { sendRequest } from '../../common/api';

import { getCurrentUserId } from '../login/selectors';

export const types = {
  TOGGLE_FEEDBACK_FORM: 'TOGGLE_FEEDBACK_FORM',
  EDIT_FEEDBACK: 'EDIT_FEEDBACK',
  SEND_FEEDBACK: 'SEND_FEEDBACK',
  COMPLETE_FEEDBACK: 'COMPLETE_FEEDBACK',
};

export const actions = {
  toggleFeedbackForm: () => ({ type: types.TOGGLE_FEEDBACK_FORM }),

  editFeedback: value => ({
    type: types.EDIT_FEEDBACK,
    payload: { value },
  }),

  sendFeedback: () => ({ type: types.SEND_FEEDBACK }),

  completeFeedback: error => ({
    type: types.COMPLETE_FEEDBACK,
    error,
  }),

  submitFeedback: () => async (dispatch, getState) => {
    const content = getFeedbackText(getState());
    const userId = getCurrentUserId(getState());

    if (!content) return;

    dispatch(actions.sendFeedback());
    try {
      const json = await sendRequest(api.FEEDBACK, { content, userId });
      dispatch(actions.editFeedback(''));
      dispatch(actions.completeFeedback());
    } catch (e) {
      dispatch(actions.completeFeedback(e));
    }
  },
};
