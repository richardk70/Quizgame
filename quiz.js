"use strict"

// the questions
var allQuestions = [
    {
        question: "What is the longest river in the world?", 
        choices: ["The Amazon", "The Mississippi", "The Congo", "The Nile", "The Yellow River"], 
        correctAnswer:3
    },
    {
        question: "What is the largest country, in terms of land area, in the world?", 
        choices: ["China", "Russia", "Asia", "Africa", "United States"], 
        correctAnswer:1
    },
    {
        question: "What is the largest creature (alive today) in the world?", 
        choices: ["Grey whale", "African Elephant", "Blue Whale", "Godzilla"], 
        correctAnswer:2
    },
    {
        question: "What is the largest organ of the human body?", 
        choices: ["Stomach", "Liver", "Skin", "Brain"], 
        correctAnswer:2
    },
    {
        question: "Who was the second president of the United States?", 
        choices: ["George Washington", "Alexander Hamilton", "Abraham Lincoln", "John Adams"], 
        correctAnswer:3
    },
    {
        question: "Who was the second person to walk on the moon?", 
        choices: ["Buzz Lightyear", "Neil Armstrong", "Jim Shepperd", "Buzz Aldren"], 
        correctAnswer:3
    },
    {
        question: "In what state is the Kentucky Derby?", 
        choices: ["Kentucky", "South Carolina", "Virginia", "Tennessee"], 
        correctAnswer:0
    },
    {
        question: "What is the smallest bone in the human body?", 
        choices: ["The stirrup", "The hammer", "The anvil", "End of the pinky bone"], 
        correctAnswer:0
    },
    ];

// SUBMIT button styling
var submit = document.getElementById('submit');
submit.addEventListener('mousedown',()=>{
    submit.classList.remove('nope');
    submit.classList.remove('yup');
    submit.classList.add('mousedown');
});
submit.addEventListener('mouseup', ()=>{
    submit.classList.remove('mousedown');
    findChoice();
});

var curr = 0; // begin on the first question
var score = 0;
var guessCount = 1;
var guesses = document.getElementById('guessField');

// loading the current question and choices
function loadQnAs(curr){
    guesses.style.color = guessColor(guessCount);
    guesses.innerHTML = guessCount + '/3';
    
    var question = document.getElementById('question');
    question.textContent = allQuestions[curr].question;

    var choiceList = document.getElementsByTagName('ul')[0];

    var str="";
    for (var i = 0; i < allQuestions[curr].choices.length; i++){
        str += "<li><input type='radio' name='answer'>" + allQuestions[curr].choices[i] + "</li>";
    }
    choiceList.innerHTML = str;
}

function guessColor(count){
    if (count===1)
        return 'black';
    if (count===2)
        return 'orange';
    if (count===3)
        return 'red';
}

// scan radio buttons for checked one
function findChoice(){
    var choices = document.getElementsByTagName('input');
    for (var i = 0; i < choices.length; i++){
        if (choices[i].checked == true)
            checkAnswer(i);
    }
}

function checkAnswer(num){
    var scoreField = document.getElementById('scoreField');
    // if CORRECT
    if (num===allQuestions[curr].correctAnswer){
        score++;
        submit.classList.add('yup');
        guessCount = 1;
        curr++;
    }
    // if WRONG
    else {
        submit.classList.add('nope');
        guessCount++;
        if (guessCount <= 3)
            ;
        else{
            curr++;
            guessCount = 1;
            score--;
        }
    }
    scoreField.textContent = score;
    if (curr < allQuestions.length)
        loadQnAs(curr);
    else
        finish();
}

function finish(){
    submit.disabled = true;
    var modal = document.getElementById('modal');
    modal.style.display = 'block';
    var str = "<p>Your score: " + score + "</p>";
    if (score === allQuestions.length)
        str+= "<p>Perfect!</p>";
    if (score === allQuestions.length - 1 || score === allQuestions.length - 2)
        str+= "<p>Pretty good.</p>";
    if (score<=score === allQuestions.length - 3)
        str+= "<p>Lame.</p>";
    var modalText = document.getElementById('modal-score');
    modalText.innerHTML = str;
    document.getElementById('again').addEventListener('click', ()=>{
        modal.style.display = 'none';        
        curr = 0; // begin on the first question
        score = 0;
        guessCount = 1;
        scoreField.textContent = score;
        submit.disabled = false;
        loadQnAs(curr);
    });
}

loadQnAs(curr);