// Start Global Variables
let gamename = "Guess The Word";
// Inner - Start Global Numbers
let numberOfTries = 5;
let numberofLetters = 5;
let numberOfHints = 3;
let currentTry = 1;
let failsNumber = 0;
// Inner - End Global Numbers
let guessButton = document.querySelector(".check");
let hintButton = document.querySelector(".hint");
let activeDivInputs = "";
let wordsArray = ["MySQL", "Mongo", "React", "Vuejs", "Words", "Plant", "Water"];
let wordToGuess = wordsArray[Math.trunc(Math.random() * wordsArray.length)].toLowerCase();
let messageArea = document.getElementById("message");
let hintSpan = document.querySelector(".hint span");
hintSpan.innerHTML = numberOfHints;
// let guessButton = document.getElementsByClassName(".check")[0]; Has Problems With Some Events
// End Global Variables
// Start Direct Naming DOM
document.title = gamename;
document.getElementById("h1").innerHTML = gamename;
document.getElementById("footer").prepend(document.createTextNode(gamename + " Game Created By "));
document.getElementById("footer-span").textContent = "Elzero Web School";
document.getElementById("footer").append(document.createTextNode("Implemented By "));
let myName = document.createElement("span");
myName.textContent = "Abdallah Medhat";
document.getElementById("footer").appendChild(myName);
// End Direct Naming DOM
// Start Functions
function disablingInputs() {
    let disabledInputs = document.querySelectorAll(".disabled-inputs input");
    disabledInputs.forEach(input => {
        let attr = document.createAttribute("disabled");
        input.setAttributeNode(attr);
        // input.disabled = true; Other Better Way
    })
}
function inputStyling() {
    let inputs = document.querySelectorAll("input");
    for (let i = 0; i < inputs.length; ++i) {
        // Asking MySelf: Why This Event And The One Below Works Even Though it the function only called one time ?
        inputs[i].oninput = function () {
            // console.log(this);
            this.value = this.value.toUpperCase();
            if (this.value !== "") {
                this.style.cssText = "border: none;";
                this.blur();
                if (i !== inputs.length - 1) inputs[i + 1].focus();
            } else {
                this.style.cssText = "border: none;";
                this.blur();
                if (i !== 0) inputs[i - 1].focus();
            }
        }
        inputs[i].onkeydown = function (event) {
            // let currentIndex = inputs.indexOf(event.target); Search Why This One Doesn't Work
            let currentIndex = [...inputs].indexOf(event.target);
            // We Want To Config This Condtion Below Later
            if (event.key === "ArrowRight") {
                event.target.blur();
                inputs[currentIndex + 1].focus();
            } else if (event.key === "ArrowLeft" && currentIndex !== 0) {
                event.target.blur();
                inputs[currentIndex - 1].focus();
            } else if (event.key === "Backspace") {
                this.value = "";
                if (currentIndex !== 0) {
                    this.blur();
                    inputs[currentIndex - 1].focus();
                }
                // IMPORTANT: This One Essential Because it prevents The BackSpace From Removing The Value of the previous input too after reaching it
                event.preventDefault();
            }
        }
    }
}
function generateInputs() {
    let inputsContainer = document.getElementsByClassName("inputs")[0];
    for (let i = 1; i <= numberOfTries; ++i) {
        let tryDiv = document.createElement("div");
        tryDiv.classList.add("try-" + i);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;
        if (i !== 1) tryDiv.classList.add("disabled-inputs");
        for (let j = 1; j <= numberOfTries; ++j) {
            let input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            tryDiv.appendChild(input);
        }
        inputsContainer.appendChild(tryDiv);
    }
    inputsContainer.children[0].children[1].focus();
    disablingInputs();
    inputStyling();
}
window.onload = function () {
    generateInputs(); 
}
console.log(wordToGuess);
function handleGuess() {
    let succesGuess = true;
    let allTries = document.querySelectorAll(".inputs > div");
    for (let i = 1; i <= numberofLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];
        if (actualLetter === letter) {
            inputField.classList.add("in-place");
        } else if (wordToGuess.includes(letter) && letter !== "") {
            inputField.classList.add("not-in-place");
            succesGuess = false;
        } else {
            inputField.classList.add("wrong");
            succesGuess = false;
        }
    }
    if (succesGuess) {
        document.getElementById("won").play();
        messageArea.innerHTML = `You Won After <span>${failsNumber}</span> fails`;
        allTries.forEach(tryDiv => tryDiv.classList.add("disabled-inputs"));
        guessButton.disabled = true;
        hintButton.disabled = true;
    } else {
        failsNumber++;
            document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
            currentTry++;
        if (currentTry <= allTries.length) {
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            let inputs = document.querySelectorAll("input");
            inputs.forEach(input => input.disabled = false);
            // Its Position Must Be After The disabled = false because focus will not work if the input is disabled
            document.querySelector(`.try-${currentTry} input:first-of-type`).focus();
        } else {
            messageArea.innerHTML = `You Failed The Word is: <span>${wordToGuess}</span>`;
            document.getElementById("fail").play();
            guessButton.disabled = true;
            hintButton.disabled = true;
        }
    }
}
document.onkeydown = function (event) {
    if (event.key === "Enter") {
        guessButton.click();
    }
}
guessButton.addEventListener("click", handleGuess);
guessButton.addEventListener("click", disablingInputs);
function hinting() {
    let NotDisabledInputs = document.querySelectorAll(".inputs > div:not(.disabled-inputs) input");
    if (numberOfHints !== 0) {
        let randomIndex = Math.trunc(Math.random() * wordToGuess.length);
        console.log(NotDisabledInputs);
        let randomInput = NotDisabledInputs[randomIndex];
        // console.log(`This is randomIndex ${randomIndex}`);
        if (randomInput.value !== "") {
            /* Function Recurion Explain: IfThe Input Is Not Empty
                The Function Will Recall Itself Until The Condition Mets, So The else Will Work
            */
            /* NOTE: If You Didn't give specific amount if hints; Once All Inputs Are Filled, An Infinite Function Recursion Will Happen
                    Imagine It As A Loop That Doesn't Have a Condition To Break, an infinite loop will happen
                    And Here In The Example The Condition To Stop The Recursion Is When Going To else
            */
            hinting();
        } else {
            numberOfHints--;
            randomInput.value = wordToGuess[randomIndex].toUpperCase();
            randomInput.style.border = "none";
            hintSpan.innerHTML = numberOfHints;
        }
    } 
    if (numberOfHints === 0) {
        hintButton.disabled = true;
    }
}
function hintFocusInput() {
    if (numberOfHints < 3) {
        let inputs = document.querySelectorAll("input");
        for (let i = 0; i < inputs.length; ++i) {
            inputs[i].oninput = function () {
                this.value = this.value.toUpperCase();
                if (this.value !== "") {
                    this.style.cssText = "border: none;";
                    this.blur();
                    for (let j = i; j < inputs.length; ++j) {
                        if (inputs[j].value === "") {
                            inputs[j].focus();
                            break;
                        }
                    }
                }
            }
        }
    }
}
hintButton.addEventListener("click", hinting);
hintButton.addEventListener("click", hintFocusInput);
// Submitting On Clicking Enter
// End Functions