/* TODO: 
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

// Checks to see what letter of the word provided are in the correct place and to see if they are in the hidden word
function checkWord(word, hiddenWord) {
    let retVal = []
    let unusedLetters = []

    // Checks to see if the letter is matching the letter and the place
    for (let i = 0; i < hiddenWord.length; ++i) {
        if (word[i] === hiddenWord[i]) {
            retVal.push(letterInPlace)
        } else {
            retVal.push(unknown)
            unusedLetters.push(hiddenWord[i])
        }
    }
    // Checks to see if the letters not matching the place are found in the word
    for (let i = 0; i < word.length; ++i) {
        if (retVal[i] !== unknown) { continue }
        if (unusedLetters.includes(word[i])) {
            retVal[i] = letterInWord
            const index = unusedLetters.indexOf(word[i])
            unusedLetters.splice(index, 1)
        }
        // Says the letter is not in the word
        else {
            retVal[i] = letterNotInWord
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
    // Ensure the word is 5 letters long
    if (word.length !== 5) {
        alert('Word must be 5 characters long')
        return
    }
    // Ensure the word is made only from letters
    if (word.match(letters) === null) {
        alert('Word must contain only lowercase alphabet letters')
        return
    }
    // Ensure the word is in the possibleWords list
    if (possibleWords.includes(word) === false) {
        alert(`${word} is not a word`)
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
        $('#guesses').append('<input type="text" maxlength="5" style="width: 3em;"></input>')
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

// Checks the function checkWord()
function testCheckWord(word, hiddenWord, expectedResult) {
    const checkWordResult = JSON.stringify(checkWord(word, hiddenWord))
    const expectedResultResult = JSON.stringify(expectedResult)

    if (checkWordResult !== expectedResultResult) {
        console.log(`Expected output: ${expectedResultResult}\nOutput received: ${checkWordResult}\nInputs were word: ${word}, hiddenWord: ${hiddenWord}`)
    }
}

function testColorWord(word, placements, expected) {
    const actual = colorWord(word, placements)
    if (expected.join() !== actual.join()) {
        console.log(`Expected output: ${expected}\nOutput received: ${actual}`)
    }
}

// Some tests for the function CheckWord
testCheckWord('aaa', 'aaa', [letterInPlace, letterInPlace, letterInPlace])
testCheckWord('abc', 'aaa', [letterInPlace, letterNotInWord, letterNotInWord])
testCheckWord('aaa', 'abc', [letterInPlace, letterNotInWord, letterNotInWord])
testCheckWord('adbac', 'aabbc', [letterInPlace, letterNotInWord, letterInPlace, letterInWord, letterInPlace])
testCheckWord('aadbb', 'abcba', [letterInPlace, letterInWord, letterNotInWord, letterInPlace, letterInWord])
testCheckWord('babab', 'aabba', [letterInWord, letterInPlace, letterInPlace, letterInWord, letterNotInWord])

// Some more tests for function colorWord
testColorWord('aaaaa', [letterNotInWord, letterNotInWord, letterNotInWord, letterNotInWord, letterNotInWord], [
    '<span class="text-secondary fs-1">a</span>',
    '<span class="text-secondary fs-1">a</span>',
    '<span class="text-secondary fs-1">a</span>',
    '<span class="text-secondary fs-1">a</span>',
    '<span class="text-secondary fs-1">a</span>'
])


$(document).ready(function () {
    $("#word").text(wordle)
    $(document).on('keydown', 'input', keyPress)
})