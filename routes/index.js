const express = require('express')
const router = express.Router()

const settings = {}

const map = []
const _directions = {
	UP: "up",
	RIGHT: "right",
	BOTTOM: "bottom",
	LEFT: "left"
}

// x, y
const snakeHeadPos = [0, 0];

/*
  Handle Game Start
*/
router.all('/:debug?/start', function(req, res) {

	if (!settings.setup) {

		// save init values
		settings.setup = true
		settings.width = req.body.width * 1
		settings.smallWidth = settings.width - 1
		settings.height = req.body.height * 1
		settings.smallHeight = settings.height - 1
		settings.game_id = req.body.game_id

		// setup map
		for (let y = 0; y < settings.height; y++) map.push(new Array(settings.width))

		resetMap()

	}

	// our values
	const data = {
		color: "#f46b42",
		name: "Beemo",
		head_url: "http://dev.thecell.eu/beemo/beemo_500.gif", // optional, but encouraged!
		taunt: "Outta my way!"
	}

	return res.json(data)
})

/*
  Handle Game Loop
*/
router.all('/:debug?/move', function(req, res) {

	// update map
	resetMap()

	for (let i = 0, food; food = req.body.food[i]; i++) map[food[1]][food[0]] = -5

	for (let i = 0, snake; snake = req.body.snakes[i]; i++) {

		let head = snake.coords[0]
		if (isOutOfBound(head[1] + 1, head[0])) map[head[1] + 1][head[0]] = 5
		if (isOutOfBound(head[1] - 1, head[0])) map[head[1] - 1][head[0]] = 5
		if (isOutOfBound(head[1], head[0] + 1)) map[head[1]][head[0] + 1] = 5
		if (isOutOfBound(head[1], head[0] - 1)) map[head[1]][head[0] - 1] = 5

		for (let j = 0, coords; coords = snake.coords[j]; j++) map[coords[1]][coords[0]] = 10

	}

	for (let i = 0, snake; snake = req.body.dead_snakes[i]; i++) {
		for (let j = 0, coords; coords = snake.coords[j]; j++) map[coords[1]][coords[0]] = 10
	}

	if (req.params.debug) console.log(map)

	// Response data
	const data = {
		move: nextMove(), // one of: ['up','down','left','right']
		taunt: 'Outta my way, snake!'
	}

	return res.json(data)
})

const isOutOfBound = (x, y) => x < 0 || x > smallWidth || y < 0 || y > smallHeight

function cost(x, y) {

	if (isOutOfBound(x, y)) return 10

	return map[x][y]
}

function nextMove() {
	// up, right, down, left
	let movementCost = [];

	movementCost[0] = cost(snakeHeadPos.x, snakeHeadPos.y - 1);
	movementCost[1] = cost(snakeHeadPos.x + 1, snakeHeadPos.y);
	movementCost[2] = cost(snakeHeadPos.x, snakeHeadPos.y + 1);
	movementCost[3] = cost(snakeHeadPos.x - 1, snakeHeadPos.y);

	let minIndex = indexOfMin(movementCost);
	return _directions[minIndex];
}

function updateSnakeHead(x, y) {
	snakeHeadPos[0] = x;
	snakeHeadPos[1] = y;
}

function resetMap() {
	for (let y = 0; y < settings.height; y++) map[y].fill(0)
}

function indexOfMin(arr) {
	if (arr.length === 0) {
		return -1;
	}

	var min = arr[0];
	var minIndex = 0;

	for (var i = 1; i < arr.length; i++) {
		if (arr[i] < min) {
			minIndex = i;
			min = arr[i];
		}
	}

	return minIndex;
}

module.exports = router
