import { HttpClient } from "aurelia-http-client";
import { inject } from "aurelia-framework";

@inject( HttpClient )
export class Avengers{
	constructor(httpClient){
		this.baseUrl = 'http://somedomain/'
		this.http = httpClient;
	}
	
	getAll(){
		return this
			.http
			.get('data/avengers.json')
			.then( response => { 
				return response.content; 
			});
	}

	getById(id){
		return this.http.get('data/avengers.json').then( response => {
			var item = response.content.find( x => x.id == id );
			return item;
		});
	}

	update(avenger){
		var request = this.http.createRequest();
		request.asPut()
			   .withUrl( `${baseUrl}/avengers`)
			   .withHeader("Accept","application/json")
			   .withHeader("Content-Type","application/json")
			   .withContent(avenger)

		return request.send().then(response => response.content );
	}
}