const readline = require('readline')
const Image = require('ascii-art-image')

const polls = require('./polls.json')

const max = 20
let object
let correct = 0
let incorrect = 0
let total = 0

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function awaitInput(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        getResult(ans)
    }))
}

function pause(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close()
    }))
}

async function askQuestion(){
    const int = getRandomInt(max)
    object = polls[int]

    console.clear()
    
    let image = new Image({
        filepath: 'icon.png',
        alphabet: 'variant4'
    });
    
    image.write(function(err, rendered){
        console.log(rendered)
    })

    setTimeout(async () => {
        console.log(object.question)
        console.log('')
        console.log(`"${object.choices[0].name}" OR "${object.choices[1].name}"`)
        console.log('')
        console.log('')
        await awaitInput('Type your answer below: ')
    }, 500);
}

async function getResult(ans){
    let finalAnswer
    if(ans.toLowerCase() === object.choices[0].name.toLowerCase()){
        finalAnswer = 0
    } else if(ans.toLowerCase() === object.choices[1].name.toLowerCase()){
        finalAnswer = 1
    } else {
        console.log('Your response isn\'t one of the options! Let\'s try a new question.')
        setTimeout(() => {askQuestion()}, 5000);
        return
    }

    total++

    if(finalAnswer === 0 && object.choices[0].ratio > object.choices[1].ratio){
        console.log('')
        console.log('That was the correct choice!')
        correct++
    } else if(finalAnswer === 0 && object.choices[0].ratio < object.choices[1].ratio){
        console.log('')
        console.log('That was the incorrect choice...')
        incorrect++
    } else if(finalAnswer === 1 && object.choices[1].ratio > object.choices[0].ratio){
        console.log('')
        console.log('That was the correct choice!')
        correct++
    } else if(finalAnswer === 1 && object.choices[1].ratio < object.choices[0].ratio){
        console.log('')
        console.log('That was the incorrect choice...')
        incorrect++
    }

    console.log('')
    console.log('Results:')
    console.log(`"${object.choices[0].name}" - ${object.choices[0].ratio}% | "${object.choices[1].name}" - ${object.choices[1].ratio}%`)
    console.log(`${correct} correct out of ${total} questions`)
    console.log(`${incorrect} incorrect out of ${total} questions`)
    setTimeout(() => {askQuestion()}, 5000);
}

console.clear()

let image = new Image({
    filepath: './icon.png',
    alphabet: 'variant4'
});

image.write(function(err, rendered){
    console.log(rendered)
})

setTimeout(async () => {
    console.log('')
    console.log('Welcome to Opinions!')
    console.log('')
    console.log('In this game, you\'ll be asked a question, and you have to guess what the most voted result is.')
    console.log('')
    console.log('To quit the game, press Ctrl+C')
    console.log('')
    console.log('The game will begin in 10 seconds')
    
    setTimeout(() => {
        askQuestion()
    }, 10000);
}, 1000);

process.on('beforeExit', () => {
    console.clear()
    console.log('Credits:')
    console.log('Game by The0Show (https://the0show.github.io)')
    console.log('Questions from Everybody Votes Channel (https://rc24.xyz/goodies/vote/049_english_results.html)')
    console.log('Copyright 2021 The0Show. All rights reserved.')
    console.log('')
    console.log('Thanks for playing!')
})