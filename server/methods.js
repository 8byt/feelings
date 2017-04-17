import { Meteor } from 'meteor/meteor';
import Posts from '../imports/api/posts';

Meteor.methods({
    createPost(emotion) {
        Posts.insert({
            timestamp: new Date(),
            emotion,
            seen: [],
            reactions: []
        });
    }
});
