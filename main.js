// Inicializa o Blockly no div definido e associa o toolbox do HTML
const workspace = Blockly.inject('blocklyDiv', {
  toolbox: document.getElementById('toolbox'),
});

// Liga o botão Executar à função de execução
document.getElementById('runBtn').addEventListener('click', runCode);

// Função de saída para o Skulpt
function outf(text) {
  const out = document.getElementById('output');
  out.textContent += text;
  if (!text.endsWith('\n')) out.textContent += '\n';
}

// Leitor de arquivos padrão do Skulpt (stdlib)
function builtinRead(x) {
  if (Sk.builtinFiles === undefined || Sk.builtinFiles['files'][x] === undefined) {
    throw "File not found: '" + x + "'";
  }
  return Sk.builtinFiles['files'][x];
}

function runCode() {
  // Gera o código Python a partir dos blocos
  const code = Blockly.Python.workspaceToCode(workspace);
  const out = document.getElementById('output');
  out.textContent = '';

  // Configura e executa o Skulpt
  Sk.configure({ output: outf, read: builtinRead });
  Sk.misceval
    .asyncToPromise(() => Sk.importMainWithBody('__main__', false, code, true))
    .catch((err) => {
      outf('Erro ao executar o código: ' + err.toString());
    });
}
