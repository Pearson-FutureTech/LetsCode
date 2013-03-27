[
	{
		"name": "myStage",
		"object": "Stage",
		"properties": {
		}
	},
	{
		"name": "mySun",
		"object": "Sun",
		"properties": {
			"left": 810,
			"top": 10
		}
	},
	{
		"name": "mySandpit",
		"object": "Sandpit",
		"properties": {
			"left": 546,
			"top": 362
		},
		"events": [
			{
				"name": "isFoul",
				"comment": "When the jump is marked as a foul",
				"listeners": [
					{
						"instance": "myScoreboard",
						"method": "setFoul"
					}
				]

			},
			{
				"name": "isClean",
				"comment": "When the jump is marked as clean (not a foul)",
				"listeners": [
					{
						"instance": "myScoreboard",
						"method": "setClean"
					}
				]
			}
		]
	},
	{
		"name": "myScoreboard",
		"object": "Scoreboard",
		"properties": {
			"left": 599,
			"top": 85
		}
	},
	{
		"name": "myAthlete",
		"object": "Athlete",
		"properties": {
			"left": 50,
			"top": 240
		},
		"events": [
			{
				"name": "whenRunFinishes",
				"comment": "When the athlete finishes his run-up",
				"listeners": [
					{
						"instance": "myAthlete",
						"method": "jump"
					},
					{
						"instance": "mySandpit",
						"method": "checkJump"
					}
				]
			},
			{
				"name": "whenJumpFinishes",
				"comment": "When the athlete finishes his jump",
				"listeners": [
					{
						"instance": "myScoreboard",
						"method": "update"
					},
					{
						"instance": "mySun",
						"method": "smile"
					}
				]
			}
		]
	}
]