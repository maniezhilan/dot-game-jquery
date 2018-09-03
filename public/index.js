

var explosionWords = ['Pop!', 'Snap!', 'Crack!'];
var bubblesPopped = 0;
var $score = document.getElementById('score');
var $pause = document.getElementById('btnPause');

function updateScore(offset) {
    bubblesPopped += offset;
    $score.innerHTML = 'Popped ' + bubblesPopped + ' bubbles!';
}

function pauseAll(){
	console.log('pause');
	$pause.click(function() {

    	$( "bubble" ).each(function( index ) {
  			console.log( index + ": " + $( this ).pause());
		});
	});
}
function createBubble() {
    // create bubble graphic
    var $bubble = document.createElement('div');
    $bubble.classList.add('bubble');
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
        .on('finish', function () { return document.body.removeChild($explosion); });
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
    var player = just.animate({
        targets: bubbles,
        to: '5s',
        easing: 'ease-in',
        css: {
            transform: function () {
                var endTranslateY = just.random(100, 110, 'vh', true);
                var startScale = just.random(80, 100, null, true);
                var endScale = just.random(40, 80, null, true);
                return [
                    'translateY(0) scale(0.' + startScale + ')',
                    'translatey(-' + endTranslateY + ') scale(0.' + endScale + ')'
                ];
            }
        },
        delay: function () {
            return just.random(0, 10000);
        }
    })
        .on('finish', function () {
        bubbles.forEach(function (bubble) {
            document.body.removeChild(bubble);
        });
    });
    return player;
}
function startBubbles() {
    animateBubbles().on('finish', startBubbles);
}
function startWaves() {
    just.animate({
        targets: document.body,
        to: '10s',
        fill: 'both',
        css: {
            backgroundColor: [
                'hsl(196, 92.2%, 20%)',
                'hsl(196, 92.2%, 15%)'
            ]
        },
        direction: 'alternate',
        iterations: Infinity
    });
}
startBubbles();
startWaves();

