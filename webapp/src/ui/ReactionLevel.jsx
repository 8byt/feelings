import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import FeelingList from './FeelingList';

import { getPosterName } from '../data/posts/selectors';

class ReactionLevel extends Component {
  state = { minutesSince: 0 };

  updateTime = () => {

  }

  componentDidMount() {
    this.updateTime();
    this.timeUpdate = setInterval(this.updateTime, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timeUpdate);
  }

  render() {
    const { userName, path } = this.props;
    const { minutesSince } = this.state;

    return (
      <div className='reaction-level'>
        <div className='reaction-description'>
          {userName} {path.length > 1 ? 'reacted' : 'felt'} {minutesSince} minutes ago
        </div>
        <FeelingList path={path} />
      </div>
    );
  }
}

ReactionLevel.propTypes = {
  
};

export default connect(
  (state, { path }) => ({ userName: getPosterName(state, path) }),
)(ReactionLevel);
