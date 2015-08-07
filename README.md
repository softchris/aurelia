# Aurelia
So you want to look at the next generation js mvc framework.

What you need to know before starting is that next generation means using Ecmascript 6 or Ecmapscript 2015 as it is now called. Also some features from ES7 can be used.

Aurelia was built by one Rob Eisenberg famous for creating the Durandal framework but also being an angular core member for a time before leaving to build Aurelia.

Aurelia and the whole Ecmascript 2015 is a nice experience. If you are like me and have coded some NodeJs you will feel right at home.

Let's begin

## Prerequisits
To build anything with Aurelia you need two things installed

- NodeJs
- jspm

You can grab NodeJs from its download page and jspm can be installed via NPM like so:

	npm install jspm -g

### setup github credentials
Before starting out it is a good idea to setup your github credentials for the reason that jspm will want to download a lot of repos from github anonymously. Github has a repo limit but not if you are authenticated. To set it up:

	jspm registry config github

## Your first app
So you pulled down jspm, you setup github credentials. Before building our first aurelia app let's build something simple just to make sure that everything works with Ecmascript 2015

Create the following files:

	app.js
	greeter.js
	index.html
Type the following in a console window 

	jspm init
This will start a dialog that you can for now just pass through without any changes. It will also prepare for any future downloads of for example Aurelia.

Let's edit our project files

1) edit **greeter.js**

	var message = 'hello';

	export function sayHello(){
		alert(message);
	}
So the **export** means this function will be part of the public api. Compare 
module.exports in NodeJs. Everything else is private.

2) edit **app.js**

	import { sayHello } from 'greeter'
	sayHello();
So the **import** means that we pull in greeter.js and access its public api, i.e the sayHello function we exposed by adding the keyword **export**

3) edit **index.html**

	<body>
		<script src="jspm_packages/system.js"></script>
		<script src="config.js"></script>
		<script>
			System.import("app") //app.js
		</script>
	</body>

This line points out the starter file for our application

	System.import("app") //app.js
These lines are needed to get the whole thing setup, more on those later

	<script src="jspm_packages/system.js"></script>
	<script src="config.js"></script>

CONCLUSION

So that was simple right we created an app using Ecmascript 2015. Of course there is much more to it but using the import functionality is really a powerful thing. For now we need a transpiler, a converter to ES5 to make the importer work but soon it will work natively.

## Your first Aurelia app
Ok so now we got some basics down, let's create something with Aurelia
Start fresh by creating a new directory. Within that directory run

	jspm init

### Install
In a console window run:

	jspm install aurelia-framework
	jspm install aurelia-bootstrapper

Create the following files:

	index.html
	app.js
	app.html

1) edit **app.js**
	
	export class App{
		constructor(){
			this.message = "hello from aurelia";
		}
	}
Ok so this is just a simple class that we export. Yes *class* is a new concept in ecmascript 2015. Another weird part is that instead of writing

	function name(){}
You type, provided you are inside a class construct 

	name(){

	}

2) edit **app.html**

	<template>
		<div>${message}</div>
	</template>

So this is obviously a view but whats interesting is the root *template* tag. For every component view that is created in aurelia it needs to have template as its root tag.

And another thing, we used Aurelias templating namely

	${message}
**message** is as a property on the App class, compare it with using $scope in angular 1.x.	

3) edit **index.html**

	<body aurelia-app>
		<script src="jspm_packages/system.js"></script>
		<script src="config.js"></script>
		<script>
			System.import("aurelia-bootstrapper") //app.js
		</script>
	</body>
So we have the needed script tags from before

	<script src="jspm_packages/system.js"></script>
	<script src="config.js"></script>
We changed the System.import to use Aurelias bootstrapper, like so:

	System.import("aurelia-bootstrapper") //app.js

That's it, that all you need to create a really simple Aurelia app

To run it: 
From the console run 

	http-server -p 5000
open up a browser and surf to http://localhost:5000
 
## Second Aurelia app - talk to the backend
So a SPA application wouldn't be that usable if it couldn't use some functionality to do ajax calls. In Aurelia this is called http-client

### Install

	jspm install aurelia-http-client

### Fetch data

1) Edit app.js

	import { HttpClient } from "aurelia-http-client"

	export class App{
		constructor(){
			this.message = "hello from aurelia";
			this.http = new HttpClient();
		}

		activate(){
			this.message2 = "I will be set too";
			return this.http.get('/movies.json').then( response => {
				this.movies = response.content;
			});
		}

		change(){
			this.message = "new message"
		}
	}
Let's break it down.
First we import the http-client

	import { HttpClient } from "aurelia-http-client"
Secondly we create an instance and assigns it to a class member

	this.http = new HttpClient();
Thirdly we add an activate method and does a backend call. The activate method is being called automatically by Aurelia. Another interesting thing is that we use something called an arrow function.

	activate(){
		this.message2 = "I will be set too";
		return this.http.get('/movies.json').then( response => {
			this.movies = response.content;
		});
	}
Backend call, like with angular 1.x talking to the backend returns a promise where I can get my data by calling then with a function. But with a difference. Instead of doing 

	this.http.get('url').then(function(response){  })
We can now use an arrow function, a lambda for those of you who are c# or java 8 coders. So we can write it like this instead

	this.http.get('/movies.json').then( response => {
		this.movies = response.content;
	});

### Use a loop construct
Of course we want to display our data. In Aurelia you use the repeat construct like so:

app.html

	<template>
		<table>
			<tr>
				<th...
			</tr>
			<tr repeat.for="movie of movies">
				<td>${ movie.title }</td>
			</tr>
		</table>
	</template>	

### Improving the solution
#### Inject
We don't need to instantiate the http-client. We can just inject it instead and let Aurelia handle that

	export class App{
		constructor( httpClient ){
			this.message = "hello from aurelia";
			this.http = httpClient;
		}

		static inject(){ return [ HttpClient ]; }

		activate(){
			this.message2 = "I will be set too";
			return this.http.get('/movies.json').then( response => {
				this.movies = response.content;
			});
		}

		change(){
			this.message = "new message"
		}
	}

We added the following to our class

	static inject(){ return [ HttpClient ]; }
And also we added it as a parameter to our constructor

	constructor( httpClient ){
		this.message = "hello from aurelia";
		this.http = httpClient;
	}

However we can make this even nicer. Lets use the ES7 feature **inject**

Edit **config.js**

	System.config({
		"babelOptions" : {
			"optional" : [
				"es7.decorators"
			]
		}
	},..)
The important line to add is

	"es7.decorators"
With this enabled we can replace the inject function with this:

	import { inject } from "aurelia-framework"

	@inject(HttpClient)  // ES7 
	export class App{
#### Move data fetch to its own service
Ok so right now everything is in app.js. Not very nice, RIGHT?
Oki so we create movieData.js

Edit **movieService.js**

	import { inject } from "aurelia-framework"

	@inject(HttpClient)  // ES7 
	export class MovieService{
		constructor( httpClient ){
			this.http = httpClient
		}

		getAll () {
			return this
					.http
					.get(baseUrl)
					.then(response => {
						return response.content;		
					})
		}
	}
Edit **app.js**

	import { inject } from "aurelia-framework"
	import { MovieService } from './movieData';

	@inject(MovieService)
	class App{
		constructor(movieService){
			movieService.then(response => {
				this.movies = response;
			})
		}
	}

## Third aurelia app - routing + binding
So at this point for our app to really be a SPA it needs routing. 

We need to do 2 things. 
- Activate routing.
- Setup our routes

1) Edit **index.html**

	<body aurelia-app ="main">
		<script src="jspm_packages/system.js"></script>
		<script src="config.js"></script>
		<script>
			System.import("aurelia-bootstrapper") //app.js
		</script>
	</body>

So what did we add? We added **aurelia-app ="main"** in the body tag
Which means we say that main.js is our bootstrap file

2) Edit **main.js**

	export function configure(aurelia){
		aurelia.use
				.standardConfiguration()
				.developmentLogging()


		aurelia.start().then(a => a.setRoot() );
	} 

There are a lot of things that can be bootstrapped here. For now we only add the following two rows:

	aurelia.use
				.standardConfiguration()
				.developmentLogging()
And also a command to start the Aurelia app

	aurelia.start().then(a => a.setRoot() );

3) Edit **app.js**

	export class App{

		configureRouter(config, router){
			this.router = router;
	
			config.map([
				{ route : "", moduleId : "start/start", title : "Start", nav : true },
				{ route : "about", moduleId : "about/about", title : "About", nav : true },
				{ route : "avengers", moduleId : "avengers/list", title : "List all avengers", nav : true, name : 'avengers' },
				{ route : "details", moduleId : "avengers/details", title : "Avenger detail", name : "details" },
				{ route : "edit", moduleId : "avengers/edit", title : "Avenger edit", name : "edit" }
			]);
		}
	
		constructor(){
			this.message = "from aurelia framework2";
		}
		
		activate(){
			this.message2 = "set as well";
			
		}
	}

We added the method **configureRouter**. We also injected **config** and **router**. Config is used to setup your routes and router is used for keeping track of your routing dictionary but also to navigate between routes.

So for an angular 1.x dev I would say config is $routeProvider and router is $location. This isn't entirely accurate but still a fair comparison.

What else is happening 

A default route to **/** looks like

	{ route : "", moduleId : "start/start", title : "Start", nav : true }
**moduleId** : tells it look for 

	start/start.js
and use template

	start/start.html 
We don't have controllers + template anymore as in angular 1.x. We have class + template. 

**nav** is a nifty property that lets you add it to a collection on the router object so it can be used to create a main menu

**name** is the name route has if you want to refer to it in code

**title** is the display name

So I mentioned that **nav** property can be used to create a main menu. But how.

Lets edit **app.html**

	<ul class="nav navbar-nav">
		<li repeat.for="row of router.navigation" class="${row.isActive ? 'active' : ''}" >
			<a  href.bind="row.href"> ${ row.title } </a>
		</li>
	</ul>
We are using a repeater construct and loops **router.navigation** list which contains all routes with **nav=true**. Nice function right?

And lastly where do my pages end up. Well go into app.html and add

	<router-view></router-view>
This is where your modules will be rendered

### Bindings
Ok so far we havn't done much in terms of editing data or handling clicks. Let's see how

Aurelia uses a one way binding
	
	${ prop }
To display values in a template

Aurelia uses a smart binding that either turns into a one-way or two-way binding like so:

	<input value.bind="prop" /> // becomes a two-way binding
But in the following case it becomes a on-way binding cause that is the only thing that makes sense:

	<a  href.bind="row.href"> ${ row.title } </a>

### Constructing a master detail
So we wired up all the routes and managed to create a main menu.
But what about a more advanced example. What about a list view + detail page.

#### List view
A list view is likely to loop all the items and for each item have a link to a detail page probably on this format link?id=x. Here is how:

	<table class="table table-striped">
			<tr>
				<th>Name</th>
				<th>&nbsp;</th>
				<th>&nbsp;</th>
			</tr>
			<tr repeat.for="avenger of avengers">
				<td>
					${ avenger.name }
				</td>
				<td>
					<a route-href="route:details; params.bind:{ id:avenger.id }" class="btn btn-default">Details</a>
				</td>
				<td>
					<a route-href="route:edit; params.bind:{ id:avenger.id }" class="btn btn-default">Edit</a>
				</td>
			</tr>
		</table>

Here is how the link is constructed

	<a route-href="route:details; params.bind:{ id:avenger.id }" class="btn btn-default">Details</a>
In the attribute **route-href** we refer to **route:details** which is the name property of the route and then we call **params.bind** to add an id property to the link. 

So it becomes 

	http://domain/edit?id=3 

Internally this is translated to **avengers/details**
Which means we load **avengers/details.js** as the module class and **avengers/details.html** as its template

#### Detail view
Ok so we came to the detail module avengers/details.js

What we want is to load the correct data given the routing parameter **id**
Here is how:

	import { Avengers } from './services';
import { inject } from "aurelia-framework"

	@inject(Avengers)
	export class Details{
		constructor(avengers){
			this.name = "default";
			this.service = avengers; 
		}
	
		activate(params){
			this.service.getById( params.id ).then( avenger => this.avenger = avenger );
		}
	}

**params** gets injected in the activate method and **params.id** contains the router parameter data. From then we can just to a data call and fetch up our data.

One more thing a detail view should have a back link to get back to the list view

So the detail view should look like this **avengers/details.html**:

	<template>
		<div class="container">
			<p>
				<h2>${ avenger.name }</h2>
			</p>
			<p>
				<a route-href="route:avengers" class="btn btn-default">Back to list</a>
			</p>
		</div>
	</template>
With route-href created like so:

	route-href="route:avengers"


### Clicks

you have two ways to handle clicks in Aurelia they are

- delegate
- trigger

	<button click.trigger="save()">save</button>
OR

	<button click.delegate="save()">save</button>
The difference is that *delegate* can handle click calls from child elements as well where *trigger* only acts on the element that was clicked

## Fourth aurelia app - resusable components.
From angular 1.x you were used to using directives everywhere and yes Aurelia supports a similar concept. It can be achieved in two ways

- as a composition 
OR 
- as a custom element

### Composition
A composition looks like the following

	<compose view-model="./currentDate">
This will look up currentDate.js and use currentDate.html as its template. Pretty simple.

### Custom element

But you say I am used to using my own html tags. Well you can type for example

	<menu></menu>. 	

You can do this in two ways.

- import
- as a plugin

Importing it means you explicitly need to specify where template + class is residing like so

	<import from='./menu'></import>
And to use it

	<menu></menu>

A better way is to in your bootstrap file create a plugin directory where all your custom elements exists

Edit **main.js**

	.plugin("./resources/index")
This points out a directory **resources/index.js**
Where all your custom elements are

Edit **resources/index.js**

	export function configure(aurelia){
		aurelia.globalizeResources('./menu');
		...
	}
**globalizeResources** points out 

**menu.js** + **menu.html** in local directory

Then you are free to use your custom element anywhere you feel like.

Thats all folks hopefully you have a better understanding of Aurelia.

For further reading:

	http://aurelia.io/docs.html
I also created a github repo for everything I just mentioned

	https://github.com/softchris/aurelia




	