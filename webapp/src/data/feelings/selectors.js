export const getEmoji = (state, feelingId) => state.getIn(['feelings', feelingId, 'glyph']);
