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
	settings.height = req.body.height * 1
	settings.game_id = req.body.game_id

	console.log("width is", (typeof req.body.width))

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

	resetMap()

	//if (settings.debug) console.log(req.body)
	//if (settings.debug) console.log(req.body.snakes[0].coords)

	// Response data
	const data = {
		move: 'up', // one of: ['up','down','left','right']
		taunt: 'Outta my way, snake!'
	}

	return res.json(data)
})

function cost(x, y) {

	if (x < 0) return 10;
	if (y < 0) return 10;
	if (x > settings.width - 1) return 10;
	if (y > settings.height - 1) return 10;

	return map[x][y]

}

function resetMap() {
	for (let y = 0; y < settings.height; y++) map[y].fill(0)
}

module.exports = router
