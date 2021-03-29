'use strict';
var minimongo = require("minimongo");
var LocalDb = minimongo.MemoryDb;

// Create local db (in memory database with no backing)
const db = new LocalDb();

function setup(setupData) {
    Object.keys(setupData).forEach(function(key) {
      var val = setupData[key];
      db.addCollection(key);
      db[key].upsert(val);
    });
}

function query(queryData, queryCollection, projectionData) {
  const responsePromise = new Promise(async (resolve, reject) => {
    const animals = db[queryCollection].find(queryData, {fields: projectionData}).fetch((data)=> {
      resolve({data: data})
  }, (error) => {reject({error: error})});
  })
  return responsePromise;
}


module.exports.execute = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);

  await setup(requestBody.setupData);
  var queryResult;
  try{
    queryResult = await query(
      requestBody.query, 
      requestBody.queryCollection,
      requestBody.projectionData
    );
  } catch(err) {
    queryResult = err
  }
  
  

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
      queryResult: queryResult
    }),
  };

  callback(null, response);
};
