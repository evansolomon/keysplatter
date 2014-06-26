var util = {
  /**
   * Determine whether a is without 1 of b, or equal.
   * @param {number} a
   * @param {number} b
   * @return {boolean}
   */
  isTouching: function (a, b) {
    return [a, a - 1, a + 1].indexOf(b) > -1
  }
}

/**
 * Represents a single key.
 * @param {string} symbol
 * @constructor
 */
function Key(symbol) {
  this.symbol = symbol
}

/**
 * Represents a row of keys.
 * @param {array.<Key>} keys
 * @constructor
 */
function Row(keys) {
  this.keys = keys
}

/**
 * Find a key's position in a row.
 * @param {string} symbol
 * @return {?number}
 */
Row.prototype.locate = function (symbol) {
  for (var column = 0; column < this.keys.length; column++) {
    if (symbol === this.keys[column].symbol) return column
  }

  return null
}

/**
 * Describe a position on a keyboard.
 * @param {?number} row
 * @param {?number} column
 * @constructor
 */
function KeyboardCoordinate(row, column) {
  this.row = row
  this.column = column
}

/**
 * Determine whether a coordinate can be found.
 * @return {boolean} [description]
 */
KeyboardCoordinate.prototype.found = function () {
  return this.row != null && this.column != null
}

/**
 * Represents a whole keyboard.
 * @param {array.<Row>} rows
 * @constructor
 */
function Keyboard(rows) {
  this.rows = rows
}

/**
 * Find a symbol's coordinates on a keyboard.
 * @param {string} symbol
 * @return {KeyboardCoordinate}
 */
Keyboard.prototype.locate = function (symbol) {
  var column = null
  var row = 0
  while (column === null && row < this.rows.length) {
    column = this.rows[row].locate(symbol)
    row++
  }

  if (column === null) return null

  return new KeyboardCoordinate(row, column)
}

/**
 * Determine whether two symbols are touching each other on the keyboard.
 * @param {string} a
 * @param {string} b
 * @return {boolean}
 */
Keyboard.prototype.isTouching = function (a, b) {
  var locationA = this.locate(a)
  var locationB = this.locate(b)
  if (! locationA.found() || ! locationB.found()) {
    return false
  }

  if (locationA.row === locationB.row ) {
    return util.isTouching(locationA.column, locationB.column)
  } else if (util.isTouching(locationA.row, locationB.row)) {
    var top
    var bottom

    if (locationA.row > locationB.row) {
      bottom = locationA
      top = locationB
    } else {
      top = locationA
      bottom = locationB
    }

    return [top.column, top.column - 1].indexOf(bottom.column) > -1
  } else {
    return false
  }
}

/**
 * Determine whether a string of symbols is a splatter.
 * @param {string} string
 * @return {boolean}
 */
Keyboard.prototype.isSplatter = function (string) {
  return string.split('').every(function (symbol, index) {
    if (index === string.length - 1) return true

    return this.isTouching(symbol, string.charAt(index + 1))
  }.bind(this))
}


/**
 * Standard keyboard layouts.
 * @type {Object}
 */
Keyboard.LAYOUTS = {
  QWERTY: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
  ]
}

/**
 * Create a Keyboard instance from an array of arrays of symbols.
 * @param {array} arr
 * @return {Keyboard}
 */
Keyboard.fromArray = function (arr) {
  var rows = arr.map(function (symbols) {
    var keys = symbols.map(function (symbol) {
      return new Key(symbol)
    })

    return new Row(keys)
  })

  return new Keyboard(rows)
}

/**
 * Create a Keyboad from a pre-defined layout.
 * @param {string} layout
 * @return {Keyboard}
 */
Keyboard.fromLayout = function (layout) {
  return Keyboard.fromArray(Keyboard.LAYOUTS[layout])
}

module.exports = Keyboard
