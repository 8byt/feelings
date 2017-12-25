export const getUserName = (state, userId) => state.getIn(['users', userId, 'name']);
