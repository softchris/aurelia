import { Avengers } from './services';
import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Validation } from "aurelia-validation";

@inject(Avengers, Router, Validation )
export class Edit{
	constructor(avengers, router, validation){
		this.service = avengers;
		this.router = router;
		this.validation = validation.on(this)
			.ensure("avenger.name")
				.isNotEmpty()
				.hasMinLength(3)
				.hasMaxLength(100)
			.ensure("avenger.id")
				.isNotEmpty()
				.isNumber()
			.ensure("avenger.allegiance")
				.isNotEmpty()
				.hasMinLength(3)
	}

	activate(params){
		this.service.getById( params.id ).then( avenger => {
			this.avenger = avenger;
		} );
	}

	update(){
		this.validation.validate().then(() => {
			// list route
			let url = this.router.generate("avengers");

			// detail route
			let urlDetail = this.router.generate("details", { id : this.avenger.id });
			this.router.navigate(urlDetail);
		}, (err) => {
			console.log(err);
		});
		
	}
}