// global variables
let allQs = [];
let currQ = 0, currentQuiz = "";
let questions, quizQuestions = 0;
let userAnswer;
const card = document.getElementById('card');
const welcome = document.getElementById('welcome');
const radios = document.getElementById('radios');
const catBtns = document.getElementById('subjects');
const navBtns = document.getElementById('nav-buttons');

// show the categories as buttons
function showCats(){

    // clear out the button area
    radios.innerHTML = "";
    catBtns.innerHTML = "";
    navBtns.innerHTML = "";

    // splits out all the categories
    var categories = allQs.map( (el) => {
        return el.category;
    });
    
    // returns only the unique categories
    var uniques = Array.from(new Set(categories));
    
    // capitalize the first letter of each category
    for (var i = 0; i < uniques.length; i++){
        uniques[i] = uniques[i].charAt(0).toUpperCase() + uniques[i].substr(1);        
    }

    // create buttons for the different categories
    for (var i = 0; i < uniques.length; i++) {
        var btn = document.createElement('button');
        btn.setAttribute('class', 'cat');
        btn.setAttribute('id', uniques[i]);
        var label = document.createTextNode(uniques[i]);
        btn.appendChild(label);
        catBtns.appendChild(btn);

        // activate the category buttons
        btn.addEventListener('click', (e) => {
            // go to the last Q of the picked quiz
            currentQuiz = e.target.id;
            currQ = 0;
            loadQs(currentQuiz);
        });
    }
}

function loadNav(){
    navBtns.innerHTML = `
    <button class='nav' id='prev'><i class='fa fa-arrow-left fa-2x'></i></button>
    <button class='nav' id='next'><i class='fa fa-arrow-right fa-2x'></i></button>
    <button class='nav' id='home'><i class='fa fa-home fa-2x'></i></button>
    `;
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    const home = document.getElementById('home');
    
    prev.addEventListener('click', () => {
        currQ > 0 ? currQ -= 1 : currQ = 0;
        loadQs(currentQuiz);
    });
    next.addEventListener('click', () => {
        currQ < quizQuestions - 1 ? currQ += 1 : currQ = currQ;
        loadQs(currentQuiz);
    });
    home.addEventListener('click', () => {
        start();
    });
}

function loadQs(currentQuiz){
    card.style.height = 500 + 'px';
    radios.style.height = 250 + 'px';

    // 'questions' contains all of relevant quiz info 
    questions = allQs.filter( (el) => {
        if (el.category === currentQuiz.toLowerCase())
            return el;
        });

    // how many questions in the current Quiz?
    quizQuestions = questions.length;
    
    // load the current question
    loadCurrentQ();
    
    // load the answer radio buttons
    loadRadios(questions[currQ].choices);

    // clear the category buttons
    catBtns.innerHTML = "";

    // add the navigation buttons
    loadNav();
}

function loadCurrentQ(){
    welcome.innerHTML = `<p>${currentQuiz} QUIZ</p>
    <p>${currQ + 1}) ${questions[currQ].question}</p>`;
}

function loadRadios(choices){
    //console.log(choices);
    // add the radio buttons
    radios.innerHTML = "";
    var str = "";
    for (var i = 0; i < choices.length; i++){
        // if question has already been answered correctly
        if (questions[currQ].correct == true){
            // only display the correct answer
            // delete all incorrect answer choices
            str += '<label class="black"><input type="radio" class="radio" disabled="true" checked="true">' 
            + choices[questions[currQ].correctAnswer] + '</label>';
            break;
        }
        else if (questions[currQ].guessed.indexOf(i) > -1) {
            // radio button of wrong ones should be disabled
            str += '<label class="grey"><input type="radio" class="radio" disabled="true">' 
            + choices[i].strike() + '</label>';
        } else {
            str += '<label class="black"><input type="radio" class="radio" name="answers" id="' + i + '" value="' + 
            choices[i] + '">' + choices[i] + '</label>';
        }
    }
    radios.innerHTML = str;

    // add the submit button
    var submitDiv = document.createElement('div');
    submitDiv.setAttribute('id', 'submitDiv');
    var submitEl = document.getElementById('submitDiv');
    var submit = document.createElement('button');
    submit.setAttribute('class', 'submit');
    submit.setAttribute('id', 'submitId');
    var label = document.createTextNode('Submit');
    submit.appendChild(label);
    submitDiv.appendChild(submit);
    radios.appendChild(submitDiv);

    // detemine which radio button was checked
    radios.addEventListener('click', (e) => {
        userAnswer = e.target.id;
    });

    // if q not correct, activate the submit button
    const submitBtn = document.getElementById('submitId');
    if (questions[currQ].correct == true){
        submitBtn.style.backgroundColor = '#ccc';
        submitBtn.style.borderColor = '#ccc';
        submitBtn.disabled = true;
        submitBtn.style.color = '#555';
    } else 
        submitBtn.addEventListener('click', checkIfCorrect);
}

function checkIfCorrect(){
    // update last question answered
    console.log('currentQ: ' + currQ);
    questions[currQ].lastQ = currQ;
    // compare checked to correct answer
    if (userAnswer == questions[currQ].correctAnswer){
        // IF CORRECT  ////////////////////////////
        questions[currQ].correct = true;
        questions[currQ].guessed = [];
        showCorrect();
        // test if at the last question
        currQ < quizQuestions - 1 ? currQ += 1 : currQ = currQ;
    } else {   
        // IF WRONG  //////////////////////////////
        questions[currQ].guessed.push(parseInt(userAnswer));
        showWrong();
        // if too many wrong, go to next question
        if (questions[currQ].guessed.length > 2 && currQ < quizQuestions) {
            currQ++;
        }
    }
    setTimeout(loadQs(currentQuiz), 1000);
}

function showCorrect(){
    document.getElementById('applause').play();
    let feedback = document.createElement('SPAN');
    feedback.setAttribute("id", "feedback");
    feedback.innerHTML = "<i class='fa fa-check-square fa-5x'></i>";
    document.body.appendChild(feedback);
    feedback.style.transform = 'rotate(-90deg)';
    feedback.className = 'show';
    setTimeout(()=>{ feedback.className = 'hide'; }, 1000);
    setTimeout(()=>{ feedback.outerHTML = ''; }, 1500);
}

function showWrong(){
    let str = "";
    document.getElementById('buzzer').play();
    let feedback = document.createElement('SPAN');
    feedback.setAttribute("id", "feedback");
    for (var i = 0; i < questions[currQ].guessed.length; i++){
            str += '<i class="fa fa-window-close fa-4x"></i>';
        }
    feedback.innerHTML = str;
    document.body.appendChild(feedback);
    feedback.className = 'show';
    setTimeout(()=>{ feedback.className = 'hide'; }, 1000);
    setTimeout(()=>{ feedback.outerHTML = ''; }, 1500);
}
    
function start(){
    card.style.height = 360 + 'px';
    radios.style.height = 10 + 'px';
    card.style.top = 30 + 'px';
    card.style.opacity = 1.0;

    welcome.innerHTML = `<p>Welcome to<br>the Quiz Game!</p>
    <p>Please select a quiz category:</p>`;
    if (allQs.length > 0)
        showCats();
    else
        getData();
}

function addProps(){
    for (var i = 0; i < allQs.length; i++){
        allQs[i].guessed = [];
        allQs[i].correct = false;
        allQs[i].lastQ = 0;
    }
}

// fetch the data
function getData(){
    const url = 'http://www.richardkeightley.com/Quizgame/questions.JSON';
    fetch(url)
        .then (function(response){
            return response.json();
        })
        .then(function(theData){
            allQs = theData;
            addProps();
            showCats();
        })
        .catch(function(err){
            console.log('failure: ' + err);
        });
    /*
    let header = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain'
    });

    var req = new Request(url, {
        method: 'GET',
        headers: header,
        mode: 'cors',
        redirect: 'follow',
        cache: 'default'
    });

    fetch(req)
        .then ( response => response.json() )
        .then ( text => {
            allQs = text;
            showCats();
            })
        .catch( err => {
            console.log('failure: ' + err)
    });
    */
}

start();
