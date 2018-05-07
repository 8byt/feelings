import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import toJS from '../common/utils/toJS';
import reducePosts from '../common/utils/reducePosts';

import FeelingPost from './FeelingPost';

import { getPosts } from '../data/posts/selectors';

const FeelingFeed = ({ posts }) => (
  <div className='feeling-feed'>
    <div className='title'>How everyone feels</div>
    {_.reverse(posts.map(({ count }, index) => (
      <FeelingPost key={index} path={[index]} count={count} />
    )))}
  </div>
);

FeelingFeed.propTypes = {
  
};

export default connect(
  state => ({ posts: getPosts(state) }),
)(toJS(FeelingFeed));
