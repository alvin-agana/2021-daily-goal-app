var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
const { resolveInclude } = require('ejs');
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/Public"));

var connection = mysql.createConnection({
	host: '',
	user: '',
    password: '',
	database: '',
    multipleStatements: true
});

// Bulk inserting every single day into db
// Tested with January first
/*
var data = []
var months = ["0", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
var days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
for (var j=2; j <= 12; j++) {
    for (var i=1; i <= days[j]; i++) {
        data.push([
            "2021" + "-" + months[j] + "-" + i
        ]);
    }
}

var q = 'INSERT INTO day(date) VALUES ?';

connection.query(q, [data], function (error, result) {
	if (error) throw error;
	console.log(result);
});
*/

/* Home Page*/
app.get("/", function(req, res){
	console.log("Someone requested us!");

    res.render("home");
    
});


/* Generating daily report */ 
app.get("/dailyreport", function(req, res){
	console.log("Inserting daily report...");
    res.render("dailyreport");
});

app.post("/insertdailyreport", function(req, res){
	console.log("Inserting food..");

    /* For getting today's date */
    let date = new Date(Date.now());
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let year = date.getFullYear();
    let today = year + "-" + month + "-" + day;
    

    /* Insert food query */
    if (req.body.food == "") {
        console.log("No food data entered")
    } else {
        q = "INSERT INTO food (date, description) VALUES ?";
        var foodList = req.body.food.split(",")
        var data = []
        for (i = 0; i < foodList.length; i++) {
            data.push([
                today,
                foodList[i].trimStart()
            ])
        }
        connection.query(q, [data], function(error, results) {
            if (error) throw error;
            console.log(results);
            console.log("Insert food data successfully");
        }) 
    }

    /* Pushup query */
    if (req.body.pushups == "") {
        console.log("No push ups were entered")
    } else {
        var pushups = {
            date: today,
            count: parseInt(req.body.pushups)
        }
        q = "INSERT INTO pushup SET ?";
        connection.query(q, pushups, function(error, results) {
            if (error) throw error;
            console.log("Insert pushup data successfully");
        })
    }

    /* Piano query */
    if (req.body.piano == "") {
        console.log("No piano data entered")
    } else {
        q = "INSERT INTO piano (date, description) VALUES ?";
        var pianoList = req.body.piano.split(",")
        var data = []
        for (i = 0; i < pianoList.length; i++) {
            data.push([
                today,
                pianoList[i].trimStart()
            ])
        }

        connection.query(q, [data], function(error, results) {
            if (error) throw error;
            console.log("Insert piano data successfully");
        }) 
    }

    /* Code query */
    if (req.body.code == "") {
        console.log("No code data entered")
    } else {
        var code = {
            date: today,
            description: req.body.code
        }
        q = "INSERT INTO coding SET ?";
        connection.query(q, code, function(error, results) {
            if (error) throw error;
            console.log("Insert code data successfully");
        })
    }

    /* Exercise query */
    if (req.body.exerciseTime == "") {
        console.log("No exercise data entered")
    } else {
        var exercise = {
            date: today,
            time_exercised: req.body.exerciseTime,
            miles: req.body.exerciseMiles,
            calories_burned: req.body.exerciseCal
        }
        q = "INSERT INTO exercise SET ?";
        connection.query(q, exercise, function(error, results) {
            if (error) throw error;
            console.log("Insert exercise data successfully");
        })
    }

    /* Chess query */
    if (req.body.chessDescription == "") {
        console.log("No exercise data entered")
    } else {
        var chess = {
            date: today,
            description: req.body.chessDescription,
            win: parseInt(req.body.chessWin),
            loss: parseInt(req.body.chessLoss)
        }
        q = "INSERT INTO chess SET ?";
        connection.query(q, chess, function(error, results) {
            if (error) throw error;
            console.log("Insert chess data successfully");
        })
    }

    res.redirect("/thankyou");
});





/* ======================================= */

/* Managing data */
app.get("/manage", function(req, res){
	console.log("Manage page!");
    res.render("manage"); 
});

app.get("/manageFood", function(req, res){
    q = "SELECT * FROM food ORDER BY id DESC LIMIT 20";
    connection.query(q, function(error, results) {
        if (error) throw error;
        data = []
        for (i = 0; i < results.length; i++) {
            data.push({
                id: results[i].id,
                date: JSON.stringify(results[i].date).split('T')[0].substring(1),
                description: results[i].description
            })
        }
        res.render("manageFood", {data: data})
    })
});

app.get("/managePushups", function(req, res){
    q = "SELECT * FROM pushup ORDER BY id DESC LIMIT 20";
    connection.query(q, function(error, results) {
        if (error) throw error;
        data = []
        for (i = 0; i < results.length; i++) {
            data.push({
                id: results[i].id,
                date: JSON.stringify(results[i].date).split('T')[0].substring(1),
                count: results[i].count
            })
        }
        res.render("managePushups", {data: data})
    })
});

app.get("/manageCode", function(req, res){
    q = "SELECT * FROM coding ORDER BY id DESC LIMIT 20";
    connection.query(q, function(error, results) {
        if (error) throw error;
        data = []
        for (i = 0; i < results.length; i++) {
            data.push({
                id: results[i].id,
                date: JSON.stringify(results[i].date).split('T')[0].substring(1),
                description: results[i].description
            })
        }
        res.render("manageCode", {data: data})
    })
});

app.get("/managePiano", function(req, res){
    q = "SELECT * FROM piano ORDER BY id DESC LIMIT 20";
    connection.query(q, function(error, results) {
        if (error) throw error;
        data = []
        for (i = 0; i < results.length; i++) {
            data.push({
                id: results[i].id,
                date: JSON.stringify(results[i].date).split('T')[0].substring(1),
                description: results[i].description
            })
        }
        res.render("managePiano", {data: data})
    })
});

app.get("/manageExercise", function(req, res){
    q = "SELECT * FROM exercise ORDER BY id DESC LIMIT 20";
    connection.query(q, function(error, results) {
        if (error) throw error;
        data = []
        for (i = 0; i < results.length; i++) {
            data.push({
                id: results[i].id,
                date: JSON.stringify(results[i].date).split('T')[0].substring(1),
                time: results[i].time_exercised,
                miles: results[i].miles,
                cal: results[i].calories_burned
            })
        }
        res.render("manageExercise", {data: data})
    })
});

app.get("/manageChess", function(req, res){
    q = "SELECT * FROM chess ORDER BY id DESC LIMIT 20";
    connection.query(q, function(error, results) {
        if (error) throw error;
        data = []
        for (i = 0; i < results.length; i++) {
            data.push({
                id: results[i].id,
                date: JSON.stringify(results[i].date).split('T')[0].substring(1),
                description: results[i].description,
                win: results[i].win,
                loss: results[i].loss
            })
        }
        res.render("manageChess", {data: data})
    })
});




/* Delete and update rows */ 

app.post("/delete", function(req, res){
    q = `DELETE FROM ${req.body.table} WHERE id = ?`;
        connection.query(q, req.body.id, function(error, results) {
            if (error) throw error;
            console.log("Deleted data successfully");
        })
    
    res.redirect(req.body.page);
});

app.post("/update", function(req, res){
    console.log(req.body);

    var s = "";
    switch(req.body.table) {
        case 'pushup':
            s = `count = ${req.body.count}`;
            break;
        case 'piano':
        case 'food':
        case 'coding':
            s = `description = "${req.body.description}"`;
            break;
        case 'exercise':
            s = `time_exercised = ${req.body.time_exercised}, miles = ${req.body.miles}, calories_burned = ${req.body.calories_burned}`;
            break;
        case 'chess':
            s = `description = "${req.body.description}", win = ${req.body.win}, loss = ${req.body.loss}`;
            break;
        default:
            break;
    }
    
    q = `UPDATE ${req.body.table} SET date = "${req.body.date}", ${s} WHERE id = ?`;
        connection.query(q, parseInt(req.body.id), function(error, results) {
            if (error) throw error;
            console.log("Updated data successfully");
        })
    
    res.redirect(req.body.page);
});


/* Thank you page */
app.get("/thankyou", function(req, res){
	console.log("Thank you page loaded");
    res.render("thankyou");
});




/* Overview */
app.get("/overview", function(req, res){
	console.log("Overview page!");

    var data = {

    }
    res.render("overview", {data:data});
});

app.listen(8080, function(){
	console.log("Server running on 8080")
});


