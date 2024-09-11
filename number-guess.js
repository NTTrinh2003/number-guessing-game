// Random Number Generator From 1 to 100    
const prompt = require("prompt-sync")({sigint: true});
const data = require("./data.json");
const fs = require("fs");

function displayHints(randomNumber, attempts) {
    if (attempts == 0) {
        console.log(`Hints: ${data.hints[randomNumber % 2]}`);
    } else if (attempts == 1) {
        if (randomNumber % 3 == 0) {
            console.log(`Hints: ${data.hints[2]}`);
        } else {
            console.log(`Hints: NOT ${data.hints[2]}`);
        }
    } else if (attempts == 2) {
        if (randomNumber % 5 == 0) {
            console.log(`Hints: ${data.hints[3]}`);
        } else {
            console.log(`Hints: NOT ${data.hints[3]}`);
        }
    }
}

function startGame(maxAttempts, randomNumber, startTime, timer) {
    let userGuess = 0;
    let timeElapsed = 0;
    let attempts = 0;
    let win = false;
    for (; attempts < maxAttempts; attempts++) {
        userGuess = prompt(`Guess ${attempts + 1}: Guess a number between 1 and 100: `);
        timeElapsed = Date.now() - startTime;
        if (timeElapsed > timer) {
            console.log(`Time's up! You didn't guess the number in time.\n`);
            break;
        }
        if (userGuess == randomNumber) {
            console.log(`Congratulations! You guessed the correct number in ${attempts + 1} attempts and ${timeElapsed / 1000} seconds.\n`);
            win = true;
            break;
        } else if (attempts == maxAttempts - 1) {
            console.log(`Sorry, you didn't guess the number. It was ${randomNumber}.\n`);
            break;
        }
        if (userGuess < randomNumber) {
            console.log(`Incorrect! The number is higher than ${userGuess}\n`);
        } else {
            console.log(`Incorrect! The number is lower than ${userGuess}\n`);
        }
        displayHints(randomNumber, attempts);
    }
    return [win, timeElapsed];
}

function game() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    let mode = prompt("Choose a mode: 1.easy, 2.medium, 3.hard: ");
    let userMode = parseInt(mode);
    let maxAttempts = 0;
    let timer = 0;
    switch (userMode) {
        case 1:
            maxAttempts = data.mode[0].maxAttempts;
            timer = data.mode[0].timer;
            console.log(`You chose easy mode(${maxAttempts} attempts, ${timer / 1000} seconds).\n`);
            break;
        case 2:
            maxAttempts = data.mode[1].maxAttempts;
            timer = data.mode[1].timer;
            console.log(`You chose medium mode(${maxAttempts} attempts, ${timer / 1000} seconds).\n`);
            break;
        case 3:
            maxAttempts = data.mode[2].maxAttempts;
            timer = data.mode[2].timer;
            console.log(`You chose hard mode(${maxAttempts} attempts, ${timer / 1000} seconds).\n`);
            break;
        default:
            console.log("Invalid mode.");
            return;
    }
    let startTime = Date.now();
    let [win, timeElapsed] = startGame(maxAttempts, randomNumber, startTime, timer);
    let score = timer - timeElapsed;
    if (win) {
        switch (userMode) {
            case 1:
            if (score / 100 > data.highscores[0].score) {
                data.highscores[0].score = score / 100;
                console.log(`Congratulations! You have set a new high score for easy mode!\n`);
            }
            break;
            case 2:
            if (score / 50 > data.highscores[1].score) {
                data.highscores[1].score = score / 50;
                console.log(`Congratulations! You have set a new high score for medium mode!\n`);
            }
            break;
            case 3:
            if (score / 25 > data.highscores[2].score) {
                data.highscores[2].score = score / 25;
                console.log(`Congratulations! You have set a new high score for hard mode!\n`);
            }
                break;
        };
        fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
    }
}

function main() {
    let playAgain = true;
    while (playAgain) {
        game();
        playAgain = prompt("Do you want to play again? (y/n): ");
        if (playAgain == "n" || playAgain == "no") {
            playAgain = false;
            break;
        } else if (playAgain != "y" || playAgain != "yes") {
            console.log("Invalid input.");
            playAgain = false;
            break;
        } else {
            playAgain = true;
        }
    }
}

main();
