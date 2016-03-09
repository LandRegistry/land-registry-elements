if (!Array.prototype.indexOf) {
// Array.prototype.indexOf
Array.prototype.indexOf = function indexOf(searchElement) {
	for (var array = this, index = 0, length = array.length; index < length; ++index) {
		if (array[index] === searchElement) {
			return index;
		}
	}

	return -1;
};

}
if (!String.prototype.trim) {
// String.prototype.trim
String.prototype.trim = function trim() {
	return this.replace(/^\s+|\s+$/g, '');
};

}
if (!Array.prototype.map) {
// Array.prototype.map
Array.prototype.map = function map(callback, scope) {
	for (var array = this, arrayB = [], index = 0, length = array.length, element; index < length; ++index) {
		element = array[index];

		arrayB.push(callback.call(scope || window, array[index], index, array));
	}

	return arrayB;
};

}
if (!Array.prototype.forEach) {
// Array.prototype.forEach
Array.prototype.forEach = function forEach(callback, scope) {
	for (var array = this, index = 0, length = array.length; index < length; ++index) {
		callback.call(scope || window, array[index], index, array);
	}
};

}
if (!Array.prototype.reduce) {
// Array.prototype.reduce
Array.prototype.reduce = function reduce(callback, initialValue) {
	var array = this, previousValue = initialValue || 0;

	for (var index = 0, length = array.length; index < length; ++index) {
		previousValue = callback.call(window, previousValue, array[index], index, array);
	}

	return previousValue;
};

}
if (!Array.prototype.filter) {
// Array.prototype.filter
Array.prototype.filter = function filter(callback, scope) {
	for (var array = this, arrayB = [], index = 0, length = array.length, element; index < length; ++index) {
		element = array[index];

		if (callback.call(scope || window, element, index, array)) {
			arrayB.push(element);
		}
	}

	return arrayB;
};

}
if (typeof Array !== "undefined" && !Array.isArray) {
// Array.isArray
Array.isArray = function isArray(array) {
	return array && Object.prototype.toString.call(array) === '[object Array]';
};

}
if (typeof Object !== "undefined" && !Object.defineProperty) {
// Object.defineProperty
Object.defineProperty = function (object, property, descriptor) {
	if (descriptor.get) {
		object.__defineGetter__(property, descriptor.get);
	}

	if (descriptor.set) {
		object.__defineSetter__(property, descriptor.set);
	}

	return object;
};

}
if (typeof Object !== "undefined" && !Object.defineProperties) {
// Object.defineProperties
Object.defineProperties = function defineProperties(object, descriptors) {
	for (var property in descriptors) {
		Object.defineProperty(object, property, descriptors[property]);
	}

	return object;
};

}
if (typeof window.JSON === "undefined") {
/** @license MIT Asen Bozhilov JSON.parse (https://github.com/abozhilov/json) */
(function () {
	var
	toString = Object.prototype.toString,
	hasOwnProperty = Object.prototype.hasOwnProperty,
	LEFT_CURLY = '{',
	RIGHT_CURLY = '}',
	COLON = ':',
	LEFT_BRACE = '[',
	RIGHT_BRACE = ']',
	COMMA = ',',
	tokenType = {
		PUNCTUATOR: 1,
		STRING: 2,
		NUMBER: 3,
		BOOLEAN: 4,
		NULL: 5
	},
	tokenMap = {
		'{': 1, '}': 1, '[': 1, ']': 1, ',': 1, ':': 1,
		'"': 2,
		't': 4, 'f': 4,
		'n': 5
	},
	escChars = {
		'b': '\b',
		'f': '\f',
		'n': '\n',
		'r': '\r',
		't': '\t',
		'"': '"',
		'\\': '\\',
		'/': '/'
	},
	tokenizer = /^(?:[{}:,\[\]]|true|false|null|"(?:[^"\\\u0000-\u001F]|\\["\\\/bfnrt]|\\u[0-9A-F]{4})*"|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/,
	whiteSpace = /^[\t ]+/,
	lineTerminator = /^\r?\n/;

	function JSONLexer(JSONStr) {
		this.line = 1;
		this.col = 1;
		this._tokLen = 0;
		this._str = JSONStr;
	}

	JSONLexer.prototype = {
		getNextToken: function () {
			var
			str = this._str,
			token, type;

			this.col += this._tokLen;

			if (!str.length) {
				return 'END';
			}

			token = tokenizer.exec(str);

			if (token) {
				type = tokenMap[token[0].charAt(0)] || tokenType.NUMBER;
			} else if ((token = whiteSpace.exec(str))) {
				this._tokLen = token[0].length;
				this._str = str.slice(this._tokLen);
				return this.getNextToken();
			} else if ((token = lineTerminator.exec(str))) {
				this._tokLen = 0;
				this._str = str.slice(token[0].length);
				this.line++;
				this.col = 1;
				return this.getNextToken();
			} else {
				this.error('Invalid token');
			}

			this._tokLen = token[0].length;
			this._str = str.slice(this._tokLen);

			return {
				type: type,
				value: token[0]
			};
		},

		error: function (message, line, col) {
			var err = new SyntaxError(message);

			err.line = line || this.line;
			err.col = col || this.col;

			throw err;
		}
	};

	function JSONParser(lexer) {
		this.lex = lexer;
	}

	JSONParser.prototype = {
		parse: function () {
			var lex = this.lex, jsValue = this.getValue();

			if (lex.getNextToken() !== 'END') {
				lex.error('Illegal token');
			}

			return jsValue;
		},
		getObject: function () {
			var
			jsObj = {},
			lex = this.lex,
			token, tval, prop,
			line, col,
			pairs = false;

			while (true) {
				token = lex.getNextToken();
				tval = token.value;

				if (tval === RIGHT_CURLY) {
					return jsObj;
				}

				if (pairs) {
					if (tval === COMMA) {
						line = lex.line;
						col = lex.col - 1;
						token = lex.getNextToken();
						tval = token.value;
						if (tval === RIGHT_CURLY) {
							lex.error('Invalid trailing comma', line, col);
						}
					}
					else {
						lex.error('Illegal token where expect comma or right curly bracket');
					}
				}
				else if (tval === COMMA) {
					lex.error('Invalid leading comma');
				}

				if (token.type != tokenType.STRING) {
					lex.error('Illegal token where expect string property name');
				}

				prop = this.getString(tval);

				token = lex.getNextToken();
				tval = token.value;

				if (tval != COLON) {
					lex.error('Illegal token where expect colon');
				}

				jsObj[prop] = this.getValue();
				pairs = true;
			}
		},
		getArray: function () {
			var
			jsArr = [],
			lex = this.lex,
			token, tval,
			line, col,
			values = false;

			while (true) {
				token = lex.getNextToken();
				tval = token.value;

				if (tval === RIGHT_BRACE) {
					return jsArr;
				}

				if (values) {
					if (tval === COMMA) {
						line = lex.line;
						col = lex.col - 1;
						token = lex.getNextToken();
						tval = token.value;

						if (tval === RIGHT_BRACE) {
							lex.error('Invalid trailing comma', line, col);
						}
					} else {
						lex.error('Illegal token where expect comma or right square bracket');
					}
				} else if (tval === COMMA) {
					lex.error('Invalid leading comma');
				}

				jsArr.push(this.getValue(token));
				values = true;
			}
		},
		getString: function (strVal) {
			return strVal.slice(1, -1).replace(/\\u?([0-9A-F]{4}|["\\\/bfnrt])/g, function (match, escVal) {
				return escChars[escVal] || String.fromCharCode(parseInt(escVal, 16));
			});
		},
		getValue: function(fromToken) {
			var lex = this.lex,
				token = fromToken || lex.getNextToken(),
				tval = token.value;
			switch (token.type) {
				case tokenType.PUNCTUATOR:
					if (tval === LEFT_CURLY) {
						return this.getObject();
					} else if (tval === LEFT_BRACE) {
						return this.getArray();
					}

					lex.error('Illegal punctoator');

					break;
				case tokenType.STRING:
					return this.getString(tval);
				case tokenType.NUMBER:
					return Number(tval);
				case tokenType.BOOLEAN:
					return tval === 'true';
				case tokenType.NULL:
					return null;
				default:
					lex.error('Invalid value');
			}
		}
	};

	function filter(base, prop, value) {
		if (typeof value === 'undefined') {
			delete base[prop];
			return;
		}
		base[prop] = value;
	}

	function walk(holder, name, rev) {
		var val = holder[name], i, len;

		if (toString.call(val).slice(8, -1) === 'Array') {
			for (i = 0, len = val.length; i < len; i++) {
				filter(val, i, walk(val, i, rev));
			}
		} else if (typeof val === 'object') {
			for (i in val) {
				if (hasOwnProperty.call(val, i)) {
					filter(val, i, walk(val, i, rev));
				}
			}
		}

		return rev.call(holder, name, val);
	}

	function pad(value, length) {
		value = String(value);

		return value.length >= length ? value : new Array(length - value.length + 1).join('0') + value;
	}

	Window.prototype.JSON = {
		parse: function (JSONStr, reviver) {
			var jsVal = new JSONParser(new JSONLexer(JSONStr)).parse();

			if (typeof reviver === 'function') {
				return walk({
					'': jsVal
				}, '', reviver);
			}

			return jsVal;
		},
		stringify: function () {
			var
			value = arguments[0],
			replacer = typeof arguments[1] === 'function' ? arguments[1] : null,
			space = arguments[2] || '',
			spaceSpace = space ? ' ' : '',
			spaceReturn = space ? '\n' : '',
			className = toString.call(value).slice(8, -1),
			array, key, hasKey, index, length, eachValue;

			if (value === null || className === 'Boolean' || className === 'Number') {
				return value;
			}

			if (className === 'Array') {
				array = [];

				for (length = value.length, index = 0, eachValue; index < length; ++index) {
					eachValue = replacer ? replacer(index, value[index]) : value[index];
					eachValue = this.stringify(eachValue, replacer, space);

					if (eachValue === undefined || eachValue === null) {
						eachValue = 'null';
					}

					array.push(eachValue);
				}

				return '[' + spaceReturn + array.join(',' + spaceReturn).replace(/^/mg, space) + spaceReturn + ']';
			}

			if (className === 'Date') {
				return '"' + value.getUTCFullYear() + '-' +
				pad(value.getUTCMonth() + 1, 2)     + '-' +
				pad(value.getUTCDate(), 2)          + 'T' +
				pad(value.getUTCHours(), 2)         + ':' +
				pad(value.getUTCMinutes(), 2)       + ':' +
				pad(value.getUTCSeconds(), 2)       + '.' +
				pad(value.getUTCMilliseconds(), 3)  + 'Z' + '"';
			}

			if (className === 'String') {
				return '"' + value.replace(/"/g, '\\"') + '"';
			}

			if (typeof value === 'object') {
				array = [];
				hasKey = false;

				for (key in value) {
					if (hasOwnProperty.call(value, key)) {
						eachValue = replacer ? replacer(key, value[key]) : value[key];
						eachValue = this.stringify(eachValue, replacer, space);

						if (eachValue !== undefined) {
							hasKey = true;

							array.push('"' + key + '":' + spaceSpace + eachValue);
						}
					}
				}

				if (!hasKey) {
					return '{}';
				} else {
					return '{' + spaceReturn + array.join(',' + spaceReturn).replace(/^/mg, space) + spaceReturn + '}';
				}
			}
		}
	};
})();

}
if (typeof window.matchMedia === "undefined") {
// Window.prototype.matchMedia
(function () {
	function evalQuery(window, query) {
		return new Function('media', 'try{ return !!(%s) }catch(e){ return false }'
			.replace('%s', query||'true')
			.replace(/^only\s+/, '')
			.replace(/(device)-([\w.]+)/g, '$1.$2')
			.replace(/([\w.]+)\s*:/g, 'media.$1 ===')
			.replace(/min-([\w.]+)\s*===/g, '$1 >=')
			.replace(/max-([\w.]+)\s*===/g, '$1 <=')
			.replace(/all|screen/g, '1')
			.replace(/print/g, '0')
			.replace(/,/g, '||')
			.replace(/and/g, '&&')
			.replace(/dpi/g, '')
			.replace(/(\d+)(cm|em|in|mm|pc|pt|px|rem)/, function ($0, $1, $2) {
				return $1 * (
					$2 === 'cm' ? 0.3937 * 96 : (
						$2 === 'em' || $2 === 'rem' ? 16 : (
							$2 === 'in' ? 96 : (
								$2 === 'mm' ? 0.3937 * 96 / 10 : (
									$2 === 'pc' ? 12 * 96 / 72 : (
										$2 === 'pt' ? 96 / 72 : 1
									)
								)
							)
						)
					)
				);
			})
		)({
			width: window.innerWidth,
			height: window.innerHeight,
			orientation: window.orientation || 'landscape',
			device: {
				width: window.screen.width,
				height: window.screen.height,
				orientation: window.screen.orientation || window.orientation || 'landscape'
			}
		});
	}

	function MediaQueryList() {
		this.matches = false;
		this.media = 'invalid';
	}

	MediaQueryList.prototype.addListener = function addListener(listener) {
		this.addListener.listeners.push(listener);
	};

	MediaQueryList.prototype.removeListener = function removeListener(listener) {
		this.addListener.listeners.splice(this.addListener.listeners.indexof(listener), 1);
	};

	window.matchMedia = Window.prototype.matchMedia = function matchMedia(query) {
		var
		window = this,
		list = new MediaQueryList();

		if (0===arguments.length) {
			throw new TypeError('Not enough arguments to window.matchMedia');
		}

		list.media = String(query);
		list.matches = evalQuery(window, list.media);
		list.addListener.listeners = [];

		window.addEventListener('resize', function () {
			var listeners = [].concat(list.addListener.listeners), matches = evalQuery(window, list.media);

			if (matches != list.matches) {
				list.matches = matches;
				for (var index = 0, length = listeners.length; index < length; ++index) {
					listeners[index].call(window, list);
				}
			}
		});

		return list;
	};
})();

}
if (!Function.prototype.bind) {
// Function.prototype.bind
Function.prototype.bind = function bind(scope) {
	var
	callback = this,
	prepend = Array.prototype.slice.call(arguments, 1),
	Constructor = function () {},
	bound = function () {
		return callback.apply(
			this instanceof Constructor && scope ? this : scope,
			prepend.concat(Array.prototype.slice.call(arguments, 0))
		);
	};

	Constructor.prototype = bound.prototype = callback.prototype;

	return bound;
};

}
if (!Array.prototype.every) {
// Array.prototype.every
Array.prototype.every = function every(callback, scope) {
	for (var array = this, index = 0, length = array.length; index < length; ++index) {
		if (!callback.call(scope || window, array[index], index, array)) {
			break;
		}
	}

	return index === length;
};

}
if (typeof Date !== "undefined" && !Date.now) {
// Date.now
Date.now = function now() {
	return new Date().getTime();
};

}
if (typeof Object !== "undefined" && !Object.keys) {
// Object.keys
Object.keys = function keys(object) {
	var buffer = [], key;

	for (key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			buffer.push(key);
		}
	}

	return buffer;
};

}
