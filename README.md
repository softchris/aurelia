# Aurelia
ecmascript 2015 = ecmascript 6

- github.com/aurelia
- app-contacts , demo app

## Prerequisits

	- nodejs
	- jspm, npm install jspm -g

### setup github credentials

	jspm registry config github

	enter username + password when prompted

## Structures ES6
### import / export

importing..

	import { SomeType } from './type'  // type.js

exporting..

	// type.js
	export class SomeType{

	}

### first app

	app.js
	greeter.js
	index.html

1) put yourself in root dir and run

	jspm init
Questions:

	type in where public folder is
	type in where to put packages
2) Change index.html

	<body>
		<script src="jspm_packages/system.js"></script>
		<script src="config.js"></script>
		<script>
			System.import("app") //app.js
		</script>
	</body>
3) edit app.js

	import { sayHello } from 'greeter'
	sayHello();
4) edit greeter.js

	var message = 'hello';

	export function sayHello(){
		alert(message);
	}




## Get started

	jspm install aurelia-framework
	jspm install aurelia-bootstrapper

1) edit index.html

	<body aurelia-app>
		<script src="jspm_packages/system.js"></script>
		<script src="config.js"></script>
		<script>
			System.import("aurelia-bootstrapper") //app.js
		</script>
	</body>
2) edit app.js

	export class App{
		constructor(){
			this.message = "hello from aurelia";
		}
	}
3) create app.html

	<template>
		<div>${message}</div>
	</template>
4) optional - create activate method, automatically called

	export class App{
		constructor(){
			this.message = "hello from aurelia";
		}

		activate(){
			this.message2 = "I will be set too";
		}
	}
5) extending template, app.html

	<template>
		<div>${message}</div>
		<button click.trigger="change()" >change</button>
	</template>
6) add code to app.js to handle click

	export class App{
		constructor(){
			this.message = "hello from aurelia";
		}

		activate(){
			this.message2 = "I will be set too";
		}

		change(){
			this.message = "new message"
		}
	}
## Extending the app
Adding a composition

	<template>
		
		<compose view-model="currentDate"></compose>

		
	</teamplte>

1) adding currentDate.js and currentDate.html

2) currentDate.js

	export class currentDate{
		constructor(){
			this.date = new Date().toDateString();
		}	
	}

3)  currentDate.html

	<template>
		${ date }
	</template>
### adding http helper

	jspm install aurelia-http-client

### editing app.js

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

### editing app.html

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

### using injections instead

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

OR

	import { inject } from "aurelia-framework"

	@inject(HttpClient)  // ES7 
	export class App...

ALSO , we need to turn that feature ON
	
	config.js

	System.config({
		"babelOptions" : {
			"optional" : [
				"es7.decorators"
			]
		}
	},..)
	
### defining a service/component movieData.js

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

	usage in app.js:

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

## bootstrapping

1) Give the app tag a name
	<body aurelia-app ="main">
		<script src="jspm_packages/system.js"></script>
		<script src="config.js"></script>
		<script>
			System.import("aurelia-bootstrapper") //app.js
		</script>
	</body>
2) create main.js

	export function configure(aurelia){
		aurelia.use
				.standardConfiguration()
				.developmentLogging();

		aurelia.start().then(a => {
			a.setRoot();
		})
	}

## routing
To make routing work we need to do two things

- Add configuration on which routes exist
- Add a placeholder html tag where the content will end up <router-view>

### Setup
1) Adding router configuration to app.js

	configureRouter(config, router){
		this.router = router;

		config.map([
				{ route : "", moduleId : "start/start", title : "Start", nav : true },
				{ route : "about", moduleId : "about/about", title : "About", nav : true },
				{ route : "avengers", moduleId : "avengers/list", title : "List all avengers", nav : true, name : 'avengers' },
				{ route : "details", moduleId : "avengers/details", title : "Avenger detail", name : "details" }
			]);
	}
2) Adding <router-view> to app.html
This is called adding a placeholder area, if you come from angular 1.x this is ng-view
### First example
So this is what a complete routing example looks like, but lets break it d - o - w -n.

1) First thing that happens is that we save a reference to router, more on that later

2) Second thing is that we add a number of entries by calling **config.map()**

An entry

	{ route : "", moduleId : "start/start", title : "Start", nav : true }

**route** : "",  same thing as /

**moduleId**, is pointing to a module that has a component class and a template, in this case start.html and start.js

**title**, a title we can refer to in a template for example

**nav**, a property that tells us wether this is part of a collection we can refer to a in the template, yes thats right aurelia provides us with an easy way to create a main menu

All routes being marked with **nav:true** are available in **router.navigation**. so creating a main menu can be easily accomplished by doing

	<ul class="nav navbar-nav">
		<li repeat.for="row of router.navigation" class="${row.isActive ? 'active' : ''}" >
			<a  href.bind="row.href"> ${ row.title } </a>
		</li>
	</ul> 


### Second example, list + detail page
Let's take another scenario, a list page with a route to a detail page, what would that look like

Let's say the list entry looks like this

	{ route : "avengers", moduleId : "avengers/list", title : "List all avengers", nav : true, name : 'avengers' }
**nav.true** says its part of our main menu.

Let's have a look at the list page template **avengers/list.html**

	<tr repeat.for="avenger of avengers">
		<td>
			${ avenger.name }
		</td>
		<td>
			<a route-href="route:details; params.bind:{ id:avenger.id }" class="btn btn-default">Details</a>
		</td>
	</tr>
Here we loop all the items but we also build up our detail route

	route-href="route:details; params.bind:{ id:avenger.id }"
We do 2 things, we specify the name of the route and we also bind in a value so we get the following

**name** : details
**id** : avenger.id, set when looping the collection

This becomes http://domainname/details?id=1



So there is a nice GOTCHA here when setting up the routes. If you were to specify the route entry like this

	{ route : "details", moduleId : "avengers/details", title : "Avenger detail" }
It WON'T WORK. But you say, I did specify the route:details and route says details in the entry. Yea.. well it looks at the name property actually. So to make it work add a name property like so

	name : "details"
So it becomes

	{ route : "details", moduleId : "avengers/details", title : "Avenger detail", name : "details" }


## Working with templates

### Interpolation
It's always one way binding

Between elements
${ property }

Evaluated
<a href= "${ property }"

### Bind
This is either one-way or two way
Binded on a value it is two way, binded on an href or style it is one way

style.bind="property"

OR

value.bind="property"

### Custom components

Imagine you have a snippet like a menu that is reusable, you can do this in 2 ways, either the 
	
- require-way

OR 

- global-way
#### Require
1) create **nav-menu.html** and **nav-menu.js** under **/resources**

2) move the navbar snippet from app.html to nav-menu.html, like so

	<template>
		<nav class="navbar navbar-inverse">
			<div class="container-fluid">
				<div class="navbar-header">
					<a href="#" class="navbar-brand">
						Avengers
					</a>
				</div>
				<ul class="nav navbar-nav">
					<li repeat.for="row of router.navigation" class="${row.isActive ? 'active' : ''}" >
						<a  href.bind="row.href"> ${ row.title } </a>
					</li>
				</ul>
			</div>
		</nav>
	</template>
3) create tag in app.html and bind to the router

	<nav-menu router.bind="router"></nav-menu>
4) create nav-menu.js class

	import { bindable } from "aurelia-framework";
	
	export class NavMenu{
		@bindable router = null;
	}
5) add a require to app.html so that aurelia knows how to find it
	
	<require from="./resources/nav-menu"></require>
#### Global resource

1) Go to main.js and add a plugin entry, like so

	aurelia.use
				.standardConfiguration()
				.plugin("aurelia-validation")
				.plugin("./resources/index") // this row
				.developmentLogging()

2) create /resources/index.js and bootstrap resources plugin

	export function configure(aurelia){
		aurelia.globalizeResources('./nav-menu');
	}


In the future when you need to add more components, its just a matter of adding an entry here..