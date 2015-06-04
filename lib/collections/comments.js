Comments = new Mongo.Collection('comments');

Meteor.methods({
  commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      issueId: String,
      body: String
    });
    
    var user = Meteor.user();
    var issue = Issues.findOne(commentAttributes.issueId);

    if (!issue)
      throw new Meteor.Error('invalid-comment', 'You must comment on an issue');
    
    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.profile.name,
      submitted: new Date()
    });
    
    // update the issue with the number of comments
    Issues.update(comment.issueId, {$inc: {commentsCount: 1}});
    
    // create the comment, save the id
    comment._id = Comments.insert(comment);
    
    // now create a notification, informing the user that there's been a comment
    createCommentNotification(comment);
    
    return comment._id;
  }
});
