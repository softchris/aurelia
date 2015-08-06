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