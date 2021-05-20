var root = document.body;
var synth = window.speechSynthesis;



const QA_PAIRS = [
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
var voice = {};
var voices = [];
var rate = 1;
var pitch = 1;


function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
    if ( aname < bname ) return -1;
    else if ( aname == bname ) return 0;
    else return +1;
  });
  console.log('populateVoiceList');
  // console.log('voices: ', voices);
  if (voices.length > 0) {
    m.mount(document.getElementById('speech_synth_options'), speechSynthesisOptions);
    setNextQuestion();
  }
  // var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  // voiceSelect.innerHTML = '';
  // for(i = 0; i < voices.length ; i++) {
    // var option = document.createElement('option');
    // option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    // 
  //   if(voices[i].default) {
  //     option.textContent += ' -- DEFAULT';
  //   }

  //   option.setAttribute('data-lang', voices[i].lang);
  //   option.setAttribute('data-name', voices[i].name);
  //   voiceSelect.appendChild(option);
  // }
  // voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList()

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function doNothing() {
  // nothing being done
}

function setNextQuestion() {
  feedback = "";
  answerAttempt = "";
  if (qaPairs.length > 0) {
    qaPairIndex = Math.floor(Math.random() * qaPairs.length);
    qaPair =  qaPairs[qaPairIndex];
    question = qaPair.q;
    answer = qaPair.a;
    speak(question, doNothing);
  } else {
    feedback = "Congratulations! You've Actively Recalled every concept!"
    speak(feedback);
  }
  m.redraw();
}

function populateQaPairs(orig) {
  return JSON.parse(JSON.stringify(orig));
}

function submitAnswer() {
  if (answerAttempt === answer) {
    qaPairs.splice(qaPairIndex, 1);
    feedback = `"${answerAttempt}" is the correct answer!`;
  } else {
    feedback = `"${answerAttempt}" is incorrect. The correct answer is "${answer}"`;
  }
  speak(feedback, setNextQuestion);
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
      m("span", {class: "rate-value"}, ""),
      m("input.input[type=range][min=0][max=2][step=0.1][id=rate]",
        {
          id: "rate",
          class: "speech_range",
          value: rate,
          onchange: e => {
            console.log(e.target.value);
            rate = e.target.value;
            speak("This is a how my voice sounds now.")
          }
      }),
      m("label.label[for=pitch]", "Pitch"),
      m("span", {class: "pitch-value"}, ""),
      m("input.input[type=range][min=0][max=2][step=0.1][id=pitch]",
        {
          id: "pitch",
          class: "speech_range",
          value: pitch,
          onchange: e => {
            console.log(e.target.value);
            pitch = e.target.value;
            speak("This is a how my voice sounds now.")
          }
        }
      ),
      m('label[for=voice]', 'Voice'),
      m('select[name=voice]', {
        value: voice,
        onchange: e => {
          voice = voices[e.target.selectedIndex];
          speak("This is a how my voice sounds now.")
        }
      }, [
        voices.map(i => m('option', { value: i, "data-lang": i.lang, "data-name": i.name }, i.name + ' (' + i.lang + ')' + (i.default ? " -- DEFAULT": '')))
      ])
    ]);
  }
}

var Main = {
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
        m("section", {id: "speech_synth_options"})
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

m.route(root, "/main", {
  "/splash": Splash,
  "/main": Main,
})


  
var voiceSelect = document.querySelector('select');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');



function speak(text, onend){
  if (synth.speaking) {
    console.error('speechSynthesis.speaking');
    return;
  }
  if (text !== '' && voice && voice.name) {
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
    console.log(voice);
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === voice.name) {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.pitch = pitch;
    utterThis.rate = rate;
    synth.speak(utterThis);
  }
}
