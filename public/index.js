var explosionWords = ['Pop!', 'Snap!', 'Crack!'];
var bubblesPopped = 0;
var $score = document.getElementById('score');
var $container = $('.container');
var $speed = 10000;
var $play = false


function updateScore(offset) {
    bubblesPopped += offset;
    $score.innerHTML = 'Popped ' + bubblesPopped + ' bubbles!';
}

 $(".dial").knob({
        'release' : function (value) {
        	$speed = value * 1000
       }

	});

$('#btnPlay').click(function(e) {
		$play = true;
    	$('.content').fadeToggle("fast");
    	$('.bg-overlay').removeClass();
    	$('.game-controls').removeClass("hide");
    	$('.game-score').removeClass("hide");
    	$('.game-button').removeClass("hide")
    	startBubbles();
		startWaves();
    });

function createBubble() {
    // create bubble graphic
    var $bubble = document.createElement('div');
    $bubble.classList.add('bubble');
    const start = 10;
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
    if($play){
	    var $explosion = document.createElement('div');
	    $explosion.classList.add('explosion');
	    $explosion.style.left = x + 'px';
	    $explosion.style.top = y + 'px';
	    $explosion.innerHTML = explosionWords[Math.floor(Math.random() * 3)];
	    document.body.appendChild($explosion);
	    // animate cartoon pop on words
	    just.animate({
	        targets: $explosion,
	        to: 600,
	        fill: 'forwards',
	        easing: 'ease-out',
	        css: [
	            { scale: 1 },
	            { offset: 0.2, scale: 1.4, opacity: 1 },
	            { scale: .7, opacity: 0 }
	        ]
	    })
	   .on('finish', function () {
	   		console.log('$explosion',$explosion);
	   		document.body.removeChild($explosion);
	   });
    }
}
function destroyBubble($bubble) {
    return function () {

	        // create explosion at bubbles old position
	        var rect = $bubble.getBoundingClientRect();
	        var centerX = (rect.right - rect.left) * .45 + rect.left;
	        var centerY = (rect.bottom - rect.top) * .45 + rect.top;
	        createExplosion(centerX, centerY);
	        updateScore(1);
	        // remove bubble
	        $bubble.style.display = 'none';
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
	    duration: 5000,
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



    if($play){
    	console.log('play');
    	timeline.play();
    }

    $('#btnPause').click(function(e) {
    	timeline.pause();
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


