const express = require('express')
const router = express.Router()

const settings = {}

const map = []

const _directions = {
	UP: "up",
	RIGHT: "right",
	BOTTOM: "down",
	LEFT: "left",
	0: "up",
	1: "right",
	2: "down",
	3: "left"
}

// x, y
const snakeHeadPos = [0, 0]

/*
  Handle Game Start
*/
router.all('/:debug?/start', function(req, res) {

	if (settings.game_id != req.body.game_id || req.body.width != settings.width || req.body.height != settings.height) {

		// save init values
		settings.width = req.body.width * 1
		settings.smallWidth = settings.width - 1
		settings.height = req.body.height * 1
		settings.smallHeight = settings.height - 1
		settings.maxDistance = settings.height * settings.height + settings.width * settings.width

		settings.game_id = req.body.game_id

		// setup map
		map.length = 0
		for (let y = 0; y < settings.height; y++) map.push(new Array(settings.width))

		resetMap()

	}

	// our values
	if (req.params.debug) {
		var data = {
			color: "#42f47d",
			name: "Beemo",
			head_url: "http://dev.thecell.eu/beemo/beemo_500.gif",
			taunt: "Beep Boop!"
		}
	} else {
		var data = {
			color: "#f46b42",
			name: "Beemo",
			head_url: "http://dev.thecell.eu/beemo/beemo_500.gif",
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
		settings.debugSnakeId = req.body.you

		let snakesArr = req.body.snakes
		for (let snake of req.body.snakes) {
			if (snake.id == settings.debugSnakeId) {
				snakeHeadPos = snake.coords[0]
				break
			}
		}

	}

	// update map
	resetMap()

	for (let i = 0, food; food = req.body.food[i]; i++) {

		if (food[0] < 0 || food[0] > settings.smallWidth || food[1] < 0 || food[1] > settings.smallHeight) continue

		for (let y = 0; y < settings.height; y++) {
			for (let x = 0; x < settings.width; x++) {

				let cSquare = Math.pow(x - food[0], 2) + Math.pow(y - food[1], 2)
				let height = mapFunction(cSquare, 0, settings.maxDistance, -90, 0)

				map[y][x] = Math.min(height, map[y][x])

			}
		}


	}


	for (let snake of req.body.snakes) {

		// possible head movements
		if (snake.id != settings.debugSnakeId) {

			let head = snake.coords[0]
			if (!isOutOfBound(head[0] + 1, head[1])) map[head[1]][head[0] + 1] = 5
			if (!isOutOfBound(head[0] - 1, head[1])) map[head[1]][head[0] - 1] = 5
			if (!isOutOfBound(head[0], head[1] + 1)) map[head[1] + 1][head[0]] = 5
			if (!isOutOfBound(head[0], head[1] - 1)) map[head[1] - 1][head[0]] = 5

		}

		// elevate ground around the snakes
		for (let i = 0, coords; coords = snake.coords[i]; i++) {
			map[coords[1]][coords[0]] = 10

			// snake to short, no elevation needed
			if (i < 8) continue


			for (let y = 0; y < settings.height; y++) {
				for (let x = 0; x < settings.width; x++) {

					//  don't chnage the food object
					if (map[y][x] < -88) continue

					let cSquare = Math.pow(x - coords[0], 2) + Math.pow(y - coords[1], 2)

					// to fare away
					if (cSquare > 20) continue

					let height = mapFunction(cSquare, 0, 20, 0, 11)
					map[y][x] = Math.min(height + map[y][x], 10)

				}
			}
		}

		// draw the snakes again with the highest possible value
		for (let i = 0, coords; coords = snake.coords[i]; i++) map[coords[1]][coords[0]] = 11

	}

	let nextMoveString = nextMove()

	if (req.params.debug) {
		//printMap()
		//console.log("nextMove", nextMoveString)
	}

	const data = {
		move: nextMoveString, // one of: ['up','down','left','right']
		taunt: 'Outta my way, snake!'
	}

	return res.json(data)
})

function cost(x, y) {

	if (isOutOfBound(x, y)) return 11

	// expensive corners
	if (x == 0 && y == 0) return 4
	if (x == 0 && y == settings.smallHeight) return 4
	if (x == settings.smallWidth && y == 0) return 4
	if (x == settings.smallWidth && y == settings.smallHeight) return 4

	return map[y][x]
}

function nextMove() {
	// up, right, down, left
	let movementCost = [
		cost(snakeHeadPos[0], snakeHeadPos[1] - 1),
		cost(snakeHeadPos[0] + 1, snakeHeadPos[1]),
		cost(snakeHeadPos[0], snakeHeadPos[1] + 1),
		cost(snakeHeadPos[0] - 1, snakeHeadPos[1])
	]

	let minIndex = indexOfMin(movementCost)

	return _directions[minIndex]
}

function resetMap() {
	for (let y = 0; y < settings.height; y++) map[y].fill(0)
}

function indexOfMin(arr) {
	if (arr.length === 0) return -1

	let min = arr[0]
	let minIndex = 0

	for (let i = 1; i < arr.length; i++) {
		if (arr[i] < min) {
			minIndex = i
			min = arr[i]
		}
	}

	return minIndex
}


function isOutOfBound(x, y) {
	return x < 0 || x > settings.smallWidth || y < 0 || y > settings.smallHeight
}

function mapFunction(s, a1, a2, b1, b2) {
	return b1 + (s - a1) * (b2 - b1) / (a2 - a1)
}

function printMap() {
	let out = ""
	for (let y = 0; y < settings.height; y++) {
		out += "["
		for (let x = 0; x < settings.width; x++) out += map[y][x].toFixed(3) + "\t"
		out += "]\n"
	}

	console.log(out)
}


module.exports = router
