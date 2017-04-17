import { Meteor } from 'meteor/meteor';

import './publications';
import './methods';
import '../imports/api/posts';

Meteor.startup(() => {
  // code to run on server at startup
});
