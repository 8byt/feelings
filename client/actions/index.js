import { Meteor } from 'meteor/meteor';

export const createPost = emotion => {
    return dispatch => Meteor.call('createPost', emotion);
};
