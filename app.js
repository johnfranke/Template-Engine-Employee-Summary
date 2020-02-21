const inquirer = require("inquirer");
const jest = require("jest");
const util = require("util");
const fs = require("fs");

const Employee = require("./lib/Employee");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

//variable for ID and empty arrays for instances for each
var ID = 0;
const Managers = [];
const Engineers = [];
const Interns = [];

//set max listeners so a node error won't show up after a certain number of employees are added
require('events').EventEmitter.defaultMaxListeners = 9999;

//Creating the beginning of the HTML doc
const basehtml =`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" 
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <title>Team Profile Generator</title>
    <style>
.card {
    border-radius: 0px;
    border: 0px;
    box-shadow: 0px 0px 4px 0px #000000;
}
.head {
    box-shadow: 0px 0px 10px 0px #000000;
}
</style>
</head>
<body style="background-color: #255b8d;">
    <h1 class="head col-12 py-4 display-1 font-weight-bold text-center" style="background-color: #ffffff; color: #255b8d";>My Team</h1>
    <div class="row px-5 mx-5 mt-5 justify-content-center">    
    `;
fs.writeFile('index.html', basehtml, (err) => {
    if (err) throw err;
  });


//Prompting users for info and adding user inputs into the arrays
var promptUserForInfo = function () {
    inquirer.prompt(
        [
            {
                message: "Please enter employee name:",
                name: "employeeName"
            },
            {
                type: "list",
                message: "Please choose employee position:",
                choices: ['Manager', 'Engineer', 'Intern'],
                name: "position"
            },
            {
                message: "Please enter employee email:",
                name: "email"
            },
            {
                message: "Please enter office number:",
                name: "officeNumber",
                when: (answers) => answers.position === 'Manager'
            },
            {
                message: "Please enter github profile name:",
                name: "github",
                when: (answers) => answers.position === 'Engineer'
            },
            {
                message: "Please enter school name:",
                name: "schoolName",
                when: (answers) => answers.position === 'Intern'
            },
        ]
    ).then(
        function(answers)
        {
            ID++;
            if (answers.position === 'Manager') {
                var manager = new Manager(ID, answers.employeeName, answers.email, answers.officeNumber);
                Managers.push(manager);
                console.log("Added new manager to employees.");
                closingprompts();
            }
            if (answers.position === 'Engineer') {
                var engineer = new Engineer(ID, answers.employeeName, answers.email, answers.github);
                Engineers.push(engineer);
                console.log("Added new engineer to employees.");
                closingprompts();
            }
            if (answers.position === 'Intern') {
                var intern = new Intern(ID, answers.employeeName, answers.email, answers.schoolName);
                Interns.push(intern);
                console.log("Added new intern to employees.");
                closingprompts();
            }
        }
    );
}
promptUserForInfo();

//This is where it will loop or ends depending on user input and appends the cards to the HTML above
function closingprompts() {
    inquirer.prompt(
        [
            {
                type: "list",
                message: "Enter additional employees?:",
                choices: ['Yes', 'No'],
                name: "continue"
            },
        ]
    ).then(function(answers) {
        if (answers.continue === "Yes") {
            promptUserForInfo(); 
        }
        else {
            for (i = 0; i < Managers.length; i++) {
                var newcard = `
                <div class="card p-0 m-2" style="width: 18rem;">
                    <div class="card-body" style= "background-color: #cedbe3; color: black;">
                        <h2 class="card-title text-center">${Managers[i].name}</h2>
                        <h4 class="card-text text-center"><img src="mgr-icon.png">&nbsp;&nbsp;Manager</h4>
                </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">ID: ${Managers[i].ID}</li>
                        <li class="list-group-item">Email: <a href="mailto:${Managers[i].email}">${Managers[i].email}</a></li>
                        <li class="list-group-item">Office Number: ${Managers[i].officenum}</li>
                    </ul>
                </div>`
                fs.appendFile('index.html', newcard, (err) => {
                    if (err) throw err;
                    console.log('Manager card was appended to html document.');
                  });
            }
            for (i = 0; i < Engineers.length; i++) {
                var newcard = `
                <div class="card p-0 m-2" style="width: 18rem;">
                    <div class="card-body" style= "background-color: #cedbe3; color: black">
                        <h2 class="card-title text-center">${Engineers[i].name}</h2>
                        <h4 class="card-text text-center"><img src="eng-icon.png">&nbsp;&nbsp;Engineer</h4>
                </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">ID: ${Engineers[i].ID}</li>
                        <li class="list-group-item">Email: <a href="mailto:${Engineers[i].email}">${Engineers[i].email}</a></li>
                        <li class="list-group-item">GitHub Profile: <a href="https://github.com/${Engineers[i].github}" target="_blank">${Engineers[i].github}</a></li>
                    </ul>
                </div>`
                fs.appendFile('index.html', newcard, (err) => {
                    if (err) throw err;
                    console.log('Engineer card was appended to html document.');
                  });
            }
            for (i = 0; i < Interns.length; i++) {
                var newcard = `
                <div class="card p-0 m-2" style="width: 18rem;">
                    <div class="card-body" style= "background-color: #cedbe3; color: black">
                        <h2 class="card-title text-center">${Interns[i].name}</h2>
                        <h4 class="card-text text-center"><img src="int-icon.png">&nbsp;&nbsp;Intern</h4>
                </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">ID: ${Interns[i].ID}</li>
                        <li class="list-group-item">Email: <a href="mailto:${Interns[i].email}">${Interns[i].email}</a></li>
                        <li class="list-group-item">School: ${Interns[i].school}</li>
                    </ul>
                </div>`
                fs.appendFile('index.html', newcard, (err) => {
                    if (err) throw err;
                    console.log('Intern card was appended to html document.');
                  });
            }

        }
    });
};