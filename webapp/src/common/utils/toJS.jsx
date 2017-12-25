import React from 'react';
import { Iterable } from 'immutable';
import _ from 'lodash';

export default function toJS(WrappedComponent) {
  const withJSProps = maybeJSProps => {
    // TODO: If/when we update to Immutable v4, change this to use isImmutable (Iterable is deprecated)
    const jsProps = _.mapValues(maybeJSProps, val => (Iterable.isIterable(val) ? val.toJS() : val));

    return <WrappedComponent {...jsProps} />;
  };

  withJSProps.displayName = `toJS(${WrappedComponent.displayName || WrappedComponent.name})`;
  return withJSProps;
}
