/* =========================================================
   Conecta Seguro: checklist e quiz
   Para editar o conteúdo, mude só as listas abaixo.
   ========================================================= */

/* ---------- DADOS DO CHECKLIST ---------- */
const itensChecklist = [
  "Uso senhas diferentes para cada conta importante.",
  "Ativei a verificação em duas etapas no e-mail e nas redes sociais.",
  "Ativei a confirmação em duas etapas no WhatsApp.",
  "Nunca compartilho códigos de verificação com ninguém.",
  "Confiro o endereço do site antes de digitar dados ou comprar.",
  "Desconfio de ofertas com preço muito abaixo do normal.",
  "Confirmo pelo app do banco se um Pix realmente caiu na conta.",
  "Defini limites de valor para Pix no aplicativo do banco.",
  "Mantenho o celular e os aplicativos sempre atualizados."
];

/* ---------- DADOS DO QUIZ ---------- */
const perguntas = [
  {
    texto: "Você recebe um SMS dizendo que sua conta será bloqueada em 1 hora, com um link para \"regularizar\". O que fazer?",
    opcoes: [
      "Clicar rápido no link para não perder a conta",
      "Ignorar o link e entrar no app ou site oficial digitando o endereço",
      "Responder o SMS pedindo mais informações"
    ],
    correta: 1,
    explicacao: "Urgência e link suspeito são sinais clássicos de phishing. Sempre acesse o canal oficial por conta própria."
  },
  {
    texto: "Um número desconhecido diz ser seu parente, avisa que trocou de celular e pede um Pix urgente. Qual a melhor atitude?",
    opcoes: [
      "Fazer o Pix, pois é urgente",
      "Pedir uma foto da pessoa e depois pagar",
      "Ligar para o número antigo do parente ou fazer chamada de vídeo antes de qualquer pagamento"
    ],
    correta: 2,
    explicacao: "Esse é o golpe do \"novo número\". Confirme a identidade por outro meio antes de enviar dinheiro."
  },
  {
    texto: "Alguém pede o código de 6 dígitos que chegou por SMS para \"confirmar seu cadastro\". O que isso significa?",
    opcoes: [
      "É seguro, pois o código é só para cadastro",
      "É uma tentativa de invadir seu WhatsApp ou conta",
      "O código só funciona se for usado em 24 horas"
    ],
    correta: 1,
    explicacao: "Quem tem esse código consegue acessar sua conta. Nunca compartilhe códigos de verificação."
  },
  {
    texto: "Qual destes é um sinal de alerta de loja falsa?",
    opcoes: [
      "Preço muito abaixo do mercado e pagamento só por Pix",
      "CNPJ e endereço visíveis no site",
      "Boa reputação em sites de reclamações"
    ],
    correta: 0,
    explicacao: "Preço baixo demais e pagamento só por Pix são indícios fortes de fraude. Pesquise a loja antes de comprar."
  },
  {
    texto: "Alguém te mostra um comprovante de Pix dizendo que já pagou. Como ter certeza do pagamento?",
    opcoes: [
      "Confiar na imagem do comprovante",
      "Perguntar se a pessoa tem certeza",
      "Conferir no aplicativo do seu banco se o dinheiro entrou"
    ],
    correta: 2,
    explicacao: "Comprovantes podem ser falsificados. Só vale o que aparece no extrato do seu banco."
  }
];

/* =========================================================
   CHECKLIST
   ========================================================= */
const listaEl = document.getElementById("lista-checklist");
const textoEl = document.getElementById("checklist-texto");
const percEl = document.getElementById("checklist-percentual");
const barraEl = document.getElementById("checklist-barra");
const preencheEl = document.getElementById("checklist-preenchimento");
const msgEl = document.getElementById("checklist-mensagem");
const limparBtn = document.getElementById("btn-limpar");
const CHAVE = "conectaSeguroChecklist";

// Lê o progresso salvo no navegador (se der erro, começa vazio)
function lerSalvo() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch (e) {
    return [];
  }
}

function salvar(marcados) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(marcados));
  } catch (e) {
    /* sem problema: o checklist continua funcionando sem salvar */
  }
}

function criarChecklist() {
  const salvos = lerSalvo();
  itensChecklist.forEach((texto, i) => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const span = document.createElement("span");
    input.type = "checkbox";
    input.checked = salvos.includes(i);
    input.addEventListener("change", atualizarChecklist);
    span.textContent = texto;
    label.append(input, span);
    li.append(label);
    listaEl.append(li);
  });
  atualizarChecklist();
}

function atualizarChecklist() {
  const caixas = listaEl.querySelectorAll("input");
  const marcados = [];
  caixas.forEach((c, i) => { if (c.checked) marcados.push(i); });

  const total = caixas.length;
  const feitos = marcados.length;
  const perc = Math.round((feitos / total) * 100);

  textoEl.textContent = feitos + " de " + total + " concluídos";
  percEl.textContent = perc + "%";
  preencheEl.style.width = perc + "%";
  barraEl.setAttribute("aria-valuenow", perc);

  if (feitos === total) {
    msgEl.textContent = "Uau! Você já tem ótimos hábitos de segurança";
  } else if (feitos >= total / 2) {
    msgEl.textContent = "Você está no caminho certo! Falta pouco";
  } else if (feitos > 0) {
    msgEl.textContent = "Bom começo! Vá marcando um item de cada vez";
  } else {
    msgEl.textContent = "";
  }
  salvar(marcados);
}

limparBtn.addEventListener("click", () => {
  listaEl.querySelectorAll("input").forEach(c => (c.checked = false));
  atualizarChecklist();
});

/* =========================================================
   QUIZ
   ========================================================= */
const quizEl = document.getElementById("quiz-box");
let atual = 0;
let pontos = 0;

function mostrarPergunta() {
  const p = perguntas[atual];
  quizEl.innerHTML = "";

  const progresso = document.createElement("p");
  progresso.className = "quiz-progresso";
  progresso.textContent = "Pergunta " + (atual + 1) + " de " + perguntas.length;

  const titulo = document.createElement("h3");
  titulo.className = "quiz-pergunta";
  titulo.textContent = p.texto;

  const opcoes = document.createElement("div");
  opcoes.className = "opcoes";

  p.opcoes.forEach((texto, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "opcao";
    btn.textContent = texto;
    btn.addEventListener("click", () => responder(i, opcoes));
    opcoes.append(btn);
  });

  quizEl.append(progresso, titulo, opcoes);
}

function responder(escolhida, opcoesEl) {
  const p = perguntas[atual];
  const botoes = opcoesEl.querySelectorAll(".opcao");

  botoes.forEach((b, i) => {
    b.disabled = true;
    if (i === p.correta) b.classList.add("certa");
  });

  if (escolhida === p.correta) {
    pontos++;
  } else {
    botoes[escolhida].classList.add("errada");
  }

  const exp = document.createElement("p");
  exp.className = "explicacao";
  exp.textContent = (escolhida === p.correta ? "Acertou! " : "Quase! ") + p.explicacao;

  const proximo = document.createElement("button");
  proximo.type = "button";
  proximo.className = "botao";
  proximo.textContent = atual === perguntas.length - 1 ? "Ver resultado" : "Próxima pergunta";
  proximo.addEventListener("click", () => {
    atual++;
    if (atual < perguntas.length) mostrarPergunta();
    else mostrarResultado();
  });

  quizEl.append(exp, proximo);
  proximo.focus();
}

function mostrarResultado() {
  let mensagem;
  if (pontos === perguntas.length) mensagem = "Perfeito! Você está craque em segurança digital";
  else if (pontos >= 3) mensagem = "Muito bem! Revise o guia para fechar as lacunas";
  else mensagem = "Vale reler o guia com carinho e tentar de novo";

  quizEl.innerHTML = "";
  const div = document.createElement("div");
  div.className = "resultado";

  const titulo = document.createElement("h3");
  titulo.textContent = "Sua pontuação final";
  const nota = document.createElement("p");
  nota.className = "nota";
  nota.textContent = pontos + " / " + perguntas.length;
  const msg = document.createElement("p");
  msg.textContent = mensagem;
  const reiniciar = document.createElement("button");
  reiniciar.type = "button";
  reiniciar.className = "botao";
  reiniciar.textContent = "Refazer o quiz";
  reiniciar.addEventListener("click", iniciarQuiz);

  div.append(titulo, nota, msg, reiniciar);
  quizEl.append(div);
}

function iniciarQuiz() {
  atual = 0;
  pontos = 0;
  mostrarPergunta();
}

/* ---------- INÍCIO ---------- */
criarChecklist();
iniciarQuiz();
