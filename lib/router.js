Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]
  }
});

Router.onBeforeAction(function() {
  GoogleMaps.load({libraries: 'visualization' });
  this.next();
}, { only: ['map', 'issueSubmit'] });

IssuesListController = RouteController.extend({
  template: 'issuesList',
  increment: 5, 
  issuesLimit: function() { 
    return parseInt(this.params.issuesLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.issuesLimit()};
  },
  subscriptions: function() {
    this.issuesSub = Meteor.subscribe('issues', this.findOptions());
  },
  issues: function() {
    return Issues.find({}, this.findOptions());
  },
  data: function() {
    var self = this;
    return {
      issues: self.issues(),
      ready: self.issuesSub.ready,
      nextPath: function() {
        if (self.issues().count() === self.issuesLimit())
          return self.nextPath();
      }
    };
  }
});

NewIssuesController = IssuesListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newIssues.path({issuesLimit: this.issuesLimit() + this.increment})
  }
});

BestIssuesController = IssuesListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestIssues.path({issuesLimit: this.issuesLimit() + this.increment})
  }
});

Router.route('/', {
  name: 'home',
  controller: NewIssuesController
});

Router.route('/new/:issuesLimit?', {name: 'newIssues'});

Router.route('/best/:issuesLimit?', {name: 'bestIssues'});


Router.route('/issues/:_id', {
  name: 'issuePage',
  waitOn: function() {
    return [
      Meteor.subscribe('singleIssue', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Issues.findOne(this.params._id); }
});

Router.route('/issues/:_id/edit', {
  name: 'issueEdit',
  waitOn: function() { 
    return Meteor.subscribe('singleIssue', this.params._id);
  },
  data: function() { return Issues.findOne(this.params._id); }
});

Router.route('/map', {
  name: 'map',
  //controller: IssueMap
});


Router.route('/submit', {name: 'issueSubmit'});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'issuePage'});
Router.onBeforeAction(requireLogin, {only: 'issueSubmit'});
