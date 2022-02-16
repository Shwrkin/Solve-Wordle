"use strict"

// Initializing variables for later use
let wordIndex = 0
const wordCount = wordList.length
const letterInPlace = 'letterInPlace'
const letterInWord = 'letterInWord'
const letterNotInWord = 'letterNotInWord'
const unknown = 'unknown'
const taken = 'taken'
const free = 'free'
const numberOfGuesses = 6
let unUsableLetters = []
let locations = []
let lettersInWord = []
for (let i = 0; i < 5; ++i) {
    lettersInWord.push('')
    locations.push('')
}

// Returns the next word in the word list 
function nextWord() {
    ++wordIndex
    return wordList[wordIndex]
}

// Generates a random word from the list
function randomWord() {
    let index = Math.floor(Math.random() * wordCount)
    return String(wordList[index])
}

// Translates the user to the program
function translateUser(placements) {
    let retVal = []
    for (let i = 0; i < placements.length; ++i) {
        switch (placements[i]) {
            case '1':
                retVal.push(letterInPlace)
            case '2':
                retVal.push(letterInWord)
            case '3':
                retVal.push(letterNotInWord)
        }
    }
    console.log(retVal)
    return retVal
}

// Changes the input to a div with the colored word
for (let i = word.length - 1; i >= 0; --i) {
    retHtml = retHtml.slice(0, 5) + `${coloredWord[i]}` + retHtml.slice(5)
}

// Changes the input to a div
event.target.outerHTML = retHtml

// Called when the user presses a key
function keyPress(event) {
    const character = String.fromCharCode(event.which)
    // Ensure the user pressed enter
    if (character !== '\r' && character !== '\n') {
        return
    }

    const word = event.target.value
    const placements = translateUser(word)
    const guess = guessWord(event)

    // Adds another input after the answer was submitted, and makes sure that only 5 submits are possible
    // if ($('#guesses').children().length !== numberOfGuesses) {
    $('#guesses').append(`<div style="width: 3em;">${guess}</div>`)
    $('#guesses').append(`<input type="text" maxlength="${5}" style="width: 3em;"></input>`)
    $('input').focus()
    // }
}

// Ensures the word is usable
function isUsableWord(word) {
    let usable = true

    // Ensures the letter is not in the unUsableLetters list
    for (let i = 0; i < word.length; ++i) {
        if (unUsableLetters.includes(word[i]) && !lettersInWord.includes(word[i]) && word[i] !== locations[i]) {
            usable = false
            break
        }
    }
    // Ensures the correct placements of the letters
    for (let i = 0; i < word.length; ++i) {
        if (word[i] !== locations[i] && locations[i] !== '') {
            usable = false
            break
        }
    }
    // Ensures word has all the letters that are in the word but not the right place
    for (let i = 0; i < word.length; ++i) {
        if (locations[i] !== '') { continue }
        if (word.includes(lettersInWord[i]) === false && lettersInWord[i] !== '') {
            usable = false
            break
        }
    }
    // Ensures the letters that are in the word but not in the right place are used in a different place
    for (let i = 0; i < word.length; ++i) {
        if (word[i] === lettersInWord[i]) {
            usable = false
            break
        }
    }
    return usable
}

// Enters into input the next word in the list that matches the known letters
function guessWord(event) {
    let word = ''
    do {
        word = nextWord()
    } while (!isUsableWord(word))
    event.target.value = word
}

$(document).ready(function () {
    $(document).on('keydown', 'input', keyPress)
    $('#guesses').append(`<input type="text" maxlength="${5}" style="width: 3em;"></input>`)
    $('input').focus()
})