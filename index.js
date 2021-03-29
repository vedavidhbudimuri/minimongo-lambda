var minimongo = require("minimongo");

var LocalDb = minimongo.MemoryDb;

// Create local db (in memory database with no backing)
db = new LocalDb();



setup = () => {
    // Add a collection to the database
    db.addCollection("animals");

    doc = { species: "dog", name: "Bingo" };

    // Always use upsert for both inserts and modifies
    db.animals.upsert(doc, function() {
        // Success:

        // Query dog (with no query options beyond a selector)
        db.animals.findOne({ species:"dog" }, {}, function(res) {
            console.log("Dog's name is: " + res.name);
        });
    });
}

function query() {
  const responsePromise = new Promise(async (resolve, reject) => {
    const animals = db.animals.find({}).fetch((data)=> {
      resolve({data: data})
  }, (error) => {reject({error: error})});
  })
  return responsePromise;
}

async function main() {
    await setup();
    response = await query();
    console.log("response: ", response)
    db.animals.find();
    return response;
}


if (require.main === module) {
  main();
}