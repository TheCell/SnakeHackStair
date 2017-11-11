const express = require('express')
const router = express.Router()

const settings = {}
const map = []
/*
  Handle Game Start
*/
router.all('/:debug?/start', function(req, res) {
	// save init values
	settings.width = req.body.width
	settings.height = req.body.height
	settings.game_id = req.body.game_id

	settings.debug = !!req.params.debug

	// setup
	for (let x = 0; x < width; x++) {
		let row = []
		for (let y = 0; y < height; y++) row.push(0)
		map.push(row)
	}

	if (settings.debug) console.log(settings)

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

	if (settings.debug) console.log(req.body)
	if (settings.debug) console.log(req.body.snakes[0].coords)

	// Response data
	const data = {
		move: 'up', // one of: ['up','down','left','right']
		taunt: 'Outta my way, snake!'
	}

	return res.json(data)
})

function cost(x, y) {

	// if x < 0
  if (x < 0) return 10;
  if (y < 0) return 10;
  if (x > settings.width -1) return 10;
  if (y > settings.height -1) return 10;

	return map[x][y]

}

module.exports = router
