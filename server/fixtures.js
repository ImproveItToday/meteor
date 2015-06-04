// Fixture data 
if (Issues.find().count() === 0) {
  var now = new Date().getTime();
  
  // create two users
  var pavelId = Meteor.users.insert({
    profile: { name: 'Pavel Shershnev' }
  });
  var pavel = Meteor.users.findOne(pavelId);
  var alexId = Meteor.users.insert({
    profile: { name: 'Alex Prusov' }
  });
  var alex = Meteor.users.findOne(alexId);
  
  var telescopeId = Issues.insert({
    title: 'Neighbours always burning rubbish next to our house',
    description: 'I\'m very annoyed when the neighbours start burning plastic rubbish as well as foilage next to our house, the smoke fills my room and I can\'t breath properly',
    userId: alex._id,
    author: alex.profile.name,
    gps: '-8.67061,115.1702',
    submitted: new Date(now - 1.1 * 3600 * 1000),
    commentsCount: 2,
    upvoters: [], votes: 0
  });
  

  Comments.insert({
    issueId: telescopeId,
    userId: pavel._id,
    author: pavel.profile.name,
    submitted: new Date(now - 1.2 * 3600 * 1000),
    body: 'Come on, let them do it!'
  });
  
  Comments.insert({
    issueId: telescopeId,
    userId: alex._id,
    author: alex.profile.name,
    submitted: new Date(now - 1.3 * 3600 * 1000),
    body: 'NO! this is unacceptable!'
  });

  
  Issues.insert({
    title: 'Employees of the Alphamart are always trying to cheat',
    description: 'Employees of the Alphamart are always trying to cheat, when giving change, they often don\'t give the receipt',
    userId: pavel._id,
    author: pavel.profile.name,
    gps: '-8.670617,115.17024',
    submitted: new Date(now - 1.4 * 3600 * 1000),
    commentsCount: 0,
    upvoters: [], votes: 0
  });
  
  Issues.insert({
    title: 'There is a pothole on the road',
    description: 'This pothole has been there for ages, I constantly see people almost crash, when they run over it',
    userId: pavel._id,
    author: pavel.profile.name,
    gps: '-8.670614,115.170244',
    submitted: new Date(now - 1.5 * 3600 * 1000),
    commentsCount: 0,
    upvoters: [], votes: 0
  });
  
  for (var i = 0; i < 7; i++) {
    Issues.insert({
      title: 'Test issue #' + i,
      description: 'Test description #' + i,
      author: alex.profile.name,
      userId: alex._id,
      gps: '-8.67'+i+'614,115.1'+i+'    70244',
      submitted: new Date(now - i-2 * 3600 * 1000 + 1),
      commentsCount: 0,
      upvoters: [], votes: 0
    });
  }
}