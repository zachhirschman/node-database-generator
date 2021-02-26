const userData = require('./api/userData.json');
const Database = require('./database');
const readline = require('readline');
const ora = require('ora');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let database = null;

const functionLibrary = {
    "create database":() => {
        rl.question("Welcome to the Z Database Selector. Enter a name for your database: ", (name) => {
            name = name || `DB0X-${(((1+Math.random())*0x10000)|0).toString(16).substring(1)}`;
        
            rl.question(`Enter a User Name for ${name}: `, (user_name) => {
        
                rl.question(`Enter a password for ${name}:`, (password) => {
                    const generation_throbber = ora(`\nGenerating database ... `).start();
        
                    new Database({
                        name,
                        user_name,
                        password
                    }).then(response =>{
                        console.log('Created Database: ', response);
                        database = response.database;
                        generation_throbber.succeed();
                        console.log(response.message);
                    })
                })
            })
        })
    },
    "authenticate":() => {
        rl.question('Please enter your user name: ', (unverified_user_name) => {
            rl.question('Please enter your password: ', (unverified_password) => {

                const authenticate_throbber = ora(`\nAuthentication in process ... `).start();
                database.authenticate({ user_name: unverified_user_name, password: unverified_password }).then((success) => {
                    authenticate_throbber.succeed();
                    console.log(`\n${success.message}`);
                }).catch((error) => {
                    authenticate_throbber.fail();
                    console.log(`\n${error.message}`);
                });
            });
        });
    },
    "insert data": () => {
        rl.question('Please enter a table name: ', (table) => {
            rl.question('Please enter some data (JSON): ', (data) => {

                const authenticate_throbber = ora(`\nInserting data... `).start();
                database.insertData({ table, data }).then((success) => {
                    authenticate_throbber.succeed();
                    console.log(`\n${success.message}`);
                }).catch((error) => {
                    console.log('Error: ', error);
                    authenticate_throbber.fail();
                    console.log(`\n${error.message}`);
                });
            });
        });
    }
};

function Action (description, command) {
    this.Description = description;
    this.Command = command;
}

console.log('Welcome to the ZH Database Generator. Please enter a command from the ');

// TODO: Do this automatically by iterating over the function library
console.table(
    [
        new Action('Create a table','create database'),
        new Action('Authenticate to the currently created database','authenticate'),
        new Action('Add a table with data to the currently created database', 'insert data')
    ]
);
rl.on('line', (response) => {
    const action = functionLibrary[response];
    if(typeof action === 'function'){
        action();
    }
    else{
        console.log('Unable to find that command. Please try again.');
    }
});

rl.on("close", function() {
    console.log("\nThank you for using our Database Generator service. Goodbye.");
    process.exit(0);
});