const MongoClient = require('mongodb').MongoClient;
const dbo = db.db("HouseOfRestaurant");

const getAllFoods = () => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    dbo.collection("Foods").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
      return result;
    });
  });

};
