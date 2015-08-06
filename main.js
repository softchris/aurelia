export function configure(aurelia){
		aurelia.use
				.standardConfiguration()
				.plugin("aurelia-validation")
				.plugin("./resources/index")
				.developmentLogging()


		aurelia.start().then(a => a.setRoot() );
}