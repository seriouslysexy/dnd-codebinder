var Chance = require("chance");
const chance = new Chance();

const Coordinate = require("./coordinate");
const Segment = require("./segment");
const Glyph = require("./glyph");

// grid would look like this

// 	17	27	37	47	57	67	77

// 	16	26	36	46	56	66	76

//	15	25	35	45	55	65	75

//	14	24	34	44	54	64	74

//	13	23	33	43	53	63	73

//	12	22	32	42	52	62	72

//	11	21	31	41	51	61	71

class GlyphGenerator {
	constructor(config = {}) {

		const DEFAULT_CONFIG = {
			gridPoints: 5,
			minLines: 1,
			maxLines: 5,
			maxIntersections: 1,
			circleChance: 2,
			circleMinRadius: .25,
			circleMaxRadius: .5,
			circleMustCenterOnPath: false
		};

		this._config = {...DEFAULT_CONFIG, ...config};

		if (isNaN(this._config.gridPoints) || this._config.gridPoints < 3 || this._config.gridPoints > 11 || this._config.gridPoints % 2 == 0) {
			throw "gridPoints must be a positive, odd number between 3 and 11.";
		} else if (isNaN(this._config.minLines) || this._config.minLines < 1) {
			throw "minLines must be a positive number of at least 1.";
		} else if (isNaN(this._config.maxLines) || this._config.maxLines < 1) {
			throw "maxLines must be a positive number of at least 1.";
		} else if (isNaN(this._config.maxIntersections) || this._config.maxIntersections < 0) {
			throw "maxIntersections must be a positive number of at least 0.";
		} else if (this._config.minLines > this._config.maxLines) {
			throw "minLines must be less than or equal to maxLines.";
		} else if (this._config.circleChance && (isNaN(this._config.circleChance) || this._config.circleChance > 100 || this._config.circleChance < 0)) {
			throw "circleChance must be between 0 and 100 if provided.";
		} else if (this._config.circleMinRadius && (isNaN(this._config.circleMinRadius) || this._config.circleMinRadius % .125 != 0 || this._config.circleMinRadius < 0 || this._config.circleMinRadius > 1)) {
			throw "circleMinRadius must be between 0 and 1 and be a multiple of .125.";
		} else if (this._config.circleMaxRadius && (isNaN(this._config.circleMaxRadius) || this._config.circleMaxRadius % .125 != 0 || this._config.circleMaxRadius < 0 || this._config.circleMaxRadius > 1)) {
			throw "circleMaxRadius must be between 0 and 1 and be a multiple of .125.";
		} else if (this._config.circleMinRadius > this._config.circleMaxRadius) {
			throw "circleMinRadius must be equal to or less than circleMaxRadius.";
		} else if (typeof this._config.circleMustCenterOnPath !== "boolean") {
			throw "circleMustCenterOnPath must be a boolean.";
		}

		this.X_MAX = Math.round(this._config.gridPoints);
		this.X_MIN = 1;
		this.Y_MAX = Math.round(this._config.gridPoints);
		this.Y_MIN = 1;
		this.SEGMENT_LENGTH = 2;

		this.CIRCLE_CHANCE = this._config.circleChance;
		if (this._config.circleChance) {
			this.CIRCLE_MUST_CENTER_ON_PATH = this._config.circleMustCenterOnPath;
			this.AVAILABLE_CIRCLE_RADII = this.calculateAvailCircleRadii(this._config.circleMinRadius, this._config.circleMaxRadius);
		}

		let calculatedMax = this.calculateMaxLines(this.X_MAX, this.SEGMENT_LENGTH);
		if (this._config.maxLines > calculatedMax) {
			console.warn("maxLines may not exceed actual maximum segment density - setting maxLines to calculated max:", calculatedMax);
			this._config.maxLines = calculatedMax;
		}

		if (this._config.minLines > this._config.maxLines) {
			throw "minLines may not be greater than maxLines";
		}

		this.X_VALUES = this.generateAllXValues();
		this.Y_VALUES = this.generateAllYValues();

		this.minLines = Math.round(this._config.minLines);
		this.maxLines = Math.round(this._config.maxLines);

		this.maxIntersections = Math.round(this._config.maxIntersections);
		this.hasIntersections = 0;

		this.SEGMENTS = [];
	}

	calculateMaxLines(gridPoints, segmentLength) {
		// todo: this does not factor in maxIntersections
		return ((Math.ceil(gridPoints / segmentLength) * (Math.ceil(gridPoints / segmentLength) - 1) * 2) + ((Math.ceil(gridPoints / segmentLength) - 1) ** 2) * 2);
	}

	calculateAvailCircleRadii(circleMinRadius, circleMaxRadius) {
		let radii = [];
		let size = circleMinRadius;
		while (size <= circleMaxRadius) {
			radii.push(size);
			size += .125;
		}
		return radii;
	}

	generateAllXValues = () => {
		let x_values = [];
		let xpos = this.X_MIN;
		while (xpos <= this.X_MAX) {
			x_values.push(xpos);
			xpos += this.SEGMENT_LENGTH;
		}
		return x_values;
	}

	generateAllYValues = () => {
		let y_values = [];
		let ypos = this.Y_MIN;
		while (ypos <= this.Y_MAX) {
			y_values.push(ypos);
			ypos += this.SEGMENT_LENGTH;
		}
		return y_values;
	}

	getRandomStartingCoord = () => {
		let xCoord = chance.pickone(this.X_VALUES);
		let yCoord = chance.pickone(this.Y_VALUES);
		return new Coordinate(xCoord, yCoord);
	}

	getAllCoordsInRange = (coord) => {
		let x = coord.x,
			y = coord.y,
			xValuesInRange = [x],
			yValuesInRange = [y];

		if (x - this.SEGMENT_LENGTH >= this.X_MIN) {
			xValuesInRange.push(x - this.SEGMENT_LENGTH);
		}

		if (x + this.SEGMENT_LENGTH <= this.X_MAX) {
			xValuesInRange.push(x + this.SEGMENT_LENGTH);
		}

		if (y - this.SEGMENT_LENGTH >= this.Y_MIN) {
			yValuesInRange.push(y - this.SEGMENT_LENGTH);
		}

		if (y + this.SEGMENT_LENGTH <= this.Y_MAX) {
			yValuesInRange.push(y + this.SEGMENT_LENGTH);
		}

		let coordsInRange = [];
		for (let xValue of xValuesInRange) {
			for (let yValue of yValuesInRange) {
				if (xValue !== x || yValue !== y) {
					coordsInRange.push(new Coordinate(xValue, yValue));
				}
			}
		}

		return coordsInRange;
	}

	removeInvalidCoordsInRange = (startingCoord, coordsInRange, existingSegments, canIntersect) => {
		let validCoordOptions = [];

		for (let coordInRange of coordsInRange) {
			let unverifiedSegment = new Segment(startingCoord, coordInRange);
			let canVerify = true;

			let isDuplicate = false;
			let wouldIntersectAny = false;

			for (let existingSegment of existingSegments) {
				isDuplicate = existingSegment.determineIfDuplicate(unverifiedSegment);
				wouldIntersectAny = existingSegment.determineIfIntersects(unverifiedSegment);
				if (isDuplicate || (!canIntersect && wouldIntersectAny)) {
					canVerify = false;
					break;
				}
			}

			if (canVerify) {
				validCoordOptions.push({coord: coordInRange, wouldIntersect: wouldIntersectAny});
			}
		}

		return validCoordOptions;
	}

	getNextSegment = (startingCoord) => {
		let allCoordsInRange = this.getAllCoordsInRange(startingCoord);
		let allValidCoords = this.removeInvalidCoordsInRange(startingCoord, allCoordsInRange, this.SEGMENTS, this.hasIntersections < this.maxIntersections)

		if (!allValidCoords.length) {
			return;
		}

		let selectedOption = chance.pickone(allValidCoords);

		// determine if we intersected and increment this.hasIntersections if needed
		if (selectedOption.wouldIntersect) {
			this.hasIntersections += 1;
		}

		return new Segment(startingCoord, selectedOption.coord);
	}

	generateGlyph = () => {
		// reset these values to generate new glyph
		this.hasIntersections = 0;
		this.SEGMENTS = [];
		// get random number in range of segments for this glyph
		let numberOfSegments = chance.integer({min: this.minLines, max: this.maxLines});
		// start in a random spot
		let nextSegmentFromCoord = this.getRandomStartingCoord();

		for (let i = 0; i < numberOfSegments; i++) {
			// get one segment at a time, using the second point of each segment as the starting point of the next
			let nextSegment = this.getNextSegment(nextSegmentFromCoord);

			if (!nextSegment) {
				break;
			}

			// todo: add an option for non-continuous glyphs
			nextSegmentFromCoord = nextSegment.coord2;
			// push each segment to the segments array
			this.SEGMENTS.push(nextSegment);
		}

		let circleData;
		if (this.CIRCLE_CHANCE > 0) {
			let hasCircle = chance.bool({likelihood: this.CIRCLE_CHANCE});
			if (hasCircle) {
				circleData = {position: null, radius: chance.pickone(this.AVAILABLE_CIRCLE_RADII)};
				if (this.CIRCLE_MUST_CENTER_ON_PATH) {
					let segToAddCircleOn = chance.pickone(this.SEGMENTS);
					circleData.position = chance.pickone([segToAddCircleOn.coord1, segToAddCircleOn.midpoint, segToAddCircleOn.coord2]);
				} else {
					circleData.position = this.getRandomStartingCoord();
				}
			}
		}

		return new Glyph(this.X_MAX, this.SEGMENTS, circleData);
	}
}

module.exports = GlyphGenerator;