import { combineReducers } from 'redux';

const postsReducer = (state = [], action) => {
    switch(action.type) {
        case 'SET_POSTS':
            return action.posts;
        default:
            return state;
    }
};

export default combineReducers({
    posts: postsReducer
});
