/* TODO: 
    1. Improve the function guessWord()
    2. Make this program work with the site wordle
*/
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
const wordle = randomWord()
const numberOfGuesses = 6
const letters = /^[a-z]+$/
let unUsableLetters = []
let locations = []
let lettersInWord = []
for (let i = 0; i < wordle.length; ++i) {
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

// Checks to see what letter of the word provided are in the correct place and to see if they are in the wordle
function checkWord(word) {
    let retVal = []
    let unusedLetters = []

    // Checks to see if the letter is matching the letter and the place
    for (let i = 0; i < word.length; ++i) {
        if (word[i] === wordle[i]) {
            retVal.push(letterInPlace)
            locations[i] = word[i]
        } else {
            retVal.push(unknown)
            unusedLetters.push(wordle[i])
        }
    }
    // Checks to see if the letters not matching the place are found in the word
    for (let i = 0; i < word.length; ++i) {
        if (retVal[i] !== unknown) { continue }
        if (unusedLetters.includes(word[i])) {
            retVal[i] = letterInWord
            const index = unusedLetters.indexOf(word[i])
            unusedLetters.splice(index, 1)
            lettersInWord[i] = word[i]
        }
        // Says the letter is not in the word
        else {
            retVal[i] = letterNotInWord
            unUsableLetters.push(word[i])
        }
    }
    return retVal
}
// Called when the user presses a key
function keyPress(event) {
    const character = String.fromCharCode(event.which)
    const word = event.target.value
    const placements = checkWord(word, wordle)
    const coloredWord = colorWord(word, placements)
    let retHtml = `<div></div>`
    // Ensure the user pressed enter
    if (character !== '\r' && character !== '\n') {
        return
    }
    // Ensure the word is the same length as the wordle
    if (word.length !== wordle.length) {
        alert('Word must be 5 characters long')
        event.target.value = ''
        return
    }
    // Ensure the word is made only from letters
    if (word.match(letters) === null) {
        alert('Word must contain only lowercase alphabet letters')
        event.target.value = ''
        return
    }
    // Ensure the word is in the possibleWords list
    if (possibleWords.includes(word) === false) {
        alert(`${word} is not a word`)
        event.target.value = ''
        return
    }
    // Changes the input to a div with the colored word
    for (let i = word.length - 1; i >= 0; --i) {
        retHtml = retHtml.slice(0, 5) + `${coloredWord[i]}` + retHtml.slice(5)
    }
    // Changes the input to a div
    event.target.outerHTML = retHtml
    // Adds another input after the answer was submitted, and makes sure that only 5 submits are possible
    if ($('#guesses').children().length !== numberOfGuesses) {
        $('#guesses').append(`<input type="text" maxlength="${wordle.length}" style="width: 3em;"></input>`)
        $('input').focus()
    }
}

// Says which characters are at the right place
function colorWord(word, placements) {
    let retVal = []
    for (let i = 0; i < word.length; ++i) {
        let colorClass = ''
        switch (placements[i]) {
            case letterInPlace:
                colorClass = 'text-success'
                break;
            case letterInWord:
                colorClass = 'text-warning'
                break;
            case letterNotInWord:
                colorClass = 'text-secondary'
                break;
        }
        retVal.push(`<span class="${colorClass} fs-1">${word[i]}</span>`)
    }
    return retVal
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
    $("#word").text(wordle)
    $(document).on('keydown', 'input', keyPress)
    $(document).on('focus', 'input', guessWord)
    $('#guesses').append(`<input type="text" maxlength="${wordle.length}" style="width: 3em;"></input>`)
    $('input').focus()
})