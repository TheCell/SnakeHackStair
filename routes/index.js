const express = require('express')
const router = express.Router()

const settings = {}
/*
  Handle Game Start
*/
router.all('/:debug?/start', function(req, res) {
	// save init values
	settings.width = req.body.width
	settings.height = req.body.height
	settings.game_id = req.body.game_id

	settings.debug = req.params.debug

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
router.all('/move', function(req, res) {

	// Response data
	const data = {
		move: 'up', // one of: ['up','down','left','right']
		taunt: 'Outta my way, snake!'
	}

	return res.json(data)
})

module.exports = router
