"use strict";

const propBlacklist = [];

let canClone = function (value) {
	// Adapted from StackOverflow question 32673518
	if (Object(value) !== value) {
		// Value is primitive
		return true;
	};
	switch (value?.constructor) {
		//case Error:
		//case AggregateError:
		//case EvalError:
		//case InternalError:
		//case RangeError:
		//case ReferenceError:
		//case SyntaxError:
		//case TypeError:
		//case URIError:
		//case ArrayBuffer:
		//case Blob:
		case Boolean:
		case Date:
		//case FileList:
		//case ImageBitmap:
		//case ImageData:
		case Number:
		case RegExp:
		case String: {
			return true;
			break;
		};
		case Array:
		case Object: {
			return Object.keys(value).every(prop => canClone(value[prop]));
			break;
		};
		case Map: {
			return [...value.keys()].every(canClone) && [...value.values()].every(canClone);
			break;
		};
		case Set: {
			return [...value.keys()].every(canClone);
			break;
		};
		default: {
			return false;
		};
	};
};
let smartClone = function (value, step = 0) {
	let newStep = 1;
	if (canClone(value)) {
		return value;
	} else {
		switch (value?.constructor) {
			case ArrayBuffer: {
				return {
					uncloned: "ArrayBuffer",
					length: value.length
				};
			};
			case Function: {
				return {
					uncloned: "function",
					name: value.name
				};
			};
			case Error:
			case AggregateError:
			case EvalError:
			case InternalError:
			case RangeError:
			case ReferenceError:
			case SyntaxError:
			case TypeError:
			case URIError: {
				return value.stack;
				break;
			};
			case Array: {
				if (step < 8) {
					let newArr = [];
					value?.forEach(function (e, i) {
						let prompt = e;
						if (prompt === null || prompt === undefined) {
						};
						newArr[i] = smartClone(prompt, newStep);
					});
					return newArr;
				} else {
					return {
						uncloned: value?.constructor.name
					};
				};
				break;
			};
			default: {
				if (step < 8) {
					let newObj = {};
					for (let prop in value) {
						let prompt = value[prop];
						if (prompt === null || prompt === undefined) {
						};
						newObj[prop] = smartClone(prompt, newStep);
					};
					return newObj;
				} else {
					return {
						uncloned: value?.constructor.name
					};
				};
			};
		};
	};
};

export {
	canClone,
	smartClone
};