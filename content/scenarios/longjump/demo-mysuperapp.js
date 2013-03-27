[
	{
		"name": "myGoButton",
		"object": "Button",
		"properties": {
			"left": 200,
			"top": 59,
			"label": "Go!"
		},
		"events": [
			{
				"name": "click",
				"comment": "When the button is clicked by the user",
				"listeners": [
					{
						"instance": "myAthlete",
						"method": "run"
					}
				]
			}
		]
	},
	{
		"name": "myNumberBox",
		"object": "NumberBox",
		"properties": {
			"left": 20,
			"top": 60,
			"value": 6
		},
		"events": [
			{
				"name": "change",
				"comment": "When the user writes or edits the number in the box",
				"listeners": [
					{
						"instance": "myAthlete",
						"method": "setRunSteps"
					}
				]
			}
		]
	},
	{
		"name": "myLabel",
		"object": "Label",
		"properties": {
			"left": 20,
			"top": 40,
			"label": "Run steps"
		}
	}
]
