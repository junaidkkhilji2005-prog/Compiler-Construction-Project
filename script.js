// ========================================
// MOBILE NAVIGATION
// ========================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});

// ========================================
// FOOTER YEAR
// ========================================

document.getElementById("year").textContent = new Date().getFullYear();

// ========================================
// BACK TO TOP
// ========================================

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ========================================
// CODE PLAYGROUND
// ========================================

const codeEditor = document.getElementById("codeEditor");
const runCode = document.getElementById("runCode");
const clearOutput = document.getElementById("clearOutput");
const output = document.getElementById("output");

const compilerMode = document.getElementById("compilerMode");
const interpreterMode = document.getElementById("interpreterMode");

let executionMode = "compiler";

// ----------------------------------------
// MODE SWITCHING
// ----------------------------------------

compilerMode.addEventListener("click", function () {
    executionMode = "compiler";

    compilerMode.classList.add("active");
    interpreterMode.classList.remove("active");

    output.innerHTML =
        '<p class="terminal-muted">Compiler mode selected. Click Run Simulation.</p>';
});

interpreterMode.addEventListener("click", function () {
    executionMode = "interpreter";

    interpreterMode.classList.add("active");
    compilerMode.classList.remove("active");

    output.innerHTML =
        '<p class="terminal-muted">Interpreter mode selected. Click Run Simulation.</p>';
});

// ----------------------------------------
// SAFE OUTPUT HELPER
// ----------------------------------------

function addTerminalLine(text, className = "terminal-line") {
    const line = document.createElement("p");

    line.className = className;
    line.textContent = text;

    output.appendChild(line);
}

// ----------------------------------------
// SIMULATED SOURCE CODE PROCESSOR
// ----------------------------------------

function processSourceCode(source) {
    const lines = source.split("\n");
    const variables = {};
    const results = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === "" || line.startsWith("#")) {
            continue;
        }

        // Support simple variable assignments:
        // x = 10
        const assignment = line.match(
            /^([a-zA-Z_]\w*)\s*=\s*(-?\d+(?:\.\d+)?)$/
        );

        if (assignment) {
            variables[assignment[1]] = Number(assignment[2]);
            continue;
        }

        // Support simple print statements:
        // print(x + y)
        const printMatch = line.match(/^print\((.*)\)$/);

        if (printMatch) {
            const expression = printMatch[1].trim();

            // String literal
            const stringMatch = expression.match(/^["'](.*)["']$/);

            if (stringMatch) {
                results.push(stringMatch[1]);
                continue;
            }

            // Simple numeric addition:
            // print(x + y)
            const addition = expression.match(
                /^([a-zA-Z_]\w*|-?\d+(?:\.\d+)?)\s*\+\s*([a-zA-Z_]\w*|-?\d+(?:\.\d+)?)$/
            );

            if (addition) {
                const left = resolveValue(addition[1], variables);
                const right = resolveValue(addition[2], variables);

                if (left === undefined || right === undefined) {
                    throw new Error(
                        `Line ${i + 1}: Undefined variable in expression.`
                    );
                }

                results.push(String(left + right));
                continue;
            }

            // Single variable or number:
            const singleValue = resolveValue(expression, variables);

            if (singleValue !== undefined) {
                results.push(String(singleValue));
                continue;
            }

            throw new Error(
                `Line ${i + 1}: Unsupported print expression.`
            );
        }

        throw new Error(
            `Line ${i + 1}: Unsupported statement: ${line}`
        );
    }

    return results;
}

// ----------------------------------------
// VALUE RESOLVER
// ----------------------------------------

function resolveValue(value, variables) {
    const trimmed = value.trim();

    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
        return Number(trimmed);
    }

    if (Object.prototype.hasOwnProperty.call(variables, trimmed)) {
        return variables[trimmed];
    }

    return undefined;
}

// ----------------------------------------
// RUN SIMULATION
// ----------------------------------------

runCode.addEventListener("click", function () {
    const source = codeEditor.value;

    output.innerHTML = "";

    addTerminalLine(
        executionMode === "compiler"
            ? "> Starting compilation..."
            : "> Starting interpretation...",
        "terminal-info"
    );

    try {
        const results = processSourceCode(source);

        if (executionMode === "compiler") {
            addTerminalLine("> Compilation successful.", "terminal-info");
            addTerminalLine("> Executing generated code...", "terminal-info");
        } else {
            addTerminalLine("> Processing statements at runtime...", "terminal-info");
        }

        if (results.length === 0) {
            addTerminalLine("Program executed successfully. No output.");
        } else {
            results.forEach(function (result) {
                addTerminalLine(result);
            });
        }

        addTerminalLine("> Execution completed.", "terminal-info");
    } catch (error) {
        addTerminalLine(`Error: ${error.message}`, "terminal-error");
    }
});

// ----------------------------------------
// CLEAR OUTPUT
// ----------------------------------------

clearOutput.addEventListener("click", function () {
    output.innerHTML =
        '<p class="terminal-muted">Output cleared. Run the simulation to begin.</p>';
});

// ========================================
// QUIZ QUESTIONS
// ========================================

const quizQuestions = [
    {
        question: "1. What is the main function of a compiler?",
        options: [
            "To translate source code into a target representation",
            "To design websites",
            "To store files",
            "To connect computers to the internet"
        ],
        answer: 0,
        explanation: "A compiler translates source code into a target representation, such as machine code or bytecode."
    },
    {
        question: "2. What does an interpreter generally do?",
        options: [
            "Only stores source code",
            "Processes and executes program instructions at runtime",
            "Creates computer hardware",
            "Deletes programming errors automatically"
        ],
        answer: 1,
        explanation: "An interpreter processes and executes program instructions during runtime."
    },
    {
        question: "3. Which language is commonly associated with compiled execution?",
        options: [
            "HTML",
            "CSS",
            "C",
            "Markdown"
        ],
        answer: 2,
        explanation: "C is commonly compiled into machine code before execution."
    },
    {
        question: "4. Which is a possible advantage of a compiler?",
        options: [
            "It never produces errors",
            "It can optimize code before execution",
            "It always requires an internet connection",
            "It automatically creates websites"
        ],
        answer: 1,
        explanation: "Compilers can optimize code to improve execution performance."
    },
    {
        question: "5. Which statement about modern language implementations is correct?",
        options: [
            "Every language uses only a compiler",
            "Every language uses only an interpreter",
            "Some implementations combine compilation and interpretation",
            "Interpreters cannot execute programs"
        ],
        answer: 2,
        explanation: "Modern runtimes may combine bytecode interpretation and just-in-time compilation."
    }
];

// ========================================
// QUIZ VARIABLES
// ========================================

let currentQuestion = 0;
let score = 0;
let answered = false;

// ========================================
// QUIZ ELEMENTS
// ========================================

const questionCounter = document.getElementById("questionCounter");
const scoreDisplay = document.getElementById("scoreDisplay");
const progressFill = document.getElementById("progressFill");
const questionText = document.getElementById("questionText");
const quizOptions = document.getElementById("quizOptions");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const quizResult = document.getElementById("quizResult");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

// ========================================
// LOAD QUESTION
// ========================================

function loadQuestion() {
    answered = false;

    const question = quizQuestions[currentQuestion];

    questionCounter.textContent =
        `Question ${currentQuestion + 1} of ${quizQuestions.length}`;

    scoreDisplay.textContent = `Score: ${score}`;

    progressFill.style.width =
        `${(currentQuestion / quizQuestions.length) * 100}%`;

    questionText.textContent = question.question;

    quizOptions.innerHTML = "";
    feedback.textContent = "";
    feedback.className = "feedback";

    nextBtn.disabled = true;

    nextBtn.textContent =
        currentQuestion === quizQuestions.length - 1
            ? "See Results →"
            : "Next Question →";

    question.options.forEach(function (option, index) {
        const button = document.createElement("button");

        button.className = "quiz-option";
        button.textContent =
            `${String.fromCharCode(65 + index)}. ${option}`;

        button.addEventListener("click", function () {
            checkAnswer(index, button);
        });

        quizOptions.appendChild(button);
    });
}

// ========================================
// CHECK ANSWER
// ========================================

function checkAnswer(selectedIndex, selectedButton) {
    if (answered) return;

    answered = true;

    const question = quizQuestions[currentQuestion];
    const optionButtons = document.querySelectorAll(".quiz-option");

    optionButtons.forEach(function (button) {
        button.disabled = true;
    });

    if (selectedIndex === question.answer) {
        score++;

        selectedButton.classList.add("correct");
        feedback.textContent = `✓ Correct! ${question.explanation}`;
        feedback.classList.add("correct-text");
    } else {
        selectedButton.classList.add("wrong");

        optionButtons[question.answer].classList.add("correct");

        feedback.textContent = `✕ Incorrect. ${question.explanation}`;
        feedback.classList.add("wrong-text");
    }

    scoreDisplay.textContent = `Score: ${score}`;

    nextBtn.disabled = false;
}

// ========================================
// NEXT QUESTION
// ========================================

nextBtn.addEventListener("click", function () {
    if (!answered) return;

    currentQuestion++;

    if (currentQuestion < quizQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// ========================================
// SHOW RESULTS
// ========================================

function showResults() {
    questionCounter.textContent = "Quiz Completed";
    scoreDisplay.textContent = `Score: ${score}`;

    progressFill.style.width = "100%";

    questionText.classList.add("hidden");
    quizOptions.classList.add("hidden");
    feedback.classList.add("hidden");
    nextBtn.classList.add("hidden");

    quizResult.classList.remove("hidden");

    const percentage = Math.round(
        (score / quizQuestions.length) * 100
    );

    let message = "";

    if (percentage === 100) {
        message = "Excellent! You answered every question correctly.";
    } else if (percentage >= 60) {
        message = "Good job! You have a solid understanding of the topic.";
    } else {
        message = "Keep learning! Review the sections and try again.";
    }

    finalScore.textContent =
        `Your Score: ${score}/${quizQuestions.length} (${percentage}%). ${message}`;
}

// ========================================
// RESTART QUIZ
// ========================================

restartBtn.addEventListener("click", function () {
    currentQuestion = 0;
    score = 0;
    answered = false;

    questionText.classList.remove("hidden");
    quizOptions.classList.remove("hidden");
    feedback.classList.remove("hidden");
    nextBtn.classList.remove("hidden");

    quizResult.classList.add("hidden");

    loadQuestion();
});

// ========================================
// INITIALIZE QUIZ
// ========================================

loadQuestion();