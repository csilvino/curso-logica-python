document.addEventListener("DOMContentLoaded", function () {
  const outEl = document.getElementById('output');
  const runBtn = document.getElementById('runButton');

  const workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox')
  });

  function logOut(msg) {
    outEl.textContent += msg + (msg.endsWith('\n') ? '' : '\n');
  }

  window.onerror = function (message, source, lineno, colno, error) {
    logOut(`ERRO JS: ${message} @ ${source}:${lineno}:${colno}`);
    if (error && error.stack) logOut(error.stack);
  };

  function checkDeps() {
    const deps = {
      Blockly: !!window.Blockly,
      BlocksLoaded: !!(window.Blockly && Blockly.Blocks && Object.keys(Blockly.Blocks).length),
      PythonGen: !!(window.Blockly && Blockly.Python),
      Skulpt: !!window.Sk,
    };
    const missing = Object.entries(deps).filter(([, ok]) => !ok).map(([k]) => k);
    if (missing.length) {
      logOut('Dependências ausentes: ' + missing.join(', '));
      logOut('Dica: confira as <script> no index.html (ordem: blockly.min.js, blocks.min.js, msg/pt.js, python.min.js, depois skulpt).');
    }
  }

  function runCode() {
    checkDeps();
    try {
      const code = Blockly.Python.workspaceToCode(workspace);
      Sk.configure({
        output: logOut,
        read: function (x) {
          if (Sk.builtinFiles === undefined || Sk.builtinFiles['files'][x] === undefined)
            throw `Arquivo não encontrado: '${x}'`;
          return Sk.builtinFiles['files'][x];
        }
      });
      Sk.misceval.asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, code));
    } catch (e) {
      logOut('Erro ao executar: ' + e);
    }
  }

  runBtn.addEventListener('click', runCode);
  window.runCode = runCode;
});
