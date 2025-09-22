(function () {
  const outEl = document.getElementById('output');

  function logOut(msg) {
    outEl.textContent += msg + (msg.endsWith('\n') ? '' : '\n');
  }

  // Mostra erros JS na área de saída
  window.onerror = function (message, source, lineno, colno, error) {
    logOut(`ERRO JS: ${message} @ ${source}:${lineno}:${colno}`);
    if (error && error.stack) logOut(error.stack);
  };

  // Sanidade das dependências
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
    } else {
      logOut('Dependências OK ✔');
    }
    return missing.length === 0;
  }

  // Inicializa Blockly
  const workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox'),
    grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
    trashcan: true,
    zoom: { controls: true, wheel: true },
  });

  // Botão Executar
  document.getElementById('runBtn').addEventListener('click', runCode);

  // Saída do Skulpt
  function outf(text) {
    outEl.textContent += text;
    if (!text.endsWith('\n')) outEl.textContent += '\n';
  }

  // Leitura padrão do stdlib para Skulpt
  function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles['files'][x] === undefined) {
      throw "File not found: '" + x + "'";
    }
    return Sk.builtinFiles['files'][x];
  }

  function runCode() {
    outEl.textContent = '';

    if (!checkDeps()) return;

    // Gera Python a partir dos blocos
    const code = Blockly.Python.workspaceToCode(workspace).trim();
    if (!code) {
      logOut('Não há blocos ainda. Monte um bloco "Texto → imprimir" e clique Executar.');
      return;
    }

    // Executa com Skulpt
    Sk.configure({ output: outf, read: builtinRead });
    Sk.misceval
      .asyncToPromise(() => Sk.importMainWithBody('__main__', false, code, true))
      .catch((err) => {
        outf('Erro ao executar o código: ' + err.toString());
      });
  }

  // Mensagem inicial
  checkDeps();
})();
