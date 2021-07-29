// ====start Data====
var root = document.body;
var synth = window.speechSynthesis;

if (typeof synth === 'undefined') {
  alert('Speech Synthesis is not supported on this browser. See https://caniuse.com/?search=Speech%20Synthesis for browser support.')
}

var voices = [];
var voice = {}
var prevVoiceLength = 0;
var voiceTestString = "Hello there.";

var deck = {}; // deck obj for edit page
var deckIndex = 0;

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
        q: "Add 'blank' and cards in your own JSON file, or by clicking the Create 'blank' button.",
        a: "decks"
      },
      {
        q: "Upload your own JSON of decks and cards by clicking the 'blank blank' button in Settings",
        a: "Choose File"
      },
      {
        q: "Click the 'blank' button to change the cards and title of a deck.",
        a: "edit"
      },
      {
        q: "Editing changes are saved 'blank'",
        a: "automatically"
      }
    ]
  },
  {
    name: "US Capitals",
    cards: [
      {q: "What is the capital of Alabama?", a: "Montgomery"},
      {q: "What is the capital of Alaska?", a: "Juneau"},
      {q: "What is the capital of Arizona?", a: "Phoenix"},
      {q: "What is the capital of Arkansas?", a: "Little Rock"},
      {q: "What is the capital of California?", a: "Sacramento"},
      {q: "What is the capital of Colorado?", a: "Denver"},
      {q: "What is the capital of Connecticut?", a: "Hartford"},
      {q: "What is the capital of Delaware?", a: "Dover"},
      {q: "What is the capital of Hawaii?", a: "Honolulu"},
      {q: "What is the capital of Florida?", a: "Tallahassee"},
      {q: "What is the capital of Georgia?", a: "Atlanta"},
      {q: "What is the capital of Idaho?", a: "Boise"},
      {q: "What is the capital of Illinois?", a: "Springfield"},
      {q: "What is the capital of Indiana?", a: "Indianapolis"},
      {q: "What is the capital of Iowa?", a: "Des Moines"},
      {q: "What is the capital of Kansas?", a: "Topeka"},
      {q: "What is the capital of Kentucky?", a: "Frankfort"},
      {q: "What is the capital of Louisiana?", a: "Baton Rouge"},
      {q: "What is the capital of Maine?", a: "Augusta"},
      {q: "What is the capital of Maryland?", a: "Annapolis"},
      {q: "What is the capital of Massachusetts?", a: "Boston"},
      {q: "What is the capital of Michigan?", a: "Lansing"},
      {q: "What is the capital of Minnesota?", a: "St. Paul"},
      {q: "What is the capital of Mississippi?", a: "Jackson"},
      {q: "What is the capital of Missouri?", a: "Jefferson City"},
      {q: "What is the capital of Montana?", a: "Helena"},
      {q: "What is the capital of Nebraska?", a: "Lincoln"},
      {q: "What is the capital of Nevada?", a: "Carson City"},
      {q: "What is the capital of New Hampshire?", a: "Concord"},
      {q: "What is the capital of New Jersey?", a: "Trenton"},
      {q: "What is the capital of New Mexico?", a: "Santa Fe"},
      {q: "What is the capital of North Carolina?", a: "Raleigh"},
      {q: "What is the capital of North Dakota?", a: "Bismarck"},
      {q: "What is the capital of New York?", a: "Albany"},
      {q: "What is the capital of Ohio?", a: "Columbus"},
      {q: "What is the capital of Oklahoma?", a: "Oklahoma City"},
      {q: "What is the capital of Oregon?", a: "Salem"},
      {q: "What is the capital of Pennsylvania?", a: "Harrisburg"},
      {q: "What is the capital of Rhode Island?", a: "Providence"},
      {q: "What is the capital of South Carolina?", a: "Columbia"},
      {q: "What is the capital of South Dakota?", a: "Pierre"},
      {q: "What is the capital of Tennessee?", a: "Nashville"},
      {q: "What is the capital of Texas?", a: "Austin"},
      {q: "What is the capital of Utah?", a: "Salt Lake City"},
      {q: "What is the capital of Vermont?", a: "Montpelier"},
      {q: "What is the capital of Virginia?", a: "Richmond"},
      {q: "What is the capital of Washington?", a: "Olympia"},
      {q: "What is the capital of West Virginia?", a: "Charleston"},
      {q: "What is the capital of Wisconsin?", a: "Madison"},
      {q: "What is the capital of Wyoming?", a: "Cheyenne"}
    ]
  },
  {
    "name": "Rust Primitives",
    "cards": [
      {
        "a": "array",
        "q": "A fixed-size \"blank\", denoted [T; N], for the element type, T, and the non-negative compile-time constant size, N."
      },
      {
        "a": "bool",
        "q": "The \"blank\" represents a value, which could only be either true or false. If you cast a \"blank\" into an integer, true will be 1 and false will be 0."
      },
      {
        "a": "char",
        "q": "The \"blank\" type represents a single character. More specifically, since ‘character’ isn’t a well-defined concept in Unicode, \"blank\" is a ‘Unicode scalar value’, which is similar to, but not the same as, a ‘Unicode code point’."
      },
      {
        "a": "f32",
        "q": "A number type having 1 sign bit, 8 exponent bits, and 24 significand precision bits, giving 6 to 9 significant decimal digits of precision."
      },
      {
        "a": "f64",
        "q": "A number type having 1 sign bit, 11 exponent bits, and 53 significand precision bits, giving 15 to 17 significant decimal digits of precision."
      },
      {
        "a": "fn",
        "q": "This type points to code, not data. It can be called just like functions. Like references, this pointer type is, among other things, assumed to not be null."
      },
      {
        "a": "i8",
        "q": "Numeric type with range of values from −128 to 127"
      },
      {
        "a": "u8",
        "q": "Numeric type with range of values from 0 to 255"
      },
      {
        "a": "i16",
        "q": "Numeric type with range of values from −32,768 to 32,767"
      },
      {
        "a": "u16",
        "q": "Numeric type with range of values from 0 to 65,535"
      },
      {
        "a": "i32",
        "q": "Numeric type with range of values from −2,147,483,648 to 2,147,483,647"
      },
      {
        "a": "u32",
        "q": "Numeric type with range of values from 0 to 4,294,967,295"
      },
      {
        "a": "i64",
        "q": "Numeric type with range of values from −9,223,372,036,854,775,808 to 9,223,372,036,854,775,807"
      },
      {
        "a": "u64",
        "q": "Numeric type with range of values from 0 to 18,446,744,073,709,551,615"
      },
      {
        "a": "i128",
        "q": "Numeric type with range of values from −170,141,183,460,469,231,731,687,303,715,884,105,728 to 170,141,183,460,469,231,731,687,303,715,884,105,727"
      },
      {
        "a": "u128",
        "q": "Numeric type with range of values from 0 to 340,282,366,920,938,463,463,374,607,431,768,211,455"
      },
      {
        "a": "isize",
        "q": "The pointer-sized signed integer type. The size of this primitive is how many bytes it takes to reference any location in memory. For example, on a 32 bit target, this is 4 bytes and on a 64 bit target, this is 8 bytes."
      },
      {
        "a": "usize",
        "q": "The pointer-sized unsigned integer type.The size of this primitive is how many bytes it takes to reference any location in memory. For example, on a 32 bit target, this is 4 bytes and on a 64 bit target, this is 8 bytes."
      },
      {
        "a": "pointer",
        "q": "The primitive type used by *const T, and *mut T. This is Raw and Unsafe."
      },
      {
        "a": "reference",
        "q": "represents a borrow of some owned value, both shared and mutable. It is a pointer that is assumed to be aligned, not null, and pointing to memory containing a valid value of T - for example"
      },
      {
        "a": "slice",
        "q": "A dynamically-sized view into a contiguous sequence, [T]. Contiguous here means that elements are laid out so that every element is the same distance from its neighbors."
      },
      {
        "a": "str",
        "q": "Also called a ‘string slice’, this is the most primitive string type. It is usually seen in its borrowed form, with an &. It is also the type of string literals"
      },
      {
        "a": "tuple",
        "q": "A finite heterogeneous sequence. Has a set length. Each element of the sequence can have a different type. Is indexed, elements can be accessed by position."
      },
      {
        "a": "unit",
        "q": "the () type, has exactly one value (), and is used when there is no other meaningful value that could be returned."
      }
    ]
  }
];
if (typeof localStorage.getItem('decks') === 'string') {
  d = JSON.parse(localStorage.getItem('decks')).decks; // overwrite default decks with saved decks
}
var lss = {};
if (typeof localStorage.getItem('settings') === 'string') {
  lss = JSON.parse(localStorage.getItem('settings')); // get localStorage settings
}

var s = { // s means Settings, applying localStorage settings or using a default value
  rate: typeof lss.rate === 'string' ? lss.rate : '1',
  pitch: typeof lss.pitch === 'string' ? lss.pitch : '1',
  volume: typeof lss.volume === 'string' ? lss.volume : '1',
  voiceName: typeof lss.voiceName === 'string' ? lss.voiceName : '',
  theme: typeof lss.theme === 'string' ? lss.theme : 'gameboy',
  caseSensitive: typeof lss.caseSensitive === 'string' ? lss.caseSensitive : 'insensitive'
}

document.body.className = s.theme;


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
      if (g.answerAttempt === g.answer || (s.caseSensitive === 'insensitive' && g.answerAttempt.toLowerCase() === g.answer.toLowerCase())) {
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

function createNewDeck() {
  d.push({
    name: 'New Deck',
    cards: [
      {
        q: '',
        a: ''
      }
    ]
  });
}

function saveDeck(updatedDeck, updatedDeckIndex) {
  if (typeof updatedDeck !== 'undefined' && typeof updatedDeckIndex !== 'undefined') {
    d[updatedDeckIndex] = updatedDeck;
  }
  localStorage.setItem('decks', JSON.stringify({decks: d}));
}

function removeDeck(deckIndex) {
  d.splice(deckIndex, 1);
}

function createNewCard(cardsArr) {
  cardsArr.push({
    q: '',
    a: ''
  });
}

function removeCard(cardsArr, cardIndex) {
  cardsArr.splice(cardIndex, 1)
}

function importDecks(file) {
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    var importText = event.target.result;
    localStorage.setItem('decks', importText);
    d = JSON.parse(importText).decks;
    clearGame();
    m.route.set('/decks');
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
var Main = {
  view: function() {
    return m("main", [
      m(Header),
      m("div", {id: "content"}, [
        
      ])
    ])
  }
}

var Header = {
  view: function() {
    return m("header", [
      m("h1", "Active Recall"),
      m('div', [
        m('button', {id: 'game_btn', onclick: function() {m.route.set("/game")}}, "Game"),
        m('button', {id: 'decks_btn', onclick: function() {m.route.set("/decks")}}, "Decks"),
        m('button', {id: 'settings_btn', onclick: function() {m.route.set("/settings")}}, "Settings")
      ])
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

var Decks = {
  oncreate: function() {
    setButtonHighlight('decks_btn');
  },
  view: function() {
    return m('div', {class: 'decks_container'},
    [
      // m('h2', 'Decks'),
      d.map(function(i, iIndex) {
        return m("div", {class: 'deck_container'}, [
        m('div', {class: 'flex-row'}, [
          m('h3', i.name),
          m('span', {class: 'card_count'}, i.cards.length + ' Cards')
        ]),
        m('div', {class: 'flex-row'}, [
          m('button', {
            class: 'inverse',
            onclick: function(){
              clearGame();
              removeDeck(iIndex);
              saveDeck();
              m.redraw();
            } 
          }, 'Delete'),
          m('button', {
            class: 'inverse',
            onclick: function(){
              clearGame();
              m.route.set('/edit/' + d.indexOf(i));
            } 
          }, 'Edit'),
          m('button', {
            onclick: function() {
              loadGame(i.cards);
              m.route.set('/game')
            }
          }, 'Play')
        ]),
      ])}),
      m("div", {class: 'deck_container'}, [
        m('button', {
          onclick: function() {
            createNewDeck();
            m.redraw();
          }
        }, 'Create New Deck')
      ])
    ]);
  }
};

var Edit = {
  oninit: function(vnode) {
    deckIndex = vnode.attrs.index;
    deck = cloneObj(d[deckIndex]);
  },
  view: function() {
    return m('div', {class: 'cards_container'},
    [
      m('div', {class: 'flex-row around'}, [
        m('h2', 'Deck Name'),
        m("input.input[type=text][autocomplete=off]", {
          oninput: function (e) {
            deck.name = e.target.value;
            saveDeck(deck, deckIndex);
            m.redraw();
          },
          value: deck.name,
          id: 'deck_name'
        }),
        m('button', {
          onclick: function() {
            loadGame(deck.cards);
            m.route.set('/game')
          }
        }, 'Play Deck')
      ]),
      deck.cards.map(function(card, index, deckArr) {
        return m('div', {class: 'card_container'}, [
        m("form", {
          onsubmit: function(e) {
            e.preventDefault();
          }
        }, [
          m('h3', 'Card ' + (index+1) + '/' + deckArr.length),
          m('p', 'Question'),
          m("textarea.textarea[autocomplete=off][placeholder=Type question here...][rows=5][columns=50]", {
            oncreate: function(vnode) {
              setTimeout(function() {
                vnode.dom.style.height = '';
                vnode.dom.style.height = vnode.dom.scrollHeight + 3 + 'px';
              }, 100);
            },
            oninput: function (e) {
              card.q = e.target.value;
              this.style.height = '';
              this.style.height = this.scrollHeight + 3 + 'px';
              saveDeck(deck, deckIndex);
              m.redraw();
            },
            value: card.q,
            id: "question" + index
          }),
          m('div', {class: 'flex-col'}, [
            m("button", {
              class: 'item-end',
              onclick: function() {
                speak(card.q);
              }
            }, "Test Speech")
          ]),
          m('p', {class: 'answer-label'}, 'Answer'),
          m("input.input[type=text][placeholder=Type answer here...][autocomplete=off]", {
            oninput: function (e) {
              card.a = e.target.value;
              saveDeck(deck, deckIndex);
              m.redraw();
            },
            value: card.a,
            id: "answer" + index
          }),
          m('div', {class: 'flex-row'}, [
            m("button", {
              class: 'inverse',
              onclick: function() {
                removeCard(deckArr, index);
                saveDeck(deck, deckIndex);
                m.redraw();
              }
            }, "Delete Card"),
            m("button", {
              onclick: function() {
                speak(card.a);
              }
            }, "Test Speech")
          ])
        ])
      ])}),
      m('div', {class: 'card_container'}, [
        m('button', {
          onclick: function() {
            createNewCard(deck.cards);
            saveDeck(deck, deckIndex);
            m.redraw();
          }
        }, 'Create New Card')
      ])
    ]);
  }
};

var Settings = {
  oncreate: function() {
    setButtonHighlight('settings_btn');
  },
  view: function() {
    return m("section", {id: "settings"}, [
      // m('h2', 'Settings'),
      m(speechSynthesisOptions),
      m(ImportExport),
      m(themeOptions),
      m(caseSensitivityOptions),
      m(problemsSection)
    ]);
  }
};

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
};

var ImportExport = {
  view: function() {
    return m('div', {class: 'settings_option_container'}, [
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
};

var themeOptions = {
  oncreate: function() {
    document.getElementById(s.theme).checked = true;
  },
  view: function() {
    return m('div', {class: 'settings_option_container'}, [
      m('h3', 'Theme'),
      m('form', {
        class: 'radios_container',
        value: s.theme,
        onchange: e => {
          console.log('radio form value', e.target.value);
          s.theme = e.target.value;
          localStorage.setItem('settings', JSON.stringify(s));
          document.body.className = s.theme;
        }
      }, [
        m('div', {class: 'radio_container'}, [
          m('label[for=gameboy]', 'GAME BOY'),
          m('input[type=radio][id=gameboy][name=theme][value=gameboy]')
        ]),
        m('div', {class: 'radio_container'}, [
          m('label[for=light]', 'Light'),
          m('input[type=radio][id=light][name=theme][value=light]')
        ]),
        m('div', {class: 'radio_container'}, [
          m('label[for=dark]', 'Dark'),
          m('input[type=radio][id=dark][name=theme][value=dark]')
        ])
      ])
    ]);
  }
};

var caseSensitivityOptions = {
  oncreate: function() {
    document.getElementById(s.caseSensitive).checked = true;
  },
  view: function() {
    return m('div', {class: 'settings_option_container'}, [
      m('h3', 'Case Sensitivity'),
      m('form', {
        class: 'radios_container',
        value: s.caseSensitive,
        onchange: e => {
          s.caseSensitive = e.target.value;
          localStorage.setItem('settings', JSON.stringify(s));
        }
      }, [
        m('div', {class: 'radio_container'}, [
          m('label[for=insensitive]', 'cAse InSeNsitivE'),
          m('input[type=radio][id=insensitive][name=theme][value=insensitive]')
        ]),
        m('div', {class: 'radio_container'}, [
          m('label[for=sensitive]', 'Case Sensitive'),
          m('input[type=radio][id=sensitive][name=theme][value=sensitive]')
        ])
      ])
    ]);
  }
};

var problemsSection = {
  view: function() {
    return m('div', {class: 'settings_option_container'}, [
      m('h3', 'Problems?'),
      m('span', [
        m('span', {class: 'settings_option_text'}, 'Make an issue '),
        m('a', {href: 'https://github.com/Mcmartelle/active_recall_js/issues'}, 'here')
      ])
    ]);
  }
};
// ====end Mithril Components====

// ====start Routing====
m.mount(root, Main);
m.route(document.getElementById('content'), "/decks", {
  "/decks": Decks,
  "/edit/:index": Edit,
  "/game": Game,
  "/settings": Settings
})
