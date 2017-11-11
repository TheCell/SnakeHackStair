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

/*
  Handle Game Start
*/
router.all('/:debug?/start', function(req, res) {
	// save init values
	settings.width = req.body.width * 1
	settings.smallWidth = settings.width - 1
	settings.height = req.body.height * 1
	settings.smallHeight = settings.height - 1
	settings.game_id = req.body.game_id

	settings.debug = !!req.params.debug

	// setup map
	for (let y = 0; y < settings.height; y++) map.push(new Array(settings.width))

	resetMap()

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
router.all('/debug?/move', function(req, res) {

	// update map
	resetMap()

	for (let i = 0, food; food = res.body.food[i]; i++) map[food[0]][food[1]] = -5

	for (let i = 0, snake; snake = res.body.snakes[i]; i++) {

		let head = snake.coords[0]
		if (isOutOfBound(head[0] + 1, head[1])) map[head[0] + 1][head[1]] = 5
		if (isOutOfBound(head[0] - 1, head[1])) map[head[0] - 1][head[1]] = 5
		if (isOutOfBound(head[0], head[1] + 1)) map[head[0]][head[1] + 1] = 5
		if (isOutOfBound(head[0], head[1] - 1)) map[head[0]][head[1] - 1] = 5

		for (let j = 0, coords; coords = snake.coords[j]; j++) map[coords[0]][coords[1]] = 10

	}

	for (let i = 0, snake; snake = res.body.dead_snakes[i]; i++) {
		for (let j = 0, coords; coords = snake.coords[j]; j++) map[coords[0]][coords[1]] = 10
	}


	// movement


	if (settings.debug) console.log(map)

	// Response data
	const data = {
		move: 'up', // one of: ['up','down','left','right']
		taunt: 'Outta my way, snake!'
	}

	return res.json(data)
})

const isOutOfBound = (x, y) => x < 0 || x > smallWidth || y < 0 || y > smallHeight

function cost(x, y) {

	if (isOutOfBound(x, y)) return 10

	return map[x][y]

}

function resetMap() {
	for (let y = 0; y < settings.height; y++) map[y].fill(0)
}

module.exports = router
