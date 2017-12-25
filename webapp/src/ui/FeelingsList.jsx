import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Popup, Accordion, Icon } from 'semantic-ui-react';

import { getUserName } from '../data/users/selectors';
import { getEmoji } from '../data/feelings/selectors';

const Feeling = ({ index, active, isTopLevel, emoji, user, reactions, onClick }) => {
  const title = (
    <Accordion.Title active={active} index={index} onClick={e => onClick(e, { index })}>
      <Icon name='dropdown' />
      {`${isTopLevel ? user : ''} ${emoji}`}
    </Accordion.Title>
  );
  if (reactions.length) {
    return [
      (isTopLevel ? title
        : <Popup trigger={title} content={user} on='hover' />
      ),
      <Accordion.Content active={active} index={index}>
        <FeelingsList feelings={reactions} />
      </Accordion.Content>
    ];
  }
  return <Popup trigger={<div>{emoji}</div>} content={user} on='hover' />;
}

Feeling.propTypes = {
  
};

const mapStateToProps = (state, { feelingId, userId, children }) => ({
  emoji: getEmoji(state, feelingId),
  user: getUserName(state, userId),
  reactions: children,
});

const FeelingWrapper = connect(mapStateToProps)(Feeling);


class FeelingsList extends Component {
  static propTypes = {

  };

  state = { activeIndex: -1 };

  handleClick = (e, { index }) => {
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { feelings, isTopLevel } = this.props;
    const { activeIndex } = this.state;
    return (
      <Accordion>
        {feelings.map((props, index) => (
          <FeelingWrapper
            key={index}
            index={index}
            active={activeIndex === index}
            isTopLevel={isTopLevel}
            onClick={this.handleClick}
            {...props}
          />
        ))}
      </Accordion>
    );
  }
}

export default FeelingsList;
