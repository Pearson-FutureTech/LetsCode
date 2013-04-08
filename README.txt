
 _          _          _____          _      _
| |        | |        / ____|        | |    | |
| |     ___| |_ ___  | |     ___   __| | ___| |
| |    / _ \ __/ __| | |    / _ \ / _` |/ _ \ |
| |___|  __/ |_\__ \ | |___| (_) | (_| |  __/_|
|______\___|\__|___/  \_____\___/ \__,_|\___(_) alpha


What is this?
-------------

Let's Code! is a prototype built by the Future Technologies team from Pearson.

It's designed to teach programming skills in a visually-led way. It's a web-based app 
for creating web-based apps.

Let's Code! provides two introductory 'lessons' with a clear narrative to help
students better understand the programming terminology and some of the subject matter
that they're seeing on screen. But it's also possible for students to explore
outside of those lessons, change parameters around as they like, and learn at their 
own pace and according to their own skill level.

Our key target audience is late primary / early secondary school students (Key Stage 
2/3). However, we feel that Let's Code! could be good for people of all ages with
little or no programming knowledge, as it provides an engaging and fun environment to
learn in. At the moment there's just one scenario (the Long Jump), but additional
scenarios could be added that are more tailored to younger or older age groups.

Give it a try - the lessons should explain things as you go along.



Where is it hosted?
-------------------

Let's Code! is up on GitHub Pages at:

http://letsc.de



To run locally
--------------

Let's Code! is currently completely client-side. However, it must be run from a
'server' (as opposed to simply launching index.html directly in the browser)
due to browsers' AJAX security limitations. 

On a Mac, you can easily run it up like this:

 - Load up a Terminal window

 - Change directory to the Let's Code! directory you've downloaded, by typing:
   cd [directory-path]
   For example:
   cd letscode

 - Then fire it up by typing:
   python -m SimpleHTTPServer

 - This will get the app running locally on port 8000, so fire up a browser and go
   to: http://localhost:8000/



Using and extending Let's Code!
-------------------------------

Please note that Let's Code! is a prototype application built in a short timeframe.
A number of features are mocked up or not yet implemented. It is certainly not a
completed product. However, we hope that it provides a starting point and conveys 
the concept.

There is more information on current limitations below.



Known Issues/Limitations
------------------------

 - Browser Support

Due to the tight prototype timing, we've not had time to fully test and
fix Let's Code! for all browsers. It works pretty well in the most recent versions of
most major browsers, with the notable exception of Internet Explorer. Google Chrome
has the best support, closely followed by Safari and Firefox. For anyone hoping to
fix it for other browsers, we wouldn't foresee there being any show-stopping issues,
except for IE 7 and lower (which probably wouldn't be worth the trouble, since the
whole thing is powered by JavaScript, so good JavaScript performance is a necessity).

 - Visual code view

Currently the Scratch-like visual code view is mocked up - the images are hard-coded 
for each method. The code view is actually showing the real code, though. The real 
app would need to have the ability to generate the visual view from the code 
dynamically.

 - Diverging from the tutorial steps

Currently, Let's Code! gets easily confused if you diverge from the defined tutorial
steps. For now, it's best to follow them step-by-step without doing other things in
between.

 - Other scenarios

We built Let's Code! with the aim that it should be easy to swap the Long Jump for
other scenarios. And it should be relatively easy to create new scenarios from
scratch. It's possible you may run into some issues though. You could start by taking
a look at where the 'longjump' scenario is defined in router.js (see the comments
there). Please let us know if you hit any hurdles.

 - Code editing

The major function missing from the prototype is the ability to actually edit the 
code. You can view the real code behind the methods, you can tweak properties through 
the visual view, and you can see that actually updates the code in the code view. But 
we'd also want the user to be able to edit the code directly, if they're comfortable 
doing that. It should then mirror the changes in the visual view. This would probably 
take a fair bit more work though, since we would need to handle errors, introduce 
debugging etc. Perhaps something like the open-source JSBin.com could help provide a 
starting point for this though...

 - Publishing

Publishing the app you've created is not yet implemented in this prototype. To build
Let's Code! out into a full application, it would need a server-side component with
the ability to save and share your project.

 - Very long jumps

An issue with the Long Jump scenario is that if you change the parameters to make the 
athlete jump very, very far, then you could be waiting a long time for him to reset 
back into the original position. Ideally there should be a timeout so you can get the 
result back without having to wait that long.



Editable, executable code
-------------------------

The tricky part of the development is in being able to treat the scenario code as 
dynamic and editable, so the user can edit things and see the results of their 
changes. We actually read in the scenario files and parse it using uglify.js. This 
processes it into a node tree (an Abstract Syntax Tree), which can be edited, and 
generated back into real code.

In theory that should work fine, but we found Uglify’s parser and processor to be a 
bit black-box-like and probably not really intended for this. The code to extract 
relevant parts of the code out from the AST is pretty messy. It works, but it's not 
very easy to understand. This would probably need to be a key area of development 
for Let's Code! in the future. (Possibly we would need to write something which
parses JS into a procedural object structure, with a human-readable interface).

Something that developers should be aware of is that we *eval* this editable code to 
execute it. This could raise security issues if Let's Code! is extended to allow
users to edit code and save and share their projects. It would need careful thought,
but for now it's worth noting that there are other prominent sites evaluating
user-edited JavaScript code, such as JSBin.com and jsFiddle, so it's not without
precedent.

This is an interesting discussion of JSBin's vulnerability to JavaScript hacks:

http://stackoverflow.com/questions/1732724/xss-on-jsbin-com

I think that Let's Code! would need to follow the same principle of avoiding
potentially destructive operations... I'd love to hear any advice people have about
this though.

Finally a word from "How evil is eval?":

"So how evil is eval? It's as evil as you make it. Use it with care, but use it if 
you need to - you'll be in good company"

http://javascriptweblog.wordpress.com/2010/04/19/how-evil-is-eval/



More info on the code structure
-------------------------------

To help structure the code in a nicely-separated "MVC-style" way, we're using 
Backbone.js. We're also using Require.js to simplify the code dependencies.

To begin to understand how it's set up, you might like to start by taking a look at 
router.js, at the top level of the 'js' directory. This is where we load the scenario 
templates, set up the model and render the top-level views. These top-level views 
then create their own sub-views...

It may be worth noting: This was our very first Backbone app, so it's likely we
haven't set it up in the best way - we would welcome any tips for improvements.



How scenarios are defined
-------------------------

Scenarios are defined through three files, which are read in dynamically:

 - objects.js

Defines the actual objects that can be added to the stage, the methods that make them 
do things, and the events that they fire. This is the code that's parsed using 
Uglify.js.

 - setup.js

JSON to define the initial properties of the objects to be displayed on the stage 
straight away, including the initial event->method hook-ups.

 - tutorials.js

JSON to define the tutorial steps.



Contributing Code
-----------------

If you extend or improve Let's Code!, we'd love you to submit a pull request and
contribute your additions back for everyone else to use too.

If you'd like us to pull your changes in, we'd be extra grateful if you could 
follow the existing coding style. In particular, it's worth noting:

 - The JS code is formatted with tabs rather than spaces.

 - We're using Less to write our stylesheets, so please compile to CSS from Less
   rather than editing the CSS files directly, i.e.:
   lessc -x less/global.less css/global.css (see http://lesscss.org/ for more info).

 - For production, we use the built, minified JavaScript at js/main.built.js.
   For development, you should switch over to use main.js and the original separate
   JS files - see the <head> section in index.html.

 - To rebuild main.built.js, install require.js through npm and run this command
   at the top level directory: r.js -o build-config.js


Credits
-------

Let's Code! was developed by Pearson's Future Technologies team.

 - Product Manager: Rene Bastijans
 - Lead Designer: Arun Vasudeva
 - Visual Designer: Lucinda Liu
 - Developer: Peter O'Shaughnessy
 - Contract Developer: Phil Powell

If you would like to get in touch, you can contact us at:
future_tech [at] pearson.com.



Third-party components
----------------------

The following third-party JavaScript libraries are included, subject to their
corresponding licenses:


- Backbone.js: Copyright (c) 2010-2013 Jeremy Ashkenas, DocumentCloud
  https://github.com/documentcloud/backbone/blob/master/LICENSE (MIT)

- Handlebars.js: Copyright (C) 2011 by Yehuda Katz
  https://github.com/wycats/handlebars.js/blob/master/LICENSE (MIT)

- JQuery: Copyright 2013 jQuery Foundation and other contributors
  http://jquery.com/
  https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt (MIT)

- JQuery UI: Copyright 2013 jQuery Foundation and other contributors,
  http://jqueryui.com/
  https://github.com/jquery/jquery-ui/blob/master/MIT-LICENSE.txt (MIT)

- JQuery UI Touch Punch: Copyright 2011, Dave Furfero
  http://touchpunch.furf.com/mit.txt (MIT)

- Require.js:  Copyright (c) 2010-2011, The Dojo Foundation
  https://github.com/jrburke/requirejs/blob/master/LICENSE (MIT or BSD)

- Require.js HandleBars plugin:
  https://github.com/SlexAxton/require-handlebars-plugin

- Sprite.js: Copyright (c) 2011 Batiste Bieler, https://github.com/batiste/sprite.js
  https://github.com/batiste/sprite.js/blob/master/LICENSE (MIT)
  [NB. We modified it to comment out a couple of lines - see the comments]

- Uglify.js: Copyright 2010 (c) Mihai Bazon <mihai.bazon@gmail.com>
  Based on parse-js (http://marijn.haverbeke.nl/parse-js/)
  https://github.com/mishoo/UglifyJS

- Underscore.js:  Copyright (c) 2009-2013 Jeremy Ashkenas, DocumentCloud
  https://github.com/documentcloud/underscore/blob/master/LICENSE (MIT)



--
See LICENSE.txt for our open source license details and copyright notice.
