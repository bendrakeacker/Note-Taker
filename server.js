
const express = require("express");
const fs = require("fs");
const path = require('path');
const server = express();
const bodyParser = require("body-parser");

let PORT = process.env.PORT || 3006;
server.listen(PORT);

server.use(express.static('public'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));


server.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname + '/public/notes.html'));
});

server.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname + '/db/db.json'));
});

server.post("/api/notes", function (req, res) {
    let id = 1;
    fs.readFile(__dirname+'/db/db.json', 'utf-8', function (err, data) {
        if (err)
            res.status(500).json({message: "We could not find your file."});
        let oldObj = JSON.parse(data);
        let note = {
            title: req.body.title,
            text: req.body.text,
        };
        oldObj.push(note);
        oldObj.forEach(function (obj) {
            obj.id = id;
            id++;
        })
        fs.writeFile(__dirname+'/db/db.json', JSON.stringify(oldObj), function (err) {
            if (err)
                res.status(500).json({message: "Something went wrong..."});
            res.status(200).json({message: "Success!"}); 
        })
    })
});

server.delete("/api/notes/:id", function (req, res) {
    let objDelete;
    fs.readFile(__dirname+'/db/db.json', 'utf-8', function (err, data) {
        if (err)
            res.status(500).json({message: "We could not find your file."});
        let oldObj = JSON.parse(data);
        oldObj.forEach(function (object) {
            console.log(object);
            if(object.id == req.params.id)
                objDelete = object;
        });
        let indexDelete = oldObj.indexOf(objDelete);
        if(indexDelete === 0)
            oldObj.shift();
        else oldObj.splice(indexDelete, 1);
        fs.writeFile(__dirname+'/db/db.json', JSON.stringify(oldObj), function (err) {
            if (err)
                res.status(500).json({message: "Something went wrong..."});
            res.status(200).json({message: "Success!"}); 
        })
    });
})

server.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
