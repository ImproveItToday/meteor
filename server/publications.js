Meteor.publish('issues', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Issues.find({}, options);
});

Meteor.publish('singleIssue', function(id) {
  check(id, String);
  return Issues.find(id);
});


Meteor.publish('comments', function(issueId) {
  check(issueId, String);
  return Comments.find({issueId: issueId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
