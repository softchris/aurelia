import { inject } from "aurelia-framework"

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
	
	change(){
		this.message = "changed";			
	}
}