Template.issuePage.helpers({
  comments: function() {
    return Comments.find({issueId: this._id});
  }
});