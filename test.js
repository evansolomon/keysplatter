var Keyboard = require('./index')

function checkSplatter(str) {
  var keyboard = Keyboard.fromLayout('QWERTY')
  return keyboard.isSplatter(str)
}

exports.simpleSplatter = function (test) {
  test.ok(checkSplatter('asdf'))
  test.done()
}

exports.nonSplatter = function (test) {
  test.ok(! checkSplatter('asdl'))
  test.done()
}

exports.multiRowSplatter = function (test) {
  test.ok(checkSplatter('qaz'))
  test.done()
}

exports.complicatedSplatter = function (test) {
  test.ok(checkSplatter('aqwsxdfrtyh'))
  test.done()
}

exports.singleCharacterIsSplatter = function (test) {
  test.ok(checkSplatter('f'))
  test.done()
}
