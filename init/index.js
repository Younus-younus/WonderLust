const mongoose = require("mongoose");
const Listing = require("../model/listing.js");
const InitData = require("./data.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
main().then(()=>{
    console.log("mongo connected");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDb = async()=> {
    await Listing.deleteMany({});
    await Listing.insertMany(InitData.data);
    console.log("data inserted")
}
initDb();