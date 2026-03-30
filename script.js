let a, b;
let score = 0;
let totalQuestions = 0;
let timeLeft = 30;
let timer;
let isTestRunning = false;
let selectedDifficulty;
let selectedOperation;
let wrongAnswers = [];
let streak = 0;
let bestStreak = 0;

function startTest() {
    
    selectedDifficulty = localStorage.getItem("difficulty");
    selectedOperation = localStorage.getItem("operation");

    if (!selectedOperation || !selectedDifficulty) {
        alert("Please select from homepage!");
        window.location.href = "index.html";
        return;
    }

    let testArea = document.getElementById("testArea");
        if (testArea) {
            testArea.style.display = "block";
        }

    score = 0;
    totalQuestions = 0;
    wrongAnswers = [];
    isTestRunning = true;
    let type = localStorage.getItem("practiceType");

    if (type) {
        timeLeft = 45;  // ⏱️ more time for tricks
    } else {
        timeLeft = 30;  // normal mode
    }

    document.getElementById("score").innerText = "Score: 0";
    document.getElementById("timer").innerText = "Time: 30";
    generateQuestion();

    timer = setInterval(function() {
        timeLeft--;
        document.getElementById("timer").innerText = "Time: " + timeLeft;

        if (timeLeft === 0) {
            clearInterval(timer);
            isTestRunning = false;

            localStorage.setItem("score", score);
            localStorage.setItem("totalQuestions", totalQuestions);
            localStorage.setItem("wrongAnswers", JSON.stringify(wrongAnswers));
        

            window.location.href = "result.html";
        }
    }, 1000);
}

function generateQuestion() {

    let type = localStorage.getItem("practiceType");

    if (!isTestRunning) return;

    let min = 1;
    let max = 10;

        // set range based on difficulty
    if (selectedDifficulty == "20") {   // Easy
        min = 1;
        max = 10;
    }
    else if (selectedDifficulty == "50") {  // Medium
        min = 5;
        max = 20;
    }
    else if (selectedDifficulty == "100") { // Hard
        min = 10;
        max = 50;
    }

    // 🔥 SPECIAL PRACTICE BASED ON TRICK
    if (type === "mul5") {
        a = Math.floor(Math.random() * 20) + 1 + 
        Math.floor(Math.random() * 5);
        b = 5;
    }
    else if (type === "square5") {

    if (selectedDifficulty == "20") {   // Easy
        let num = Math.floor(Math.random() * 5) + 1;
        a = num * 10 + 5;
    }
    else if (selectedDifficulty == "50") { // Medium
        let num = Math.floor(Math.random() * 10) + 1;
        a = num * 10 + 5;
    }
    else { // Hard
        let num = Math.floor(Math.random() * 20) + 1;
        a = num * 10 + 5;
    }

    b = 1; // keep this
    }

    else if (type === "mul9") {
        a = Math.floor(Math.random() * 20) + 1+ 
        Math.floor(Math.random() * 5);
        b = 9;
    }
    else if (type === "addFast") {
        a = Math.floor(Math.random() * 90) + 10;
        b = Math.floor(Math.random() * 10) + 1;
    }
    else {
    // generate numbers

        if (selectedOperation === "div") {
            b = Math.floor(Math.random() * 9) + 1; // never 0
            let result = Math.floor(Math.random() * 10) + 1;
            a = b * result; // ensures clean division
        } else {
            a = Math.floor(Math.random() * (max - min + 1)) + min;
            b = Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
    
    // 🎯 SHOW QUESTION BASED ON TYPE
    if (type === "square5") {
        document.getElementById("question").innerText =
            "Solve: " + a + "²";
    }
    else if (type === "mul5" || type === "mul9") {
        document.getElementById("question").innerText =
            "Solve: " + a + " × " + b;
    }
    else if (type === "addFast") {
        document.getElementById("question").innerText =
            "Solve: " + a + " + " + b;
    }
    else {
        // normal mode
        if (selectedOperation === "add") {
            document.getElementById("question").innerText =
                "Solve: " + a + " + " + b;
        }
        else if (selectedOperation === "sub") {
            document.getElementById("question").innerText =
                "Solve: " + a + " - " + b;
        }
        else if (selectedOperation === "mul") {
            document.getElementById("question").innerText =
                "Solve: " + a + " × " + b;
        }
        else if(selectedOperation === "div") {
            document.getElementById("question").innerText =
            "Solve: " + a + " ÷ " +b;
        }
    }

    document.getElementById("answer").value = "";

    // 🔥 FORCE RESET FEEDBACK
    
}

function checkAnswer() {
    if (!isTestRunning) return;

    let input = document.getElementById("answer");

    if (input.value === "") return; // ✅ prevents double click

    let userAns = Number(input.value);
    input.value = ""; // ✅ clear immediately

    let correct;

    let type = localStorage.getItem("practiceType");

    if (type === "square5") {
        correct = a * a;
    }
    else if (type === "mul5" || type === "mul9") {
            correct = a * b;
    }
    else if (type === "addFast") {
            correct = a + b;
    }
    else {
            // normal mode
        if (selectedOperation === "add") correct = a + b;
        else if (selectedOperation === "sub") correct = a - b;
        else if (selectedOperation === "mul") correct = a * b;
        else if (selectedOperation === "div") correct = a / b;
        }

    totalQuestions++;

    if (userAns == correct) {
    score++;
        // ✅ SHOW CORRECT
        document.getElementById("feedback").innerText = "Correct ✅";
    } else {
        // ❌ SHOW WRONG
        document.getElementById("feedback").innerText = "Wrong ❌";

        // ✅ SAVE WRONG ANSWER
        let questionText;
        let type = localStorage.getItem("practiceType");

        if (type === "square5") {
            questionText = a + "²";
        } else if (type === "mul5" || type === "mul9") {
            questionText = a + " × " + b;
        } else if (type === "addFast") {
            questionText = a + " + " + b;
        } else {
            questionText = a + " " + getSymbol(selectedOperation) + " " + b;
        }

        wrongAnswers.push({
            question: questionText,
            yourAnswer: userAns,
            correctAnswer: correct
        });
    }

    document.getElementById("score").innerText = "Score: " + score;
    
    document.getElementById("feedback").innerText = "";
    // show feedback first, then go next question after delay
    setTimeout(function() {
        document.getElementById("feedback").innerText = "";
        generateQuestion();
    }, 800); // 0.8 second delay
}

function getSymbol(op) {
    if (op === "add") return "+";
    if (op === "sub") return "-";
    if (op === "mul") return "×";
    if (op === "div") return "÷";
}

document.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        checkAnswer();
    }
});

window.onload = function() {
    startTest();
};
