const Coordinate = require("./coordinate");

class Segment {
	constructor(coord1, coord2) {
		if (!(coord1 instanceof Coordinate) || !(coord2 instanceof Coordinate)) {
			throw "Coordinates provided to Segment constructor must be an instance of Coordinate";
		} else {
			this._coord1 = coord1;
			this._coord2 = coord2;
		}
	}

	get x1() {
		return this._coord1.x;
	}

	get x2() {
		return this._coord2.x;
	}

	get y1() {
		return this._coord1.y;
	}

	get y2() {
		return this._coord2.y;
	}

	get coord1() {
		return this._coord1;
	}

	get coord2() {
		return this._coord2;
	}

	get coords() {
		return [this._coord1, this._coord2];
	}

	get reverse() {
		return [this._coord2, this._coord1];
	}

	get midpoint() {
		let midX = ((x1 + x2) / 2);
		let midY = ((y1 + y2) / 2);
		return new Coordinate(midX, midY);
	}

	getEncoded() {
		let xVals = [this.x1, this.x2].sort();
		let yVals = [this.y1, this.y2].sort();
		let toEncode = [xVals[0], xVals[1], yVals[0], yVals[1]].join(".");
		return Buffer.from(toEncode, "utf-8").toString('hex');
	}

	getIntersector() {
		if (this._x1 == this._x2 || this._y1 == this._y2) {
			return;
		}

		return new Segment(new Coordinate(this._x1, this._y2), new Coordinate(this._x2, this._y1));
	}

	determineIfIntersects(segment) {
		let compareSegment = JSON.stringify(segment.coords);
		let reversedCompareSegment = JSON.stringify(segment.reverse);

		let intersectorSegment = this.getIntersector();
		if (!intersectorSegment) {
			return false;
		} else {
			intersectorSegment = JSON.stringify(intersectorSegment);
		}

		if (intersectorSegment === compareSegment || intersectorSegment === reversedCompareSegment) {
			return true;
		}

		return false;
	}

	determineIfDuplicate(segment) {
		let compareSegment = JSON.stringify(segment.coords);
		if (compareSegment === JSON.stringify(this.coords) || compareSegment === JSON.stringify(this.reverse)) {
			return true;
		}
		return false;
	}

	toJSON() {
		return [this._coord1.toJSON(), this._coord2.toJSON()];
	}
}

module.exports = Segment;