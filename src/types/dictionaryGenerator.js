const { ALL_WORDS } = require("../enums/words");
const GlyphGenerator = require("./glyphGenerator");
const Dictionary = require("./dictionary");

class DictionaryGenerator {
	constructor(glyphGenConfig) {
		this._dictionary = new Dictionary();
		this._generator = new GlyphGenerator(glyphGenConfig);

		this.generateDictionary();
	}

	generateDictionary() {
		for (let wordObj of ALL_WORDS) {
			// iterate over each word
			// generate a glyph for it
			// make sure glyph signature does not already exist in this._glyphSignatures
			// if it does, regenerate until it doesn't
			// add signature to this._glyphSignatures and add words data + encoded glyph to dictionary
			this.generateGlyphForWord(wordObj);
		}

		return this._dictionary;
	}

	generateGlyphForWord(wordObj) {
		let glyph = this._generator.generateGlyph();
		let sig = glyph.getSignature();
		if (!this._dictionary.getSignature(sig)) {
			let glyphData = {
				type: wordObj.type,
				glyph: glyph.getEncoded()
			}; 
			this._dictionary.addGlyph(wordObj.word, glyphData, sig);
		} else {
			// todo: does this save memory during recursion?
			// glyph = null;
			// sig = null;
			this.generateGlyphForWord(wordObj);
		}
	}
}

module.exports = DictionaryGenerator;