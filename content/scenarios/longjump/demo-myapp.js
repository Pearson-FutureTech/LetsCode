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
	}
]
