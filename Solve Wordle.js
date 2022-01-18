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

// Checks the function checkWord()
function testCheckWord(word, hiddenWord, expectedResult) {
    const checkWordResult = JSON.stringify(checkWord(word, hiddenWord))
    const expectedResultResult = JSON.stringify(expectedResult)

    if (checkWordResult !== expectedResultResult) {
        console.log(`Expected output: ${expectedResultResult}\nOutput received: ${checkWordResult}\nInputs were word: ${word}, hiddenWord: ${hiddenWord}`)
    }
}

// Some tests for the function CheckWord
testCheckWord('aaa', 'aaa', [letterInPlace, letterInPlace, letterInPlace])
testCheckWord('abc', 'aaa', [letterInPlace, letterNotInWord, letterNotInWord])
testCheckWord('aaa', 'abc', [letterInPlace, letterNotInWord, letterNotInWord])
testCheckWord('adbac', 'aabbc', [letterInPlace, letterNotInWord, letterInPlace, letterInWord, letterInPlace])
testCheckWord('aadbb', 'abcba', [letterInPlace, letterInWord, letterNotInWord, letterInPlace, letterInWord])
testCheckWord('babab', 'aabba', [letterInWord, letterInPlace, letterInPlace, letterInWord, letterNotInWord])



$(document).ready(function () {
    $("#word").text(randomWord())
    $("#1").text()
    $("#2").text()
    $("#3").text()
    $("#4").text()
    $("#5").text()
})