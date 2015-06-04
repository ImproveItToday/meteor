
// testing maps, remove
Markers = new Mongo.Collection('markers');  

Markers.allow({
  insert: function() { return true; },
  update: function() { return true; },
  remove: function() { return true; },  

});

Issues = new Mongo.Collection('issues');

Issues.allow({
  update: function(userId, issue) { return ownsDocument(userId, issue); },
  remove: function(userId, issue) { return ownsDocument(userId, issue); },
});

Issues.deny({
  update: function(userId, issue, fieldNames) {
    // may only edit the following three fields:
    return (_.without(fieldNames, 'gps', 'title', 'description').length > 0);
  }
});

Issues.deny({
  update: function(userId, issue, fieldNames, modifier) {
    var errors = validateIssue(modifier.$set);
    return errors.title || errors.gps || errors.description;
  }
});

validateIssue = function (issue) {
  var errors = {};

  if (!issue.title)
    errors.title = "Please fill in a headline";
  
  if (!issue.gps)
    errors.gps =  "Please chose a GPs location";

if (!issue.description)
    errors.description =  "Please fill in a description";

    
  return errors;
}

Meteor.methods({
  issueInsert: function(issueAttributes) {
    check(this.userId, String);
    check(issueAttributes, {
      title: String,
      description: String,
      gps: String
    });
    
    var errors = validateIssue(issueAttributes);
    if (errors.title || errors.gps || errors.description)
      throw new Meteor.Error('invalid-issue', "You must set a title, description and URL for your issue");
    
    var issueWithSameLink = Issues.findOne({gps: issueAttributes.gps});
    if (issueWithSameLink) {
      return {
        issueExists: true,
        _id: issueWithSameLink._id
      }
    }
    
    var user = Meteor.user();
    var issue = _.extend(issueAttributes, {
      userId: user._id, 
      author: user.profile.name, 
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [], 
      votes: 0
    });
    
    console.log( 'name '+ user.profile.name);
    var issueId = Issues.insert(issue);
    
    return {
      _id: issueId
    };
  },
  
  upvote: function(issueId) {
    check(this.userId, String);
    check(issueId, String);
    
    var affected = Issues.update({
      _id: issueId, 
      upvoters: {$ne: this.userId}
    }, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });
    
    if (! affected)
      throw new Meteor.Error('invalid', "You weren't able to upvote that issue");
  }
});
