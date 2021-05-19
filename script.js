var root = document.body;

var QA_PAIRS = [
  {
    q: "What is 2 + 2?",
    a: "4"
  },
  {
    q: "What is the first letter of the alphabet?",
    a: "a"
  },
  {
    q: "Is water wet?",
    a: "yes"
  },
];

var qaPairs = populateQaPairs(QA_PAIRS);
var qaPairIndex = 0;
var qaPair = {};
var question = "";
var answer = "";
var answerAttempt = "";
var feedback = "";

function setNextQuestion() {
  feedback = "";
  answerAttempt = "";
  if (qaPairs.length > 0) {
    qaPairIndex = Math.floor(Math.random() * qaPairs.length);
    qaPair =  qaPairs[qaPairIndex];
    question = qaPair.q;
    answer = qaPair.a;
  } else {
    feedback = "Congratulations! You've Actively Recalled every single concept!"
  }
  m.redraw();
}

function populateQaPairs(orig) {
  return JSON.parse(JSON.stringify(orig));
}

function submitAnswer() {
  if (answerAttempt === answer) {
    qaPairs.splice(qaPairIndex, 1);
    feedback = `"${answerAttempt}" is the correct answer`;
  } else {
    feedback = `"${answerAttempt}" is incorrect. The correct answer is "${answer}"`;
  }
  window.setTimeout(function() {
    console.log('wtf');
    setNextQuestion();
  }, 3000);
}

var answerForm = {
  view: function() {
      return m("form", {
        onsubmit: function(e) {
            e.preventDefault();
            submitAnswer();
        }
      }, [
          m("input.input[type=text][placeholder=Type answer here...]", {
            oninput: function (e) {answerAttempt = e.target.value},
            value: answerAttempt,
            class: "answer_attempt"
        }),
          m("button.button[type=submit]", "Submit"),
      ])
  }
}

var speechSynthesisOptions = {
  view: function() {
    return m("form", {class: "voice_options"}, [
      m("h2", "Voice Options"),
      m("label.label[for=rate]", "Rate"),
      m("input.input[type=range][min=0][max=2][value=1][step=0.1][id=rate]", {class: "speech_range"}),
      m("label.label[for=pitch]", "Pitch"),
      m("input.input[type=range][min=0][max=2][value=1][step=0.1][id=pitch]", {class: "speech_range"})
    ]);
  }
}

var Main = {
  oninit: setNextQuestion(),
  view: function() {
    return m("main", [
      m("h1", "Active Recall"),
      m("div", {class: "content"}, [
        m("section", [
          m("h2", "Question"),
          m("p", {class: "question"}, question),
          m(answerForm),
          m("p", {class: "feedback"}, feedback)
        ]),
        m("section", [
          m(speechSynthesisOptions)
        ])
      ])
    ])
  }
}

var Splash = {
  view: function() {
    return m("a", {
      href: "#!/main"
    }, "Begin Active Recall")
  }
}

m.route(root, "/splash", {
  "/splash": Splash,
  "/main": Main,
})



