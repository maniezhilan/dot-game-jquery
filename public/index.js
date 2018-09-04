var explosionWords = ['Pop!', 'Snap!', 'Crack!'];
var bubblesPopped = 0;
var $score = document.getElementById('score');
var $container = $('.container');
var $speed = 5000;
var $play = false;

function getSpeed(key){
	var speedMap = {1:10000,
					2:9000,
					3:8000,
					4:7000,
					5:6000,
					6:5000,
					7:4000,
					8:3000,
					9:2000,
					10:1000};
	return speedMap[key];

}
$(".dial").knob({
        'release' : function (value) {
        	$speed = getSpeed(value);
       }

	});

// setup
var score = new Score();
var scorecard = document.getElementById("scorecard");
var points = document.getElementById("#score");
var template = scorecard.innerHTML;

function updateScore(){
	score.increment();
	updateCard();
};
function updateCard(){
	var s = template;
	// Get scorecard
	var d = score.scorecard();
	// populate template
	for(var p in d){
		s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
	}
	scorecard.innerHTML = s;
	scorecard.className = d.status;
	document.getElementById("score").innerHTML = 'score: '+d.score;
	//document.getElementById("icon").className = 'icons8-' + d.status;
};
updateCard();


$('#btnPlay').click(function(e) {
		$play = true;
    	$('.bg-overlay').addClass('hide');
    	$container.find('.content').css("display","none");
    	startBubbles();
		startWaves();
    });

function createBubble() {
    // create bubble graphic
    var $bubble = document.createElement('div');
    $bubble.classList.add('bubble');
    const start = 50;
	const end = 100;
	const unit = undefined;
	const onlyWholeNumbers = true;
	var size = just.random(start, end, unit, onlyWholeNumbers);
    $bubble.style.height = size;
    $bubble.style.width = size;
    // wrap in a larger div so bubbles are easy to pop while moving
    var $boundingBox = document.createElement('div');
    $boundingBox.classList.add('bubble-wrap');
    $boundingBox.style.left = (5 + (Math.random() * 90)) + 'vw';
    $boundingBox.appendChild($bubble);
    $boundingBox.addEventListener('click', destroyBubble($boundingBox));
    // attach to doc and return
    document.body.appendChild($boundingBox);
    return $boundingBox;
}
function createExplosion(x, y) {
    // create explosion at the coordinates
	    var $explosion = document.createElement('div');
	    $explosion.classList.add('explosion');
	    $explosion.style.left = x + 'px';
	    $explosion.style.top = y + 'px';
	    $explosion.innerHTML = explosionWords[Math.floor(Math.random() * 3)];
	    document.body.appendChild($explosion);
	    // animate cartoon pop on words
	    var timeline = just.animate({
	        targets: $explosion,
	        duration: 600,
	        fill: 'forwards',
	        easing: 'ease-out',
	        web: [
	            { scale: 1 },
	            { offset: 0.2, scale: 1.4, opacity: 1 },
	            { scale: .7, opacity: 0 }
	        ]
	    })
	   .on('finish', function () {
	   		document.body.removeChild($explosion);
	   });
	   timeline.play();
}
function destroyBubble($bubble) {
    return function () {
    		if($play){
		        // create explosion at bubbles old position
		        var rect = $bubble.getBoundingClientRect();
		        var centerX = (rect.right - rect.left) * .45 + rect.left;
		        var centerY = (rect.bottom - rect.top) * .45 + rect.top;
		        createExplosion(centerX, centerY);
		        updateScore(1);
		        // remove bubble
		        $bubble.style.display = 'none';
	    	}
    };
}
function generateBubbles(min, max) {
    var length = min + (Math.round(Math.random() * (max - min)));
    var targets = [];
    for (var i = 0; i < length; i++) {
        targets.push(createBubble());
    }
    return targets;
}
function animateBubbles() {

    var bubbles = generateBubbles(12, 20);


    var endTranslateY = just.random(100, 110, 'vh', true);
    var startScale = just.random(50, 100, null, true);
    var endScale = just.random(10, 80, null, true);
    const timeline = just.animate({
	    targets: bubbles,
	    duration: $speed,
	    easing: 'ease-in',
	    web: {
         	transform: [
                 	'translatey(-' + endTranslateY + ') scale(0.' + endScale + ')',
                     'translateY(0) scale(0.' + startScale + ')'
                 ]
	    }
	})

    timeline.on('finish', function () {
	    bubbles.forEach(function (bubble) {
	        document.body.removeChild(bubble);
	    })
    });


    $('#btnResume').click(function(e) {
    	$play = true;
    	$('.bg-overlay').addClass('hide');
    	$container.find('.content').css("display","none");
    	$('#btnResumeWrapper').css("display","none");
    	$('#btnPause').text('pause');
    	timeline.play();
    });

    if($play){
    	timeline.play();
    }


    $('#btnPause').click(function(e) {
    	$(this).text(function(i, text){
    	  if(text === "pause"){
    	  	timeline.pause();
    	  	$play = false;
    	  	$('.bg-overlay').removeClass('hide').hover(function() {
    	  		 $(this).find('.game-button').css("display","block");
    	  	});

    	  }	else{
    	  	timeline.play();
    	  	$play = true;
    	  }
          return text === "pause" ? "resume" : "pause";
        })
    });

    $('#btnReset').click(function() {
    	location.reload();
	});

    return timeline;
}
function startBubbles() {
    animateBubbles().on('finish', startBubbles);
}
function startWaves() {
    just.animate({
        targets: document.body,
        duration: 10000,
        fill: 'both',
        web: {
            backgroundColor: [
                'hsl(196, 92.2%, 20%)',
                'hsl(196, 92.2%, 15%)'
            ]
        },
        direction: 'alternate',
        iterations: Infinity
    }).play();
}
