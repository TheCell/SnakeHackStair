'use strict'

const express = require('express')
const router = express.Router()

const settings = {}

const map = []

const isOutOfBound = (x, y) => x < 0 || x > settings.smallWidth || y < 0 || y > settings.smallHeight

const _directions = {
	UP: "up",
	RIGHT: "right",
	BOTTOM: "bottom",
	LEFT: "left",
  0: "up",
  1: "right",
  2: "bottom",
  3: "left"
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

  console.log("settings.setup", settings.setup);
  console.log("settings.width", settings.width);
  console.log("settings.smallWidth", settings.smallWidth);
  console.log("settings.height", settings.height);
  console.log("settings.smallHeight", settings.smallHeight);
  console.log("settings.game_id", settings.game_id);
	}

	// our values
  if (req.params.debug) {
      var data = {
      color: "#42f47d",
      name: "Beemo",
      head_url: "http://dev.thecell.eu/beemo/beemo_500.gif", // optional, but encouraged!
      taunt: "Outta my way!"
    }
  }
  else
  {
    var data = {
		color: "#f46b42",
		name: "Beemo",
		head_url: "http://dev.thecell.eu/beemo/beemo_500.gif", // optional, but encouraged!
		taunt: "Outta my way!"
  	}
  }

	return res.json(data)
})

/*
  Handle Game Loop
*/
router.all('/:debug?/move', function(req, res) {

	if (req.params.debug) {
		settings.debugSnakeId = req.body.you;
		console.log("debugSnakeId", settings.debugSnakeId);
		let snakesArr = req.body.snakes;
		snakesArr.forEach(function(snake, index) {
			if (snake.id == settings.debugSnakeId) {
				updateSnakeHead(snake.coords[0][0], snake.coords[0][1])
			}
		});
	}

	// update map
	resetMap()

	for (let i = 0, food; food = req.body.food[i]; i++) map[food[1]][food[0]] = -5

	for (let snake of req.body.snakes) {

		let head = snake.coords[0]
		if (!isOutOfBound(head[0] + 1, head[1])) {
     map[head[1]][head[0] + 1] = 5
    }
		if (!isOutOfBound(head[0] - 1, head[1])) {
     map[head[1]][head[0] - 1] = 5
    }
		if (!isOutOfBound(head[0], head[1] + 1)) {
     map[head[1] + 1][head[0]] = 5
    }
		if (!isOutOfBound(head[0], head[1] - 1)) {
     map[head[1] - 1][head[0]] = 5
    }

    for (let i = 0, coords; coords = snake.coords[i]; i++) map[coords[1]][coords[0]] = 10

	}

	for (let snake of req.body.dead_snakes) {
		for (let i = 0, coords; coords = snake.coords[i]; i++) map[coords[1]][coords[0]] = 10
	}

	let nextMoveString = nextMove();

  // Response data
  if (req.params.debug) {
    console.log(map)
    console.log("nextMove", nextMoveString);
  }

	const data = {
		move: nextMoveString, // one of: ['up','down','left','right']
		taunt: 'Outta my way, snake!'
	}

	return res.json(data)
})

function cost(x, y) {

	if (isOutOfBound(x, y)) return 10

	return map[x][y]
}

function nextMove() {
  // up, right, down, left
  let movementCost = [];

  movementCost[0] = cost(snakeHeadPos[0], snakeHeadPos[1] - 1);
  movementCost[1] = cost(snakeHeadPos[0] + 1, snakeHeadPos[1]);
  movementCost[2] = cost(snakeHeadPos[0], snakeHeadPos[1] + 1);
  movementCost[3] = cost(snakeHeadPos[0] - 1, snakeHeadPos[1]);

  let minIndex = indexOfMin(movementCost);
	return _directions[minIndex];
}

function updateSnakeHead(x, y) {
	console.log("update snake head: ", x, y);
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
