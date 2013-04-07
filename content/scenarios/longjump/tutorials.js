[
	{
		"project": "Long Jump",
		"name": "Lesson 1",
		"description": "Introduction to the Let's Code! interface",
		"steps": [
			{
				"contents": "<p>This is the main screen of Let's Code!.</p><p>Let's take a tour...</p>",
				"fadeSelector": "#toolbar, #editpanel, #stage",
				"continue": true
			},
			{
				"contents": "<p>This central area is called the <dfn>Stage</dfn>, and it's where the app that you're creating is displayed.</p>",
				"highlightSelector": "#stage",
				"fadeSelector": "#toolbar, #editpanel",
				"continue": true
			},
			{
				"contents": "<p>At the top is a <dfn>toolbar</dfn>, where you can do a number of things on the project you're working on.</p>",
				"highlightSelector": "#toolbar",
				"fadeSelector": "#editpanel, #stage",
				"continue": true,
				"substeps": [
					{
						"contents": "<p>The project you're working on is shown here.</p>",
						"highlightSelector": "#tb-projname",
						"arrowDirection": "top"
					},
					{
						"contents": "<p>You can go <dfn>back</dfn> and <dfn>forward</dfn> through steps that you've taken with the buttons here.</p>",
						"highlightSelector": "#tb-undo",
                        "stepClass": "undoredo-buttons",
                        "arrowDirection": "top"
					},
					{
						"contents": "<p>Your work is saved automatically.</p><p>You can <dfn>close</dfn> the project and return to the home screen at any time.</p>",
						"highlightSelector": "#tb-close",
                        "stepClass": "close-button",
                        "arrowDirection": "top"
					}
				]
			},
            {
                "contents": "<p>At the top is a <dfn>toolbar</dfn>, where you can do a number of things on the project you're working on.</p>",
                "highlightSelector": "#toolbar",
                "fadeSelector": "#editpanel, #stage",
                "continue": true,
                "substeps": [
                    {
                        "contents": "<p>Use <dfn>Edit</dfn> mode to edit your app, and <dfn>Preview</dfn> mode to see how it runs.</p>",
                        "highlightSelector": "#tb-editpreview",
                        "arrowDirection": "top"
                    },
                    {
                        "contents": "<p>When you're ready to share your app, you can <dfn>Publish</dfn> it to the web so that others can use it.</p>",
                        "highlightSelector": "#tb-publish",
                        "stepClass": "publish-button",
                        "arrowDirection": "top"
                    },
                    {
                        "contents": "<p>Click on <dfn>Help</dfn> at any time to get assistance on what you're doing.</p>",
                        "highlightSelector": "#tb-help",
                        "stepClass": "help-button",
                        "arrowDirection": "top"
                    }
                ]
            },
			{
				"contents": "<p>Below the stage is the <dfn>editing panel</dfn>, where we can edit our project.</p><p>We'll go through this in more detail later.</p>",
				"highlightSelector": "#editpanel",
				"fadeSelector": "#toolbar, #stage",
                "arrowDirection": "bottom",
                "continue": true
			},
			{
				"contents": "<p>On the stage are various <dfn>objects</dfn>, each of which can be edited and made to work with each other.</p>",
				"description": "Introduction to objects",
				"highlightSelector": ".sprite",
				"continue": true
			},
			{
				"contents": "<p>Click on an object on the stage to select it so that it can be edited.</p><p><instruction>Select the athlete object</instruction> by clicking on the object on the stage.</p>",
				"highlightSelector": ".[data-object=Athlete]",
				"arrowDirection": "top",
				"objectToClick": "myAthlete"
			},
			{
				"contents": "<p>On top is a box with the name, or <dfn>id</dfn> of the object. We can see that this object has the id <dfn>myAthlete</dfn>.</p><p>(We'll talk about the other boxes in the next lesson.)</p>",
				"highlightSelector": ".[data-object=Athlete]",
				"arrowDirection": "top",
				"continue": true
			},
			{
				"contents": "<p>We can also see the <dfn>id</dfn> of the object we selected in the <dfn>object selector</dfn> box here.</p><p>We can also select an object by clicking this box and choosing from a list of all the objects on the stage.</p>",
				"highlightSelector": "#btn-selobject",
				"arrowDirection": "left",
				"continue": true
			},
			{
				"contents": "<p>The <dfn>id</dfn> is known as a <dfn>property</dfn> of the object, so we can say the property with the <dfn>name</dfn> 'id' has the <dfn>value</dfn> 'myAthlete'.</p><p>The <dfn>properties tab</dfn> below allows us to edit the properties for the selected object.</p>",
				"highlightSelector": "#tab-properties",
				"arrowDirection": "bottom",
				"continue": true,
				"showTab": "#tab-properties",
				"substeps": [
					{
						"contents": "<p>Name</p>",
						"highlightSelector": "#detailspanel .propitem:eq(0) a:eq(0)",
						"stepClass": "property-name",
						"arrowDirection": "bottom"
					},
					{
						"contents": "<p>Value</p>",
						"highlightSelector": "#detailspanel .propitem:eq(0) input",
						"stepClass": "property-value",
						"arrowDirection": "bottom"
					}
				]
			},
			{
				"contents": "<p>The left and top properties of each object control its position on the stage.</p><p><instruction>Click and drag on the object</instruction> to move it on the stage, and you can see the left and top values update.</p>",
				"highlightSelector": ".[data-object=Athlete]",
				"stepClass": "athlete-edit",
				"showTab": "#tab-properties",
				"objectToUpdate": "myAthlete",
                "substeps": [
                    {
                        "contents": "<p>Left and top values</p>",
                        "highlightSelector": "#detailspanel .propitem:eq(1) input",
                        "arrowDirection": "bottom"
                    }
                ]
            },
			{
				"contents": "<p>You can see that the left and top values have changed to reflect the new position.</p><p>We can also edit the properties here.</p><p><instruction>Click on the value for the left property, change it to 100, and press enter</instruction>:</p>",
				"highlightSelector": "input[name=left]",
				"arrowDirection": "left",
				"objectToUpdate": "myAthlete"
			},
			{
				"contents": "<p>Now <instruction>change the top property to 240</instruction> in the same way.</p>",
				"highlightSelector": "input[name=top]",
				"arrowDirection": "left",
				"objectToUpdate": "myAthlete"
			},
			{
				"contents": "<p>Well done! You've learned the basics of Let's Code!, and how to view and edit properties.</p><p>In the next lesson, we'll add a new object to the stage, and make the athlete do something!</p>",
				"continue": true
			}
		]
	},
    {
        "project": "Long Jump",
        "name": "Lesson 2",
        "description": "Objects, Methods and Events",
        "steps": [
            {
                "contents": "<p>In this lesson, we're going to add a new object to the stage, and also learn about making objects work with each other.</p><p>In this way, we can create an interactive game that can respond to your inputs.</p>",
                "continue": true
            },
            {
                "contents": "<p>First, we're going to add a button to the stage, to tell our athlete to perform a long jump.</p><p><instruction>Click the add new object button</instruction> to get a list of all the objects that we can add to our project:<p>",
				"highlightSelector": "#btn-addobject",
                "stepClass": "add-new-object",
                "arrowDirection": "bottom",
				"elementToClick": "#btn-addobject"
            },
            {
                "contents": "<p>We're going to add a button, so <instruction>click on the item labelled Button</instruction>...</p>",
				"highlightSelector": "#library ul li:eq(1)",
				"arrowDirection": "left",
				"elementToClick": "#library ul li:eq(1)"
            },
            {
                "contents": "<p>We can see a new button appear on the stage...</p>",
				"highlightSelector": "[data-object=Button]",
                "stepClass": "select-new-button",
                "arrowDirection": "top",
                "continue": true
            },
            {
                "contents": "<p>Now <instruction>move it over here</instruction> by dragging it:</p>",
				"stepClass": "drag-button-here",
                "arrowDirection": "top",
                "objectToUpdate": "Button1"
            },
            {
                "contents": "<p>We can see our new button's properties in the editing panel.</p><p>Let's change the button's label, by setting the <dfn>label</dfn> property.</p><p><instruction>Change the label</instruction> of the button to <em>Go!</em> now:</p>",
                "arrowDirection": "bottom",
				"highlightSelector": "input[name=label]",
				"objectToUpdate": "Button1"
            },
            {
                "contents": "<p>Great! we now have a new button properly set up and ready to go.</p><p>However, when we click on the button, nothing happens yet.<p>For that, we need to introduce the idea of <dfn>methods</dfn> and <dfn>events</dfn>.</p>",
                "continue": true
            },
            {
                "contents": "<p>First, <instruction>select our athlete object</instruction> again:</p>",
                "stepClass": "select-athlete",
                "arrowDirection": "bottom",
				"highlightSelector": "[data-object=Athlete]",
				"objectToClick": "myAthlete"
            },
            {
                "contents": "<p>You can see a list of items on the left-hand side of the brackets.</p><p>These are known as <dfn>methods</dfn>, and can be thought of as commands that the object knows how to respond to.</p>",
                "arrowDirection": "bottom",
				"highlightSelector": "[data-object=Athlete] .edit-methods",
                "stepClass": "object-methods",
                "continue": true
            },
            {
                "contents": "<p>If you hover the mouse cursor over each one in turn, you can see a description of what each method does.</p><p><instruction>Try hovering over each method</instruction> now:</p>",
                "arrowDirection": "bottom",
				"highlightSelector": "[data-object=Athlete] .edit-methods",
				"stepClass": "object-methods",
                "continue": true
            },
            {
                "contents": "<p>You'll also notice that the methods are shown in the <dfn>edit panel</dfn> too.</p><p>If you click on a method, either here or in the edit panel, that method is selected in the main panel.</p>",
                "arrowDirection": "bottom",
                "highlightSelector": "[data-object=Athlete] .edit-methods",
                "stepClass": "object-methods",
                "continue": true,
                "substeps": [
                    {
                        "contents": "<p>Methods can be selected here too</p>",
                        "highlightSelector": "#methodlistpanel",
                        "arrowDirection": "bottom"
                    }
                ]
            },
            {
                "contents": "<p>We can also double-click on a method to make the object run that method.</p><p><instruction>Double-click on the 'run' method</instruction> and see what happens:</p>",
				"arrowDirection": "bottom",
				"highlightSelector": "[data-object=Athlete] .edit-methods li:eq(1)",
                "stepClass": "object-methods",
                "elementToDoubleClick": "[data-object=Athlete] .edit-methods li:eq(1)",
                "nextStepDelay": 4500
            },
            {
                "contents": "<p>We can see that the <dfn>run</dfn> method made the athlete do a run-up and jump, as the method's description suggested.</p><p>We'll explore how that happened later, but we can see that running the method made that object do something.</p>",
				"continue": true
            },

            {
                "contents": "<p>In the same way, we have a list of <dfn>events</dfn> to the right of the object.</p><p>Each one tells us when a certain thing happens to that object, so that we can do something.</p>",
                "arrowDirection": "bottom",
                "highlightSelector": "[data-object=Athlete] .edit-events",
                "stepClass": "object-events",
                "continue": true
            },
            {
				"contents": "<p>We're going to look at the events for the button we added.</p><p>So <instruction>select our button object</instruction> again:</p>",
				"highlightSelector": "[data-object=Button]",
				"arrowDirection": "left",
				"objectToClick": "Button1"
			},
            {
                "contents": "<p class=\"left\">Our button has 2 events defined:</p><p class=\"left\"><dfn>click</dfn> is an event that happens when the button is clicked by the user.</p><p class=\"left\"><dfn>hover</dfn> is an event that happens when the user moves their mouse over the button.</p>",
				"highlightSelector": "[data-object=Button] .edit-events",
                "stepClass": "see-button-events",
                "arrowDirection": "left",
                "continue": true
            },
            {
                "contents": "<p>In this case, we want to make the athlete perform his run and jump (i.e. call the <dfn>run</dfn> method) when the button is clicked (when the <dfn>click</dfn> event happens).</p><p>To do this, <instruction>click on the 'click' event</instruction> to start:</p>",
				"highlightSelector": "[data-object=Button] .edit-events li:eq(0)",
                "arrowDirection": "left",
				"elementToClick": "[data-object=Button] .edit-events li:eq(0)"
            },
            {
                "contents": "<p>We can now see all the methods that can be connected to this event.</p><p><instruction>Click on the 'run' method</instruction> on the athlete to connect the button to that method.</p>",
				"highlightSelector": "[data-object=Athlete] .edit-methods li:eq(1)",
                "arrowDirection": "left",
				"elementToClick": "[data-object=Athlete] .edit-methods li:eq(1)"

            },
			{
				"contents": "<p>Great. Now <instruction>click on the button</instruction> again:</p>",
				"arrowDirection": "top",
				"highlightSelector": "[data-object=Button]",
				"objectToClick": "Button1"
			},
            {
                "contents": "<p>If you hover over the <dfn>click</dfn> event you can see it is connected to the <dfn>run</dfn> method of <dfn>myAthlete</dfn>.</p>",
                "highlightSelector": "[data-object=Button]",
                "arrowDirection": "top",
                "continue": true
            },
            {
                "contents": "<p>Now <instruction>double-click the 'click' event</instruction>, and you'll see what will happen when the button is clicked in the final app:</p>",
                "highlightSelector": "[data-object=Button]",
                "arrowDirection": "top",
                "elementToDoubleClick": "[data-object=Button] .edit-events li:eq(0)",
                "nextStepDelay": 4500
            },
            {
				"contents": "<p>Now let's stop editing our stage, and preview how the finished app will work.</p><p><instruction>Click the <dfn>Preview</dfn> button</instruction> to switch to preview mode:</p>",
				"highlightSelector": "#btn-preview",
				"arrowDirection": "top",
				"elementToClick": "#btn-preview",
				"nextStepDelay": 1500
			},
			{
				"contents": "<p>Now the button can be clicked just like a normal button. We should see the same result as double-clicking the <dfn>click</dfn> event in Edit mode.</p><p><instruction>Go ahead and click the button</instruction>, and see the athlete run!</p>",
				"highlightSelector": "[data-object=Button]",
				"arrowDirection": "top",
				"elementToClick": "[data-object=Button]",
				"nextStepDelay": 4500
			},
			{
				"contents": "<p>Well done!</p><p>You've now learned how to add objects to the stage and link events to methods to make things happen!</p><p>If you'd like to keep exploring, you could try changing the athlete's properties and see how far you can make him jump!</p>",
				"continue": true
			}
        ]
    }
]
