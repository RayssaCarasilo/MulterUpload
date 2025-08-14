// Elementos do DOM
const botaoComecar = document.getElementById("botao-comecar");
const primeiraPageina = document.getElementById("primeira-pagina");
const galeria = document.getElementById("galeria");
const botaoAdicionar = document.getElementById("adicionar-animal");
const divAdicionar = document.querySelector(".adicionar");
const formulario = document.getElementById("animal-form");
const animaisContainer = document.getElementById("animais");

// Array para armazenar os animais
let animais = [];

// Função para alternar menu do usuário
function toggleMenu() {
  const menu = document.getElementById("userMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Event listeners
botaoComecar.addEventListener("click", () => {
  primeiraPageina.style.display = "none";
  galeria.style.display = "block";
  carregarAnimais();
});

botaoAdicionar.addEventListener("click", () => {
  divAdicionar.style.display =
    divAdicionar.style.display === "block" ? "none" : "block";
});

// Função para carregar animais do localStorage
function carregarAnimais() {
  const animaisSalvos = localStorage.getItem("animais");
  if (animaisSalvos) {
    animais = JSON.parse(animaisSalvos);
    animais.forEach((animal) => adicionarAnimalNaGaleria(animal));
  }
}

// Função para adicionar animal na galeria
function adicionarAnimalNaGaleria(animal) {
  const cardAnimal = document.createElement("div");
  cardAnimal.className = "card-animal";
  cardAnimal.innerHTML = `
        <img src="${animal.foto}" alt="${animal.nome}" onerror="this.src='icones/user.png'">
        <div class="info-animal">
            <h3>${animal.nome}</h3>
            <p><strong>Tipo:</strong> ${animal.tipo}</p>
            <p><strong>Porte:</strong> ${animal.porte}</p>
            <p><strong>Idade:</strong> ${animal.idade} anos</p>
            <p><strong>Cidade:</strong> ${animal.cidade}</p>
            <p><strong>Descrição:</strong> ${animal.descricao}</p>
            <p><strong>Contato:</strong> ${animal.contato}</p>
            <button onclick="removerAnimal('${animal.id}')" class="btn-remover">Remover</button>
        </div>
    `;

  animaisContainer.appendChild(cardAnimal);
}

// Função para remover animal
function removerAnimal(id) {
  if (confirm("Tem certeza que deseja remover este animal?")) {
   animais = animais.filter((animal) => String(animal.id) !== String(id));
    localStorage.setItem("animais", JSON.stringify(animais));

    // Recarregar galeria
    animaisContainer.innerHTML = "";
    animais.forEach((animal) => adicionarAnimalNaGaleria(animal));
  }
}
window.removerAnimal = removerAnimal;

// Função para enviar dados para o servidor
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const porte = document.getElementById("porte").value;
  const idade = document.getElementById("idade").value;
  const tipo = document.getElementById("tipo").value;
  const cidade = document.getElementById("cidade").value;
  const descricao = document.getElementById("descricao").value;
  const contato = document.getElementById("contato").value;
  const foto = document.getElementById("foto").files[0];

  // Validar se todos os campos estão preenchidos
  if (
    !nome ||
    !porte ||
    !idade ||
    !tipo ||
    !descricao ||
    !cidade ||
    !contato ||
    !foto
  ) {
    alert("Por favor, preencha todos os campos e selecione uma foto!");
    return;
  }

  // Criar FormData para enviar arquivo
  const formData = new FormData();
  formData.append("name", nome);
  formData.append("porte", porte);
  formData.append("idade", idade);
  formData.append("tipo", tipo);
  formData.append("descricao", descricao);
  formData.append("cidade", cidade);
  formData.append("contato", contato);
  formData.append("foto", foto);

  try {
    // Mostrar loading
    const submitBtn = document.getElementById("btn-salvar-animal");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Salvando...";
    submitBtn.disabled = true;

    // Enviar para o servidor
    const response = await fetch("/images", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Sucesso:", result);

      // Criar objeto do animal para o localStorage também
      const animal = {
        id: result.image._id || Date.now(),
        nome,
        porte,
        idade,
        tipo,
        cidade,
        descricao,
        contato,
        foto: result.image.src, // Usar o caminho do servidor
      };

      // Adicionar ao array local e salvar no localStorage
      animais.push(animal);
      localStorage.setItem("animais", JSON.stringify(animais));

      // Atualizar a galeria
      adicionarAnimalNaGaleria(animal);

      // Limpar formulário e fechar
      formulario.reset();
      divAdicionar.style.display = "none";

      // Resetar área de upload
      const uploadArea = document.querySelector(".upload-area");
      const imgPreview = uploadArea.querySelector("img");
      if (imgPreview) uploadArea.removeChild(imgPreview);
      const plusSign = uploadArea.querySelector("span");
      if (plusSign) plusSign.style.display = "inline";

      alert("Animal adicionado com sucesso!");
    } else {
      const error = await response.json();
      throw new Error(error.message || "Erro ao enviar dados");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao adicionar animal: " + error.message);
  } finally {
    // Restaurar botão
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// Botão limpar
document.getElementById("botao-limpar").addEventListener("click", () => {
  formulario.reset();
  const uploadArea = document.querySelector(".upload-area");
  const imgPreview = uploadArea.querySelector("img");
  if (imgPreview) uploadArea.removeChild(imgPreview);
  const plusSign = uploadArea.querySelector("span");
  if (plusSign) plusSign.style.display = "inline";
});

// Fechar menu ao clicar fora
document.addEventListener("click", (e) => {
  const menu = document.getElementById("userMenu");
  const usuario = document.querySelector(".usuario");

  if (usuario && !usuario.contains(e.target)) {
    menu.style.display = "none";
  }
});

// Preview da imagem no upload
document.getElementById("foto").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const uploadArea = document.querySelector(".upload-area");
      const plusSign = uploadArea.querySelector("span");

      // Esconder o +
      if (plusSign) plusSign.style.display = "none";

      // Criar ou atualizar preview
      let img = uploadArea.querySelector("img");
      if (!img) {
        img = document.createElement("img");
        img.style.maxWidth = "100%";
        img.style.maxHeight = "100%";
        img.style.objectFit = "cover";
        uploadArea.appendChild(img);
      }
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

//Filtragem
const botaoFiltrar = document.getElementById("filtrar");
const divFiltro = document.querySelector(".filtro");
const formFiltro = document.getElementById("form-filtro");
const limparFiltros = document.getElementById("limpar-filtros");

botaoFiltrar.addEventListener("click", () => {
  divFiltro.style.display =
    divFiltro.style.display === "block" ? "none" : "block";
});

formFiltro.addEventListener("submit", (e) => {
  e.preventDefault();

  const tipo = document.getElementById("tipo-filtro").value;
  const porte = document.getElementById("porte-filtro").value;
  const cidade = document.getElementById("cidade-filtro").value;

  // Limpa galeria atual
  animaisContainer.innerHTML = "";

  // Filtra e renderiza
  const animaisFiltrados = animais.filter((animal) => {
    return (
      (!tipo || animal.tipo === tipo) &&
      (!porte || animal.porte === porte) &&
      (!cidade || animal.cidade === cidade)
    );
  });

  animaisFiltrados.forEach((animal) => adicionarAnimalNaGaleria(animal));
  divFiltro.style.display = "none";
});

limparFiltros.addEventListener("click", () => {
  formFiltro.reset();
  animaisContainer.innerHTML = "";
  animais.forEach((animal) => adicionarAnimalNaGaleria(animal));
  divFiltro.style.display = "none";
});
