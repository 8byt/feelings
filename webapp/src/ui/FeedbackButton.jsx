import React, { Component } from 'react';
import { connect } from 'react-redux';

import { isFeedbackFormVisible, getFeedbackText } from '../data/feedback/selectors';
import { actions } from '../data/feedback/actions';

const FeedbackButton = ({ display, content, onToggleForm, onEdit, onSubmit }) => (
  <div className='feedback-button-container'>
    <button onClick={onToggleForm}>
      {display ? 'Hide Form' : 'Leave Feedback'}
    </button>
    {display ?
      <div className='feedback-form'>
        <h5>Feedback?</h5>
        <form onSubmit={onSubmit}>
          <textarea autoFocus value={content} onChange={onEdit} />
          <button>Submit</button>
        </form>
      </div>
      : null
    }
  </div>
);

export default connect(
  state => ({
    display: isFeedbackFormVisible(state),
    content: getFeedbackText(state),
  }),
  dispatch => ({
    onToggleForm: () => dispatch(actions.toggleFeedbackForm()),
    onEdit: ({ target: { value } }) => dispatch(actions.editFeedback(value)),
    onSubmit: e => {
      e.preventDefault();
      dispatch(actions.submitFeedback());
    },
  })
)(FeedbackButton);
