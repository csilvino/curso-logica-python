
var workspace = Blockly.inject('blocklyDiv', {
  toolbox: document.getElementById('toolbox')
});

function runCode() {
  var code = Blockly.Python.workspaceToCode(workspace);
  document.getElementById('output').innerText = '';

  Sk.configure({
    output: function(text) {
      document.getElementById('output').innerText += text + '
';
    },
    read: function(x) {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
      return Sk.builtinFiles["files"][x];
    }
  });

  try {
    Sk.misceval.asyncToPromise(function() {
      return Sk.importMainWithBody("__main__", false, code, true);
    }).catch(function(err) {
      document.getElementById('output').innerText = 'Erro ao executar o código: ' + err.toString();
    });
  } catch (e) {
    document.getElementById('output').innerText = 'Erro de execução: ' + e.toString();
  }
}
