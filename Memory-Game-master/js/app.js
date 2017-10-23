
/// Variables' Section ///

const CARDS_ICONS = ['fa-camera', 'fa-futbol-o', 'fa-anchor', 'fa-bug', 'fa-bicycle', 'fa-diamond', 'fa-twitter', 'fa-car',
'fa-camera', 'fa-futbol-o', 'fa-anchor', 'fa-bug', 'fa-bicycle', 'fa-diamond', 'fa-twitter', 'fa-car'];

const CARD_ICON_BASE_CLASSES = 'fa fa-lg game-icons';

const cssClasses = {
	flip : 'flip',
	show : 'show',
	correct: 'correct',
	wrong : 'wrong',
	fullScreen : 'fullScreen',
	dim : 'dim'
};



let startDate = new Date();

let timerID;

let moveCounter = 0;

let finalTime = startDate;

let cards = [];

let elemCard = document.getElementsByClassName('game-icons');

let stars = document.getElementsByClassName('fa-star');

let lastFlippedCard;

/// -----------------------------------------------------	End of Variables' Section -------------------------------------- ///


let Card = function(cardIcon) {
	let obj = Object.create(Card.prototype);
	obj.icon = cardIcon;
	obj.flipped = false;
	return obj;
};

Card.prototype.showCard = function() {
	this.flipped = true;
	this.htmlElement.className = updateElementClasses(this.htmlElement, cssClasses.flip, true);
	this.htmlElement.className = updateElementClasses(this.htmlElement, cssClasses.show, true);
};

Card.prototype.hideCard = function() {
 	this.flipped = false;
 	this.htmlElement.className = updateElementClasses(this.htmlElement, cssClasses.show, false);
 	this.htmlElement.className = updateElementClasses(this.htmlElement, cssClasses.flip, false);
};

Card.prototype.markCardCorrect = function() {
	this.correct = true;
	this.htmlElement = updateElementClasses(this.htmlElement, cssClasses.correct, true);
};
/* --------------------------------- end of Card Class Definition -------------------------------- */


///	------------------------------------- Functions' Section ---------------------------------- ///

//Starting the game borad

function startGameBoard() {
	let card;
	// Shuffle the game board icons
	let cardsIconsArr = shuffle(CARDS_ICONS);

	if(elemCard != null && cardsIconsArr != null && (elemCard.length === cardsIconsArr.length)) {

		// Load the card array
		for(let i = 0; i< cardsIconsArr.length; i++) {
			// Reset any added classes & add the updated one
			elemCard[i].className = `${CARD_ICON_BASE_CLASSES} ${cardsIconsArr[i]}`;
			// Create new card object
			card = new Card(cardsIconsArr[i]);
			card.htmlElement = elemCard[i].parentElement;
			card.index = i;
			cards.push(card);

			// Add onclick event listener
			card.htmlElement.addEventListener('click', function(event) {
				if(!cards[i].clicked) {
					cards[i].clicked = true;
					cardClickEvent(cards[i]);
				}
			});
		}

	} else {
		console.log(`Error: Game html cards element or/& Icons' array is empty`);
	}
}


//Flipping cards and adding moves to the counter
function cardClickEvent(card){
	if(!card.htmlElement.className.includes(cssClasses.show)){
		moveCounter++;
		document.getElementById('game-moves').innerHTML
			= moveCounter + ((moveCounter <= 1)?' Move':' Moves');
		calcualteMoveScore();
	}
	if(!card.correct) {
		if(!card.flipped) {
			card.showCard();
		}
		setTimeout(checkMatchingCards, 300, card);
	}
}

//Mixing the icons in the cards
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Giving the correct stars to the player
function calcualteMoveScore() {
	if(stars != null && stars.length === 3) {
		if(moveCounter > (cards.length * 2)) {
			updateElementClasses(stars[1], cssClasses.dim, true);
		} else if(moveCounter > cards.length) {
			updateElementClasses(stars[0], cssClasses.dim, true);
		}
	}
}

//One of the core function, this allow to incorporate or replace classes in the cards
function updateElementClasses(element, className, add) {
	if(add && !element.className.includes(className)) {
		element.className = `${element.className} ${className}`;
	} else if(!add && element.className.includes(className)) {
		element.className = element.className.replace(className, '');
	}
	return element.className;
}

//Correct cards behaviour,
function checkMatchingCards(card) {
	if(lastFlippedCard != null && card.index != lastFlippedCard.index) {
		if(lastFlippedCard.flipped && card.flipped && !lastFlippedCard.correct
			 && (card.icon === lastFlippedCard.icon)) {
			card.markCardCorrect();
			lastFlippedCard.markCardCorrect();
			lastFlippedCard = null;
			checkGameCompletetion();

		} else {
			updateElementClasses(card.htmlElement, cssClasses.wrong, true);
			updateElementClasses(lastFlippedCard.htmlElement, cssClasses.wrong, true);
			setTimeout(function() {
				alertWrongCards(card, lastFlippedCard);
			}, 500);
		}
	} else {
		lastFlippedCard = card;
	}

	setTimeout(function() {card.clicked = false;}, 1000);
}

//Wrong cards behaviour
function alertWrongCards(card, lastCard){

	card.hideCard();
	lastCard.hideCard();

	updateElementClasses(card.htmlElement, cssClasses.wrong, false);
	updateElementClasses(lastCard.htmlElement, cssClasses.wrong, false);

	lastFlippedCard = null;
}


//Detailing the modal and adding the template literals to the modal window.
function checkGameCompletetion() {
	for(let card of cards) {
		if(!card.correct) {
			return false;
		}
	}

	clearInterval(timerID);

	let dimmedStars = document.getElementsByClassName('dim').length;
	let succesMsg = document.getElementsByClassName('success-sub-msg')[0];
	succesMsg.innerHTML = succesMsg.innerHTML.replace('#{move}', moveCounter).replace(
		'#{time}', finalTime).replace(
		'#{stars}', `& with ${3-dimmedStars} ${((3-dimmedStars) > 1)?'stars' : 'star' }`);

	updateElementClasses(document.getElementById('game-modal'), cssClasses.fullScreen, true);
	updateElementClasses(document.getElementById('game-success'), cssClasses.fullScreen, true);

	document.getElementById('game-modal').addEventListener('click', function(){
		document.getElementById('game-modal').className
			= (document.getElementById('game-modal').className).replace(cssClasses.fullScreen, '');
		document.getElementById('game-success').className
			= (document.getElementById('game-success').className).replace(cssClasses.fullScreen, '');
	});

	return true;
}

//Getting the time to finish teh game
function startTimer() {
	finalTime = Math.round((new Date() - startDate)/1000);
	document.getElementById('game-time').innerHTML =`${finalTime} seconds` ;
}

///	------------------------- End of Functions' Section ------------------------- ///



// START THE GAME AND ENJOY :)
document.addEventListener('DOMContentLoaded',function(){
	startGameBoard();
	timerID = setInterval(startTimer, 1000);
});





