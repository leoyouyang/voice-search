let speechRec, continuous, interimResults;
let word2Vec, word, similar;
let promptText, speakNowText, similarText, newSearchPromptText;
let stage = 0;

function setup() {
  noCanvas();

  //Load Word2Vec Model
  word2Vec = ml5.word2vec('data/wordvecs5000.json', modelLoaded);

  //Set up speech recognition
  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  continuous = true;
  interimResults = false;
  speechRec.start(continuous, interimResults);
  speechRec.onEnd = speechRestart;

  //Show page elements
  createElement('h1', 'Virtual World Voice Search');
  promptText = createP('Loading...');
  speakNowText = createElement('h2', '<br>');
  similarText = createP('<br><br><h3><br><br></h3>');
  newSearchPromptText = createP('<br><br>');
}

function modelLoaded() {
  stage = 1;
  promptText.html('Say <span class="bold">Search</span> to start a voice search.');
  promptText.class('animated fadeIn');
  speakNowText.html('<br>');
  initResultsText();
}

function gotSpeech() {
  if (speechRec.resultValue) {
    let said = speechRec.resultString;
    if (said == 'search') {
      stage = 2;
      promptText.html('What kind of scene would you like to see?');
      promptText.class('animated fadeInUp');
      speakNowText.html('Speak Now...');
      speakNowText.class('animated fadeIn delay-1s');
      initResultsText();
    }

    if (said == 'stop') {
      modelLoaded();
      promptText.class('animated fadeInDown');
    }

    if (stage == 2 && said != 'search' && said != 'stop') {
      word = said;
      word2Vec.nearest(word, (err, result) => {
        similar = '';
        if (result) {
          for (let i = 0; i < result.length; i++) {
            similar += capitalLetter(result[i].word) + ' &nbsp;&nbsp; ';
            if (i==4)
              similar += '<br>';
          }
        }
        promptText.html('The scene you are looking for:<br>');
        promptText.class('animated fadeIn');
        promptText.style('animation-delay', '0.1s');
        speakNowText.html(capitalLetter(word));
        speakNowText.class('animated fadeInLeft');
        speakNowText.style('animation-delay', '0.9s');
        if (similar != ''){
          similarText.html('<br>You may also like:<br><h3>' + similar + '</h3>');
          similarText.class('animated fadeInLeft');
          similarText.style('animation-delay', '2.3s');
          newSearchPromptText.style('animation-delay', '3.8s');
        }
        else {
          newSearchPromptText.style('animation-delay', '2s');
        }
        newSearchPromptText.html('Say <span class="bold">Search</span> to start a new voice search,<br>or say <span class="bold">Stop</span> to quit.');
        newSearchPromptText.class('animated fadeIn');
      });
      stage = 3;
    }
  }
}

function initResultsText() {
  similarText.html('<br><br><h3><br><br></h3>');
  similarText.class('animated flash');
  newSearchPromptText.html('<br><br>');
  newSearchPromptText.class('animated flash');
}

function speechRestart() {
  speechRec.start(continuous, interimResults);
}

function capitalLetter(str) {
  str = str.split(" ");
  for (let i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }
  return str.join(" ");
}
