class Dictionary {
	constructor(glyphs, types, signatures) {
		this._signatures = signatures || {};
		this._glyphs = glyphs || {};
		this._types = types || {};
	}

	addGlyph(glyphName, glyphData, signature) {
		if (this._signatures[signature]) {
			throw "Refusing to add duplicate signature.";
		} else if (this._glyphs[glyphName]) {
			throw "Refusing to add duplicate glyph name.";
		}

		this._signatures[signature] = true;
		this._glyphs[glyphName] = glyphData;
	}

	getSignature(signature) {
		if (this._signatures[signature]) {
			return true;
		}
		return false;
	}

	toJSON() {
		return {
			glyphs: {...this._glyphs},
			types: {...this._types},
			signatures: {...this._signatures}
		}
	}
}

module.exports = Dictionary;