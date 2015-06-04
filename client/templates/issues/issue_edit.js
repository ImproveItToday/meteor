Template.issueEdit.onCreated(function() {
  Session.set('issueEditErrors', {});
});

Template.issueEdit.helpers({
  errorMessage: function(field) {
    return Session.get('issueEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('issueEditErrors')[field] ? 'has-error' : '';
  }
});

Template.issueEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentIssueId = this._id;
    
    var issueProperties = {
      gps: $(e.target).find('[name=gps]').val(),
      title: $(e.target).find('[name=title]').val()
    }
    
    var errors = validateIssue(issueProperties);
    if (errors.title || errors.gps)
      return Session.set('issueEditErrors', errors);
    
    Issues.update(currentIssueId, {$set: issueProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Router.go('issuePage', {_id: currentIssueId});
      }
    });
  },
  
  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("Delete this issue?")) {
      var currentIssueId = this._id;
      Issues.remove(currentIssueId);
      Router.go('home');
    }
  }
});
