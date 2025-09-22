
Blockly.Python = new Blockly.Generator('Python');
Blockly.Python.addReservedWords('import,from,as,class,def,return,if,elif,else,while,for,try,except,finally,with,lambda');
Blockly.Python.ORDER_ATOMIC = 0;
Blockly.Python.init = function(workspace) {
  Blockly.Python.definitions_ = Object.create(null);
  Blockly.Python.functionNames_ = Object.create(null);
};
Blockly.Python.finish = function(code) {
  return code;
};
Blockly.Python.scrub_ = function(block, code) {
  return code;
};
Blockly.Python['text_print'] = function(block) {
  var msg = Blockly.Python.valueToCode(block, 'TEXT', Blockly.Python.ORDER_NONE) || "''";
  return 'print(' + msg + ')
';
};
