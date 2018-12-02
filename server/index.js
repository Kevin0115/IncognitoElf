// Require dependencies
var path = require('path');
var express = require('express');
var bodyParser= require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var stringHash = require('string-hash');

// Connection URL (mLab)
var url = 'mongodb://kevin:incognito1@ds123434.mlab.com:23434/incognitoelf';

// Declare application parameters
var PORT = process.env.PORT || 3000;
var STATIC_ROOT = path.resolve(__dirname, './public');

// Defining CORS middleware to enable CORS.
// (should really be using "express-cors",
// but this function is provided to show what is really going on when we say "we enable CORS")
function cors(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS,PUT");
	next();
}

// Instantiate an express.js application
var app = express();

// Configure the app to use a bunch of middlewares
app.use(express.json());							// handles JSON payload
app.use(express.urlencoded({ extended : true }));	// handles URL encoded payload
app.use(cors);										// Enable CORS
app.use(bodyParser.urlencoded({extended: true}))

app.use('/', express.static(STATIC_ROOT));			// Serve STATIC_ROOT at URL "/" as a static resource

// Setup DB Connection
MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  // Ensure no problem connecting
  assert.equal(null, err);

  // This is the name of the db on mLab
  var db = client.db('incognitoelf');
  console.log('[MongoDB] Connected to '+ db.databaseName);

  // Start listening on TCP port; only if db connection successful
  app.listen(PORT, function(){
    console.log('[Express.js] Server listening on PORT: '+ PORT);
  });

  // For testing
  // app.get('/groups/', function(request, response) {
  //   db.collection('groups').find({}).toArray((err, docs) => {
  //     if (err) {
  //       console.log(err);
  //       response.error(err);
  //     } else {
  //       response.json(docs);
  //     }
  //   });
  // });

  // groups/id endpoint: returns group object according to given group_id
  // app.get('/groups/:group_id', function(request, response) {
  //   db.collection('groups').findOne({group_id: parseInt(request.params.group_id)}, (err, docs) => {
  //     if (err) {
  //       console.log(err);
  //       response.error(err);
  //     } else {
  //       response.json(docs);
  //     }
  //   });
  // });

  // for homescreen ---------------------------------------------- IN USE
  app.get('/groups/user/:user_id', function(request, response) {
    console.log(request.params.user_id);
    db.collection('groups').find({members: {$elemMatch: {user_id: request.params.user_id}}}).toArray((err, docs) => {
      if (err) {
        console.log(err);
        // response.error(err);
      } else {
        response.json(docs);
      }
    });
  });

  // groups/create endpoint: creates new group ------------ IN USE
  app.post('/groups/create', function(request, response) {
    var hashID = stringHash(request.body.group_name).toString();
    console.log(hashID);
    db.collection('groups').insertOne(
      {
        ...request.body,
        group_id: hashID,
      },
      (err, docs) => {
      if (err) {
        console.log(err);
        response.error(err);
      } else {
        console.log('Saved to DB');
        response.json({status: 'OK'});
      }
    });
  });

  // Join group ---------------------------------------------- IN USE
  app.put('/groups/join', function(request, response) {
    db.collection('groups').findOneAndUpdate(
      {group_id: request.body.group_id},
      {$addToSet: 
        {members: request.body.user}
      },
      (err, docs) => {
        if (err) {
          console.log(err);
          response.error(err);
        } else if (docs.value == null) {
          console.log('Invalid Group Code');
          response.status(400).send({error: 'Invalid Group Code'});
        } else {
          console.log('Saved to DB');
          response.json({status: 'OK'});
        }
      }
    );
  });

  app.put('/groups/shuffle/:group_id' , function(request, response) {
    console.log('SHUFFLE: ' + JSON.stringify(request.body));
    // Ensure not already shuffled
    db.collection('groups').findOne(
      {group_id: request.params.group_id},
      (err, docs) => {
        if (err) {
          console.log(err);
          response.error(err);
        } else if (docs.shuffled) {
          console.log('Already Shuffled');
          response.json({status: 'already shuffled'});
        } else {
          console.log('SHUFFLING');
          db.collection('groups').update(
            {group_id: request.params.group_id},
            {
              $set: {
                members: request.body,
                shuffled: true,
              }
            },
            {upsert: true},
            (err, docs) => {
              if (err) {
                console.log(err);
                response.error(err);
              } else {
                console.log('Saved to DB');
                response.json({status: 'OK'});
            }
          });
        }
    });
  });

  // Configure '/users' endpoint
  app.get('/users/:user_id', function(request, response) {
    db.collection('users').findOne({user_id: parseInt(request.params.user_id)}, null, {upsert: true}, (err, docs) => {
      if (err) {
        console.log(err);
        response.error(err);
      } else {
        response.json(docs);
      }
    });
  });

  // Create User
  app.post('/users/create', function(request, response) {
    db.collection('users').update(
      {id: request.body.id},
      {...request.body},
      {upsert: true},
      (err, docs) => {
        if (err) {
          console.log(err);
          response.error(err);
        } else {
          console.log('Saved to DB');
          response.json({status: 'OK'});
      }
    });
  });

  // TODO:
  // get one user
  // get one group
  // get one user's groups (might be easy if we store all groups in user)
  //
});