// ====start Data====
var root = document.body;
var synth = window.speechSynthesis;

var voices = [];
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
}
var s = { // s means Settings
  theme: 'light',
  rate: 1,
  pitch: 1,
  volume: 1,
  voice: {}
}
var d = [ // d means Decks
  {
    name: 'Sample 1',
    cards: [
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
    ],
  },
  {
    name: 'Sample 2',
    cards: [
      {
        q: "What color is blue paint?",
        a: "blue"
      },
      {
        q: "What is 5 x 5?",
        a: "25"
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

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
    if ( aname < bname ) return -1;
    else if ( aname == bname ) return 0;
    else return +1;
  });
  console.log('populateVoiceList');
  if (voices.length > 0) {
    if (Object.keys(s.voice).length === 0) {
      s.voice = voices[0];
    }
  }
}

populateVoiceList()

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}
// ====end Data====

// ====start Functions====
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
    g.feedback = "Congratulations! You've Actively Recalled every concept!"
    g.question = "";
    g.answer = "";
    g.inProgress = false;
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

function loadGame(deck) {
    g.question = "";
    g.answer = "";
    g.answerAttempt = "";
    g.feedback = "";
    g.qaPairs = cloneObj(deck);
    g.qaPair = {};
    g.qaPairIndex = 0;
    g.inProgress = true;
    setNextQuestion();
}

function submitAnswer() {
  if (g.inProgress) {
    if(!g.answerSubmitted) {
      g.answerSubmitted = true;
      if (g.answerAttempt === g.answer) {
        g.qaPairs.splice(g.qaPairs.indexOf(g.qaPair), 1);
        g.feedback = `"${g.answerAttempt}" is the correct answer!`;
      } else {
        g.feedback = `"${g.answerAttempt}" is incorrect. The correct answer is "${g.answer}"`;
      }
      speak(g.feedback, setNextQuestion);
    } else {
      synth.cancel();
      setNextQuestion();
    }
  } else {
    speak(g.question);
    m.route.set('/decks');
  }
}

function speak(text, onend){
  if (synth.speaking) {
    synth.cancel();
  }
  if (text !== '' && s.voice && s.voice.name) {
    var utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = function (event) {
      console.log('SpeechSynthesisUtterance.onend');
      if (typeof onend === 'function') {
        onend(event);
      }
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === s.voice.name) {
        utterThis.voice = voices[i];
        break;
      }
    }
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
            console.log(e.target.value);
            s.rate = e.target.value;
            speak(voiceTestString);
            localStorage.setItem('settings', JSON.stringify(s));
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
            speak(voiceTestString);
            localStorage.setItem('settings', JSON.stringify(s));
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
            speak(voiceTestString);
            localStorage.setItem('settings', JSON.stringify(s));
          }
        }
      ),
      m('label[for=voice]', {class: "voice_label"}, 'Voice'),
      m('select[name=voice]', {
        value: s.voice,
        onchange: e => {
          s.voice = voices[e.target.selectedIndex];
          speak(voiceTestString);
          localStorage.setItem('settings', JSON.stringify(s));
        }
      }, [
        voices.map(i => m('option', { value: i, "data-lang": i.lang, "data-name": i.name }, i.name + ' (' + i.lang + ')' + (i.default ? " -- DEFAULT": '')))
      ])
    ]);
  }
}

var ImportExport = {
  view: function() {
    return m('div', {class: 'file_buttons_container'}, [
        m('h3', 'Decks I/O'),
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

var Game = {
  oncreate: function() {
    setButtonHighlight('game_btn');
    if (!g.inProgress) {
      g.question = 'Select a deck to play';
      m.redraw();
    }
  },
  view: function() {
    return m("section", {class: 'game_section'}, [
      // m("h2", "Question"),
      m("p", {class: "question"}, g.question),
      m(answerForm),
      m("p", {class: "feedback"}, g.feedback)
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
