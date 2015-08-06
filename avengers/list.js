import { Avengers } from './services';
import { inject } from "aurelia-framework"

@inject(Avengers)
export class List{

	constructor(avengers){
		this.message = "from aurelia framework2";
		this.service = avengers;
	}
	
	activate(){
		this.service.getAll().then(data => {
			this.avengers =	data;
		});
	}

	add(){
		console.log(this.newAvenger);
		// post it to service
	}
}