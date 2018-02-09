import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import FeelingPost from './FeelingPost';

import { getPosts } from '../data/posts/selectors';

const FeelingFeed = ({ posts }) => (
  <div className='feeling-feed'>
    {_.range(posts.size).map(index => <FeelingPost key={index} path={[index]} />)}
  </div>
);

FeelingFeed.propTypes = {
  
};

export default connect(
  state => ({ posts: getPosts(state) }),
)(FeelingFeed);
