export const types = {
  TOGGLE_REACTIONS: 'TOGGLE_REACTIONS',
};

export const actions = {
  toggleReactions: path => ({
    type: types.TOGGLE_REACTIONS,
    path,
  }),
};
