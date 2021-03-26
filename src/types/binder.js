const { s3, bucketName } = require("../s3");
const { ListObjectsCommand, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

class Binder {
	constructor(uuid, name, dictionary) {
		if (!uuid) {
			throw "Binders require a UUID.";
		}

		this._uuid = uuid;
		this._knownGlyphs = [];
		this._name = name || "";
		this._dictionary = dictionary || {};
	}

	set knownGlyphs(knownGlyphs) {
		this._knownGlyphs = knownGlyphs;
	}

	get knownGlyphs() {
		return this._knownGlyphs;
	}

	set uuid(uuid) {
		this._uuid = uuid;
	}

	get uuid() {
		return this._uuid;
	}

	set name(name) {
		this._name = name;
	}

	get name() {
		return this._name;
	}

	set dictionary(dictionary) {
		this._dictionary = dictionary;
	}

	get dictionary() {
		return this._dictionary;
	}

	getAwsKeyname() {
		return this._uuid + ".json";
	}

	async getFromS3() {
		let binderData = await new Promise((resolve, reject) => {
			s3.send(new GetObjectCommand({Bucket: bucketName, Key: this.getAwsKeyname()})).then((response, err) => {
				if (err) {
					console.log("getFromS3 err", err);
					return reject(err);
				}

				let fileData = "";

				response.Body.on('data', (chunk) => { fileData += chunk.toString("utf-8") });
				response.Body.on('end', () => {
					try {
						let parsedData = JSON.parse(fileData);
						return resolve(parsedData);
					} catch (parseErr) {
						console.log("getFromS3 parseErr", parseErr);
					}
				});
			});
		});

		this.dictionary = binderData.dictionary;
		this.knownGlyphs = binderData.knownGlyphs;
		this.name = binderData.name;

		return;
	}

	async storeToS3() {
		try {
			await s3.send(new PutObjectCommand({
				Bucket: bucketName,
				Key: this.getAwsKeyname(),
				Body: JSON.stringify(this.toJSON())
			}));
		} catch (err) {
			console.log("storeToS3 err", err);
		}
	}

	returnGlyphDataForFrontend() {
		let data = {glyphs: {}, types: {}};
		for (let glyphName of this.knownGlyphs) {
			data.glyphs[glyphName] = this.dictionary[glyphName];
		}
		data.types = this.dictionary.types;
		return data;
	}

	addGlyph(glyphName) {
		if (this.dictionary.glyphs[glyphName]) {
			this.knownGlyphs.push(glyphName);
		} else {
			throw "That glyph does not exist and cannot be added to the binder";
		}
	}

	encodeMessage(words) {
		// todo: reimagine this since reimplementing glyphs


		// iterate over words, getting glyph for each one
		// preserve newlines
		// assemble into... image?
		// also encode message data into QR code for easy reading later
		// return image?
		return;
	}

	decodeMessage(glyphs) {
		// todo: reimagine this since reimplementing glyphs


		// search image for qr code
		// read qr code into message/glyph data
		// convert to words
		return;
	}

	toJSON() {
		return {
			name: this.name,
			uuid: this.uuid,
			knownGlyphs: this.knownGlyphs,
			dictionary: this.dictionary
		};
	}
}

module.exports = Binder;