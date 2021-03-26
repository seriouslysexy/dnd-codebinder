const Binder = require("./types/binder");
const DictionaryGenerator = require("./types/dictionaryGenerator");

var Chance = require("chance");
const chance = new Chance();

const createNewBinder = (req, res, next) => {
	// if (!req.body.binderName) {
	// 	return next("New binders require a name.");
	// } else if (typeof req.body.binderName !== "string") {
	// 	return next("Binder name must be a string.");
	// } else if (req.body.binderName has invalid chars) {
	// 	return next("Binder name must only contain allowed characters.");
	// }

	let uuid = chance.guid({version: 5})
	let dictGen = new DictionaryGenerator();
	let newDict = dictGen.generateDictionary();

	req.binder = new Binder(uuid, req.body.binderName, newDict.toJSON());

	return next();
}

const getBinderFromS3 = async (req, res, next) => {
	// if (!req.headers.binderUuid) {
	// 	return next("This request did not contain a reference to a remote state.")
	// }

	// req.binder = new Binder(req.headers.binderUuid);
	// await req.binder.getFromS3();

	return next();
}

const saveBinderToS3 = async (req, res, next) => {
	// await req.binder.storeToS3();
	return next();
}

const encodeMessage = (req, res, next) => {
	// validate words
	// req.binder.encodeMessage(req.body.words);

	return next();
}

const decodeMessage = (req, res, next) => {
	// validate glyphs
	// req.binder.decodeMessage(req.body.glyphs);

	return next();
}

module.exports = {
	createNewBinder,
	getBinderFromS3,
	saveBinderToS3,
	encodeMessage,
	decodeMessage
};