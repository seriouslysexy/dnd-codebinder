const Coordinate = require("./coordinate");

class Glyph {
	constructor(gridPoints, segments, circleData) {
		if (!Array.isArray(segments) || !segments.length) {
			throw "Glyphs must be provided an array of segments";
		} else if (!gridPoints || isNaN(gridPoints)) {
			throw "gridPoints is required for Glyphs and must be a number";
		} else if (circleData && (!circleData.position || !circleData.radius || !(circleData.position instanceof Coordinate) || isNaN(circleData.radius))) {
			throw "Glyph circle data is malformed.";
		}

		this._segments = segments;
		this._gridPoints = gridPoints;
		this._circleData = circleData;
	}

	getSignature() {
		let encodedSegments = [];
		for (let segment of this._segments) {
			encodedSegments.push(segment.getEncoded());
		}
		encodedSegments.sort();

		if (this._circleData) {
			let stringifiedCircleData = [this._circleData.position.x, this._circleData.position.x, this._circleData.radius].join(".");
			let encodedCircleData = Buffer.from(stringifiedCircleData, "utf-8").toString("hex");
			encodedSegments.push(encodedCircleData);
		}

		return Buffer.from(encodedSegments.join(".")).toString('hex');
	}

	getEncoded() {
		return Buffer.from(JSON.stringify(this.toJSON()), "utf-8").toString("base64");
	}

	toJSON() {
		let glyphObj = {
			gridPoints: this._gridPoints,
			segments: [],
		};

		for (let segment of this._segments) {
			glyphObj.segments.push(segment.toJSON());
		}

		if (this._circleData) {
			glyphObj.circleData = {
				position: this._circleData.position.toJSON(),
				radius: this._circleData.radius
			}
		}

		return glyphObj;
	}
}

module.exports = Glyph;