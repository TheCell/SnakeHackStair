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

	if (req.params.debug) console.log(settings)

	// our values
	const data = {
		color: "#DFFF00",
		name: "Cage Snake",
		head_url: "http://www.placecage.com/c/200/200",
		taunt: "Let's do thisss thang!"
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
