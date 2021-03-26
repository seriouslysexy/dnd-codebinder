class Coordinate {
	constructor(x, y) {
		if (!x || !y) {
			throw "Coordinates must have an x and a y value";
		} else if (isNaN(x) || isNaN(y)) {
			throw "Coordinate values must be numbers";
		}
		this._x = x;
		this._y = y;
	}

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	get point() {
		return {x: this._x, y: this._y};
	}

	toJSON() {
		return this.point;
	}
}

module.exports = Coordinate;