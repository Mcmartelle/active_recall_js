// ====start Data====
var root = document.body;
var synth = window.speechSynthesis;

var voices = [];
var voice = {}
var prevVoiceLength = 0;
var voiceTestString = "Hello there.";

var g = { // g means Game
  question: "",
  answer: "",
  answerAttempt: "",
  answerSubmitted: false,
  feedback: "",
  qaPairs: [],
  qaPair: {},
  qaPairIndex: 0,
  inProgress: false,
  correctCount: 0,
  incorrectCount: 0
}
var s = { // s means Settings
  theme: 'light',
  rate: 1,
  pitch: 1,
  volume: 1,
  voiceName: ''
}
var d = [ // d means Decks
  {
    name: 'What is active recall?',
    cards: [
      {
        q: "Learning something by just reading it over and over.",
        a: "passive review"
      },
      {
        q: "When you try to think of the answer on the back of a flashcard without looking first",
        a: "active recall"
      },
      {
        q: "This is a local first app. Your decks are saved to 'blank' in your browser and not sent over the internet.",
        a: "localStorage"
      },
      {
        q: "Adjust the rate, 'blank', volume, and voice synthesizer on the Settings page",
        a: "pitch"
      }
    ],
  },
  {
    name: 'Adding Your Own Decks',
    cards: [
      {
        q: "Save the current decks as a file by going to Settings and clicking the 'blank blank blank' button",
        a: "Download as JSON"
      },
      {
        q: "Add 'blank' and cards in your own JSON file",
        a: "decks"
      },
      {
        q: "Upload your own JSON of decks and cards by clicking the 'blank blank' button in Settings",
        a: "Choose File"
      }
    ]
  }
];

if (typeof localStorage.getItem('settings') === 'string') {
  s = JSON.parse(localStorage.getItem('settings')); // overwrite default settings with saved settings
}
if (typeof localStorage.getItem('decks') === 'string') {
  d = JSON.parse(localStorage.getItem('decks')).decks; // overwrite default decks with saved decks
}


if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}
// ====end Data====

// ====start Functions====
function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
    if ( aname < bname ) return -1;
    else if ( aname == bname ) return 0;
    else return +1;
  });
  if (voices.length > 0) {
    if (s.voiceName === '') {
      if (localStorage.getItem('settings') && localStorage.getItem('settings').voice) {
        s.voiceName = localStorage.getItem('settings').voice;
      } else {
        s.voiceName = voices[0].name;
      }
    }
    voice = getVoice();
    m.redraw();
  }
}

function voiceSelectOptionsChange() {
  var voiceSelect = document.getElementById('voice_select');
  if(voiceSelect.options.length > 0 && voiceSelect.options.length >= voices.length) {
    voiceSelect.options[voices.indexOf(voice)].selected = true;
  }
}

function voiceSelectOnUpdate() {
  if (voices.length > 0 && voices.length !== prevVoiceLength) {
    voiceSelectOptionsChange();
  }
  prevVoiceLength = voices.length;
}

function setNextQuestion() {
  g.feedback = "";
  g.answerAttempt = "";
  g.answerSubmitted = false;
  if (g.qaPairs.length > 0) {
    g.qaPairIndex = Math.floor(Math.random() * g.qaPairs.length);
    g.qaPair = g.qaPairs[g.qaPairIndex];
    g.question = g.qaPair.q;
    g.answer = g.qaPair.a;
    speak(g.question);
  } else {
    clearGame();
    g.feedback = "Congratulations! You've Actively Recalled every concept!"
    speak(g.feedback);
  }
  m.redraw();
}

function setButtonHighlight(buttonName) {
  document.getElementById('game_btn').classList.remove("btn_highlight");
  document.getElementById('decks_btn').classList.remove("btn_highlight");
  document.getElementById('settings_btn').classList.remove("btn_highlight");
  document.getElementById(buttonName).classList.add("btn_highlight");
}

function cloneObj(orig) {
  return JSON.parse(JSON.stringify(orig));
}

function clearGame() {
  g.question = "";
  g.answer = "";
  g.answerAttempt = "";
  g.feedback = "";
  g.qaPairs = [];
  g.qaPair = {};
  g.qaPairIndex = 0;
  g.inProgress = false;
  g.correctCount = 0;
  g.incorrectCount = 0;
}
  
function loadGame(deck) {
  clearGame();
  g.inProgress = true;
  g.qaPairs = cloneObj(deck);
  setNextQuestion();
}

function submitAnswer() {
  if (g.inProgress) {
    if(!g.answerSubmitted) {
      g.answerSubmitted = true;
      if (g.answerAttempt === g.answer) {
        g.qaPairs.splice(g.qaPairs.indexOf(g.qaPair), 1);
        g.correctCount++;
        g.feedback = `"${g.answerAttempt}" is the correct answer!`;
      } else {
        g.incorrectCount++;
        g.feedback = `"${g.answerAttempt}" is incorrect. The correct answer is "${g.answer}"`;
      }
      speak(g.feedback, setNextQuestion);
    } else {
      synth.cancel();
      setNextQuestion();
    }
  } else {
    g.question = 'Select a deck to play';
    speak(g.question);
    m.route.set('/decks');
  }
}

function getVoice() {
  for(i = 0; i < voices.length ; i++) {
    if(voices[i].name === s.voiceName) {
      return voices[i];
    }
  }
}

function speak(text, onend){
  if (synth.speaking) {
    synth.cancel();
  }
  if (text !== '' && s.voiceName !== '') {
    var utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = function (event) {
      if (typeof onend === 'function') {
        onend(event);
      }
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    utterThis.voice = getVoice();
    utterThis.pitch = s.pitch;
    utterThis.rate = s.rate;
    utterThis.volume = s.volume;
    synth.speak(utterThis);
  }
}

function importDecks(file) {
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    var importText = event.target.result;
    localStorage.setItem('decks', importText);
    d = JSON.parse(importText).decks;
    m.redraw();
  });
  reader.readAsText(file);
}

function exportDecks() {
  function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }
  download(JSON.stringify({decks: d}), 'active_recall_decks.json', 'application/json');
}
// ====end Functions====

// ====start Mithril Components====
var answerForm = {
  view: function() {
      return m("form", {
        onsubmit: function(e) {
            e.preventDefault();
            submitAnswer(e);
        }
      }, [
          m("input.input[type=text][placeholder=Type answer here...][autocomplete=off]", {
            oncreate: function() {document.getElementById('answer_attempt').focus()},
            oninput: function (e) {g.answerAttempt = e.target.value},
            value: g.answerAttempt,
            id: "answer_attempt"
        }),
          m("button.button[type=submit]", "Submit"),
      ])
  }
}

var speechSynthesisOptions = {
  oncreate: function() {
    populateVoiceList();
  },
  view: function() {
    return m("form", {class: "voice_options"}, [
      m("h3", "Voice Options"),
      m("p", {class: "label_container rate"}, [
        m("label.label[for=rate]", "Rate"),
        m("span", {class: "value rate"}, s.rate),
      ]),
      m("input.input[type=range][min=0.5][max=2][step=0.1][id=rate]",
        {
          id: "rate",
          class: "speech_range",
          value: s.rate,
          onchange: e => {
            s.rate = e.target.value;
            localStorage.setItem('settings', JSON.stringify(s));
            speak(voiceTestString);
          }
        }
      ),
      m("p", {class: "label_container pitch"}, [
        m("label.label[for=pitch]", "Pitch"),
        m("span", {class: "value pitch"}, s.pitch),
      ]),
      m("input.input[type=range][min=0][max=2][step=0.1][id=pitch]",
        {
          id: "pitch",
          class: "speech_range",
          value: s.pitch,
          onchange: e => {
            s.pitch = e.target.value;
            localStorage.setItem('settings', JSON.stringify(s));
            speak(voiceTestString);
          }
        }
      ),
      m("p", {class: "label_container volume"}, [
        m("label.label[for=volume]", "Volume"),
        m("span", {class: "value volume"}, s.volume),
      ]),
      m("input.input[type=range][min=0][max=1][step=0.1][id=volume]",
        {
          id: "volume",
          class: "speech_range",
          value: s.volume,
          onchange: e => {
            s.volume = e.target.value;
            localStorage.setItem('settings', JSON.stringify(s));
            speak(voiceTestString);
          }
        }
      ),
      m('label[for=voice]', {class: "voice_label"}, 'Voice'),
      m('select[name=voice]', {
        value: s.voiceName,
        id: 'voice_select',
        onchange: e => {
          s.voiceName = voices[e.target.selectedIndex].name;
          localStorage.setItem('settings', JSON.stringify(s));
          speak(voiceTestString);
        },
        onupdate: voiceSelectOnUpdate
      }, [
        voices.map(i => m('option', { value: i.name, "data-lang": i.lang, "data-name": i.name }, i.name + ' (' + i.lang + ')' + (i.default ? " -- DEFAULT": '')))
      ])
    ]);
  }
}

var ImportExport = {
  view: function() {
    return m('div', {class: 'file_buttons_container'}, [
        m('h3', 'Deck Options'),
        m('div', {class: 'import button_container'}, [
          m('label[for=import_file]', 'Import Decks'),
          m('input[type=file][id=import_file][name=import_file][accept=.json]',
          {
            onchange: function(e) {
              const fileList = event.target.files;
              if (fileList.length === 1) {
                importDecks(fileList[0]);
              }
            }
          })
        ]),
        m('div', {class: 'export button_container'}, [
          m('label[for=export_file]', 'Export Decks'),
          m('button', {name: 'export_file', onclick: exportDecks}, 'Download as JSON')
        ])
      ])
  }
}

var scoreBoard = {
  view: function() {
    return m('div', {class: 'score_board'}, [
      m('h3', 'Scoreboard'),
      m('p', [
        m('span', 'Remaining'),
        m('span', g.qaPairs.length)
      ]),
      m('p', [
        m('span', 'Correct'),
        m('span', g.correctCount)
      ]),
      m('p', [
        m('span', 'Incorrect'),
        m('span', g.incorrectCount)
      ])
    ]);
  }
};

var gameBoard = {
  view: function() {
    return m('div', {class: 'game_board'}, [
      m("p", {class: "question"}, g.question),
      m(answerForm),
      m("p", {class: "feedback"}, g.feedback)
    ]);
  }
};

var Game = {
  oncreate: function() {
    setButtonHighlight('game_btn');
    if (!g.inProgress) {
      g.question = 'Select a deck to play';
      // m.redraw();
    }
  },
  view: function() {
    return m("section", {class: 'game_section'}, [
      m(scoreBoard),
      m(gameBoard)
    ])
  }
}

var Decks = {
  oncreate: function() {
    setButtonHighlight('decks_btn');
  },
  view: function() {
    return m('div', {class: 'decks_container'},
    [
      // m('h2', 'Decks'),
      d.map(i => m("div", {class: 'deck_container'}, [
        m('h3', i.name),
        m('span', {class: 'card_count'}, i.cards.length + ' Cards'),
        m('button', {
          onclick: function() {
            loadGame(i.cards);
            m.route.set('/game')
          }
        }, 'Play')
        // i.cards.map(j => m('div', {class: 'card_container'}, [
        //   m('p', 'Question: ' + j.q),
        //   m('p', 'Answer: ' + j.a)
        // ]))
      ]))
    ]);
  }
};

var Settings = {
  oncreate: function() {
    setButtonHighlight('settings_btn');
  },
  view: function() {
    return m("section", {id: "speech_synth_options"}, [
      // m('h2', 'Settings'),
      m(speechSynthesisOptions),
      m(ImportExport)
    ]);
  }
};

var Header = {
  view: function() {
    return m("header", [
      m("h1", "Active Recall"),
      m('div', [
        m('button', {id: 'game_btn', onclick: function() {m.route.set("/game")}}, "Game"),
        m('button', {id: 'decks_btn', onclick: function() {m.route.set("/decks")}}, "Decks"),
        m('button', {id: 'settings_btn', onclick: function() {m.route.set("/settings")}}, "Settings"),
      ])
    ]);
  }
};

var Main = {
  view: function() {
    return m("main", [
      m(Header),
      m("div", {id: "content"}, [
        
      ])
    ])
  }
}
// ====end Mithril Components====

// ====start Routing====
m.mount(root, Main);
m.route(document.getElementById('content'), "/decks", {
  "/decks": Decks,
  "/game": Game,
  "/settings": Settings
})
