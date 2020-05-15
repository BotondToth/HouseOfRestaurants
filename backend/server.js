const emailService = require("./email");
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bcrypt = require('bcrypt');
const allowedOrigins = ['http://localhost:4200',
  'http://localhost:3000'];
const app = new express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());

let userObj;

const generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

const validatePassword = (lpw, password) => {
  return bcrypt.compareSync(lpw, password);
};

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
const url = "mongodb://localhost:27017/";

passport.serializeUser(function (user, done) {
  if(!user) return done("Hiba - nincs user", undefined);
  console.log("serialize sikeres ", user);
  userObj = user;
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  if(!user) return done("Hiba - nincs user, akit kileptethetnenk", undefined);
  console.log("deserialize sikeres");
  userObj = null;
  return done(null, user);
});

passport.use('local',
  new LocalStrategy.Strategy((username, password, done) => {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      const dbo = db.db("HouseOfRestaurant"),
       query = { username };
      dbo.collection("Users").find(query).toArray((err, result) => {
        if (err) throw err;
        db.close();
        if (result[0] && result[0].username === username && validatePassword(password, result[0].password)) {
          return done(null, {username: result[0].username});
        } else {
          return done('[Auth] error', null);
        }
      });
    });
  })
);

app.use(session({secret: 'houseofrestaurants'}));
app.use(passport.initialize());
app.use(passport.session());

app.post('/authenticate', (req, res) => {
  if(req.body.username && req.body.password) {
    passport.authenticate('local', (error, user) => {
      if(error) {
        console.log(error)
        return res.status(403).send(error);
      } else {
        req.logIn(user, (error) => {
          if(error) return res.status(500).json({ "statusCode": 500 }).send(error);
          return res.status(200).json({ "statusCode": 200 });
        });
      }
    })(req, res);
  } else {
    res.status(400).send("Hiányzó usernév vagy jelszó");
  }
});

const isLoggedIn = (req, res, next) => {
  //console.log(req.session.passport.user) - valamiert undefined a req.session.passport!
  if (userObj) {
    return next()
  }
  return res.status(400).json({"statusCode": 400, "message": "not authenticated"})
};

app.post('/register', (req, res) => {
  const user = req.body;
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    const originalPwd = user.password;
    user.password = generateHash(originalPwd);
    const dbo = db.db("HouseOfRestaurant");
    dbo.collection("Users").save(user);
    emailService.sendRegistrationEmail(user.username);
    db.close();
  });
  res.status(200).json({ "statusCode": 200 });
});

app.get('/foods', isLoggedIn, (req, res) => {
  MongoClient.connect(url, isLoggedIn, (err, db) => {
    if (err) throw err;
    const dbo = db.db("HouseOfRestaurant");
    dbo.collection("Foods").find().toArray((err, result) => {
      if (err) throw err;
      db.close();
      res.status(200).json({ "statusCode": 200, foods: result });
    });
  });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ "statusCode": 200 });
});

app.get('/toppings', (req, res) => {
  MongoClient.connect(url, isLoggedIn, (err, db) => {
    if (err) throw err;
    const dbo = db.db("HouseOfRestaurant");
    dbo.collection("Toppings").find().toArray((err, result) => {
      if (err) throw err;
      db.close();
      res.status(200).json({ "statusCode": 200, toppings: result });
    });
  });
});

app.post('/order', isLoggedIn, (req, res) => {
  const order = req.body;
  order.orderedAt = new Date();
  order.status = 0;
  order.username = userObj.username;
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    const dbo = db.db("HouseOfRestaurant");
    dbo.collection("Orders").save(order);
    emailService.sendOrderConfirmEmail(order, userObj.username);
    db.close();
  });
  res.status(200).json({ "statusCode": 200 });
})


getOrders = () => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    const dbo = db.db("HouseOfRestaurant");
    dbo.collection("Orders").find().toArray((err, result) => {
      if (err) throw err;
      db.close();
      if (result) {
        return result;
      }
      return [];
    });
  });
}

workOnOrders = (orders) => {
  orders.forEach(order => {
    let incrementedStatus = order.status;
    if (order.status < 8) {
      incrementedStatus++;
    }
    MongoClient.connect(url, (err, db) => {
      if (err) throw err;
      const dbo = db.db("HouseOfRestaurant");
      const query = {_id: order._id};
      const newvalues = {$set: {status: incrementedStatus}};
      dbo.collection("Orders").updateOne(query, newvalues, function (err, res) {
        if (err) throw err;
        console.log("Order updated: ", query);
        db.close();
      });
    });
  })
}

app.get('/orders', isLoggedIn, (req, res) => {
  MongoClient.connect(url, isLoggedIn, (err, db) => {
    if (err) throw err;
    const dbo = db.db("HouseOfRestaurant");
    const query = { username: userObj.username }
    dbo.collection("Orders").find(query).limit(4).toArray((err, result) => {
      if (err) throw err;
      db.close();
      if (result.filter(f => f.status !== 8).length > 0) {
        workOnOrders(result);
      }
      res.status(200).json({ "statusCode": 200, processedOrders: result });
    });
  });
})


app.listen(3000, () => {
  console.log('HouseOfRestaurant backend running at 3000')
});

