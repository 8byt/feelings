export const isFeedbackFormVisible = state => state.getIn(['feedback', 'display']);

export const getFeedbackText = state => state.getIn(['feedback', 'content']);
