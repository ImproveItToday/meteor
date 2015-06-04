Notifications = new Mongo.Collection('notifications');

Notifications.allow({
  update: function(userId, doc, fieldNames) {
    return ownsDocument(userId, doc) && 
      fieldNames.length === 1 && fieldNames[0] === 'read';
  }
});

createCommentNotification = function(comment) {
  var issue = Issues.findOne(comment.issueId);
  if (comment.userId !== issue.userId) {
    Notifications.insert({
      userId: issue.userId,
      issueId: issue._id,
      commentId: comment._id,
      commenterName: comment.author,
      read: false
    });
  }
};