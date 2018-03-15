import React from 'react';
import { connect } from 'react-redux';

import toJS from '../common/utils/toJS';

import { getFeelings } from '../data/feelings/selectors';
import { actions as postActions } from '../data/posts/actions';

const AddNewPost = ({ feelings, onPost }) => {
  return (
    <div className='add-new-post'>
      <div className='title'>How do you feel?</div>
      <div className='new-post-options'>
        {feelings.map(({ id, glyph }) => (
          <div key={id} className='feeling-content' onClick={() => onPost(id)}>{glyph}</div>
        ))}
      </div>
    </div>
  )
};

export default connect(
  state => ({ feelings: getFeelings(state) }),
  dispatch => ({ onPost: id => dispatch(postActions.submitPost(null, id)) })
)(toJS(AddNewPost));