const app = require("./app");
const middlewares = require("./middlewares");

app.get("/",
	(req, res, next) => {
		// return frontend
		res.send("Hello World");
	}
);

app.post("/new-binder",
	middlewares.createNewBinder,
	middlewares.saveBinderToS3,
	(req, res, next) => {
		res.send(req.binder.uuid);
	}
);

app.get("/binder",
	middlewares.getBinderFromS3,
	(req, res, next) => {
			res.send(req.binder.returnGlyphDataForFrontend());
	}
);

app.patch("/binder",
	middlewares.getBinderFromS3,
	(req, res, next) => {
			// add codes
			// save binder back
			res.send("Hello World");
	}
);

app.get("/message/decode",
	middlewares.getBinderFromS3,
	(req, res, next) => {
			// attempt to decode a message, converting known symbols to words and unknown symbols to UNKNOWN
			res.send("Hello World");
	}
);

app.get("/message/encode",
	middlewares.getBinderFromS3,
	(req, res, next) => {
			// attempt to encode a message, converting words to known symbolds and unknown words to UNKNOWN 
			res.send("Hello World");
	}
);