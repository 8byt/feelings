import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import toJS from '../common/utils/toJS';

import AddReaction from './AddReaction';
import FeelingGroup from './FeelingGroup';

import { getChildrenTypes } from '../data/posts/selectors';

const FeelingList = ({ path, childrenTypes }) => (
  <div className='feeling-list'>
    {childrenTypes.map(feelingId => (
      <FeelingGroup
        key={feelingId}
        feelingId={feelingId}
        path={path}
      />
    ))}
    <div className='feeling' style={{ marginLeft: 'auto' }}>
      <AddReaction path={path} />
    </div>
  </div>
);

const FeelingListWrapper = connect(
  (state, { path }) => ({
    childrenTypes: getChildrenTypes(state, path)
  }),
)(toJS(FeelingList));

export default FeelingListWrapper;
