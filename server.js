var express = require("express");
var bodyParser = require("body-parser");
const admin = require('firebase-admin')
const ServiceAccount = require('./key.json')
const port = process.env.PORT || 8080
var app = express();

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount),
    databaseURL: "https://epi-serv-job-default-rtdb.firebaseio.com"
});


var distDir = __dirname + "/dist/episjobadmin";
app.use(express.static(distDir))

app.get("/api/status", function (req, res) {
    res.status(200).json({ status: "UP" });
});

app.get("/api/getusers", function (req,res){
    admin.auth().listUsers(1000)
    .then(a=>{
        res.status(200).json(a)
    })
    
});

/*app.get('/api/*', (req,res)=>{
    res.status(200).json({response: '404 - Page not Found'})
})*/


app.listen(port, function () {
    console.log("App now running on port", port);
});


