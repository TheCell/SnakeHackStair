var express = require('express')
var router = express.Router()

// Handle POST request to '/start'
router.all('/start', function(req, res) {
	// NOTE: Do something here to start the game

	// Response data
	var data = {
		color: "#f46b42",
		name: "Beemo",
		head_url: "http://dev.thecell.eu/beemo/beemo_500.gif", // optional, but encouraged!
		taunt: "Outta my way!", // optional, but encouraged!
	}

	return res.json(data)
})

// Handle POST request to '/move'
router.all('/move', function(req, res) {
	// NOTE: Do something here to generate your move

	// Response data
	var data = {
		move: 'up', // one of: ['up','down','left','right']
		taunt: 'Outta my way, snake!', // optional, but encouraged!
	}

	return res.json(data)
})

module.exports = router
