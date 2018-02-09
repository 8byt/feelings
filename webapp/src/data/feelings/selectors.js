export const getFeelings = state => state.get('feelings').toList();

export const getEmoji = (state, feelingId) => state.getIn(['feelings', feelingId, 'glyph']);
