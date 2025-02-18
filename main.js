var row = 0;
var gridWidth = 5;
var increaseI = 0;
var randomWord = '';
var validWord = 0;
//define some elements
/////window controllers

document.getElementById('minimizeb').addEventListener('click', () => {
    window.electron.minimize();
});
document.getElementById('maximizeb').addEventListener('click', () => {
    window.electron.maximize();
});
document.getElementById('closeb').addEventListener('click', () => {
    window.electron.close();
});




function wordGen(){
fetch('words.json')
    .then(response => response.json())
    .then(data => {
        const words = data.words;
        const randomInt = Math.floor(Math.random() * 500);
        randomWord = words[randomInt];
    })
}
window.onload = function(){
    wordGen();
    var nextIndex = null;
    document.querySelectorAll('.guess').forEach((input, index, inputs) => {
        const gridWidth = 5;
        input.addEventListener('input', function(){
            if (input.value !== "" && index < inputs.length -1){
                nextIndex = index +1
                if (nextIndex % gridWidth !== 0){
                    inputs[nextIndex].focus();
                }
            }
        })
    })
    
    
    document.addEventListener("keydown", function(event){
        if(event.key === 'Enter'){
            console.log(row);
            validateWord();
        }
    });
    document.addEventListener('keydown', function(backspace){
        var guess = document.querySelectorAll('.guess');
        var currentFocus = Array.from(guess).indexOf(document.activeElement);
        if(backspace.key === "Backspace" && currentFocus > 0){
            if (guess[currentFocus].value.trim() !== ""){
                guess[currentFocus].value == "";

            } else if (currentFocus > 0) {
                guess[currentFocus -1].focus();
            }
        }
    })
    
};



function submit(){
    var letterInput = document.querySelectorAll('.guess');
    var checkFields = 0;
    var allFilled = 0;
    var guess = document.querySelectorAll('.guess');
    var currentFocus = Array.from(guess).indexOf(document.activeElement);
    for (let i = 0; i < gridWidth; i++){
        if (letterInput[i + increaseI].value !== '' && checkFields < 5){
            checkFields += 1;
        }
    }
    if (checkFields >= gridWidth){
        allFilled = 1;
    } else {
        allFilled = 0;
    }
    if (allFilled === 1 && validWord === 1){
        [...letterInput].slice(increaseI, increaseI +5).forEach(input => {
            input.readOnly = true;
        });
        checker(letterInput);
        row += 1;
        increaseIndex();
        if (row < 5){
        guess[currentFocus +1].focus();
        }
    } else if (validWord === 0){
        notification();
    }
}

function checker(letterInput){
    var letterInput = document.querySelectorAll('.guess');
    letterCheck(letterInput);
}

function letterCheck(letterInput){
    var letterInput = document.querySelectorAll('.guess');
    var boxes = document.querySelectorAll('.box');
    var string = Array.from(letterInput).map(input => input.value.toLowerCase());
    var word = Array.from(randomWord);
    var match = [];
    string = string.slice(increaseI, increaseI +5);
    console.log(string);
    console.log(word);
    for (let i =0;i < 5; i++){
        if (word[i] === string[i]){
            match[i + increaseI] = true;
        } else {
            match[i + increaseI] = false;
        }
        
    }
    for (let i= 0; i < 5; i++){
        if (match[i + increaseI] === true){
            if (match.every(Boolean) && row <= 5){
                console.log('victory');
                letterInput[i + increaseI].style.backgroundColor = "green";
                boxes[i + increaseI].style.backgroundColor = 'green';
                document.getElementById('con_con').style.display = 'block';
                blurBackground();
                setTimeout(function(){
                    victory();
                }, 1000);
            } else {
            letterInput[i +increaseI].style.backgroundColor = "green";
            boxes[i + increaseI].style.backgroundColor = 'green';
            }
        } else if (row === 4){
            console.log("loser check");
            if (match.every(Boolean)){
                victory();
            } else {
                loser();
                break;
            }
        } else if (match[i +increaseI] === false) {
            if (word.includes(string[i])) {
                letterInput[i + increaseI].style.backgroundColor = 'yellow';
                boxes[i + increaseI].style.backgroundColor = 'yellow';
            } else {
                letterInput[i + increaseI].style.backgroundColor = 'red';
                boxes[i + increaseI].style.backgroundColor = 'red';
            }
        } 
} 
        console.log(word);
        console.log(string)
}

function increaseIndex(){
    increaseI += gridWidth;
}

function victory(){
    var popup = document.getElementById('popup');
    var title = document.getElementById('title');
    popup.style.display = 'block';
    title.style.display = 'none';
    
}

function minimize(){
    title.style.display = 'block';
    let pop = document.getElementById('lose')
    document.getElementById('grid').style.filter = 'none';
    console.log('minimizing');
    popup.style.display = 'none';
    lose.style.display = 'none';
    document.getElementById('start').style.display = 'block';
    document.querySelectorAll('.guess').forEach(input => {
        input.readOnly = true;
    })
}


function reset(){
    loseText.innerHTML = "";
    loseText.innerHTML = "You lost! :( <br> Thank you for playing my game! <br><br> Click  ' <p1 id = 'makeRed'>X</p1> '  to start a new game <br><br> Your word was: ";
    title.style.display = 'block';
    document.getElementById('grid').style.filter = 'none';
    let pop = document.getElementById('lose')
    pop.style.display = 'none';
    document.getElementById('con_con').style.display = 'none';
    document.getElementById('start').style.display = 'none';
    console.log('restarting game');
    popup.style.display = 'none';
//reset variables
    increaseI = 0;
    row = 0;
    word = '';
    randomWord= ''; 
//clear areas and attributes
    document.querySelectorAll('.box').forEach(box =>{
        box.style.backgroundColor = '';
    })
    document.querySelectorAll('.guess').forEach(box => {
        box.style.backgroundColor = '';
    });
    document.querySelectorAll('.guess').forEach(input =>{
        input.value = '';
        input.style.backgroundColor = '';
        input.readOnly = false;
    });
    wordGen();
    let g = document.querySelectorAll('.guess')
    g[0].focus();
}
function loser(){
    title.style.display = 'none';
    blurBackground();
    let pop = document.getElementById('lose')
    let loseText = document.getElementById('loseText');
    console.log(randomWord);
    loseText.innerHTML += randomWord;
    console.log(randomWord);
    pop.style.display = 'block';
}

function blurBackground(){
    document.getElementById('grid').style.filter = 'blur(2px)'
    document.getElementById('popup').style.filter = 'none';
    document.getElementById('lose').style.filter = 'none';
}

async function validateWord(){
    var letterInput = document.querySelectorAll('.guess');
    var string = Array.from(letterInput)
        .map(input => input.value.toLowerCase())
        .join("");
    string = string.slice(increaseI, increaseI +5);
    const word = string
    const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' +word;
    try {
    const response = await fetch(url);
    console.log(response.status)
    if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0){
            validWord = 1;
        } else {
            validWord = 0;
        }
    } else if (response.status === 404){
        validWord = 0;
        console.log('invalid word')
    } else {
        console.log ('unexpected error; response status = ' +response.status);
    }
    } catch (error) {
        console.error('ERROR: ' +error.message
        )
    }
console.log('test');
    submit();
}


function notification(){
    document.getElementById('noti').style.display = 'block'
    setTimeout(() => {
        document.getElementById('noti').style.display = 'none'
    }, 750);
}

