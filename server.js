const express = require('express');
const path = require('path');
var cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 8000;
const app = express();
var bodyParser = require('body-parser')
const multer = require("multer");

app.use(cors())

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true, parameterLimit: 5000000}));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

//multer options

const storage = multer.diskStorage({
    destination: "./build/assets/images/",
    filename: function(req, file, cb){
        cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    }
 });

const upload = multer({
   storage: storage,
   limits:{fileSize: 5000000},
}).single("myImage");

app.get('/*', function (req, res) {
    // res.render('rest')
    console.log('tett')
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        console.log("Request ---", req.body);
        console.log("Request file ---", req.file);//Here you get file.
        /*Now do where ever you want to do*/
        if(!err) {
            return res.send(req.file.filename).end();
        }
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))