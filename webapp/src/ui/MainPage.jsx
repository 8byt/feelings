import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import AddNewPost from './AddNewPost';
import FeelingFeed from './FeelingFeed';
import CurrentUserPanel from './CurrentUserPanel';

const MainPage = () => (
  <Fragment>
    <AddNewPost />
    <FeelingFeed />
    <CurrentUserPanel />
  </Fragment>
);

MainPage.propTypes = {
  
};

export default MainPage;
