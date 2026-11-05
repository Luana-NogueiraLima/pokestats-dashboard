Parse.initialize(
    "Slc15FbldQbZNd6XBM67pxcjtX3cEdzzkcgZV6Ai",
    "28xKdkSSxIL9Sd4gkqpO4slflabg00IrQytsMxH6"
);

Parse.serverURL = "https://parseapi.back4app.com/";



async function testarConexao() {
    const consulta = new Parse.Query("AnalisesPokemon");

    try {
        const resultado = await consulta.limit(1).find();

        console.log("Conexão com Back4App realizada!");
        console.log("Registros encontrados:", resultado.length);

    } catch (erro) {
        console.error("Erro na conexão:", erro);
    }
}

async function cadastrarAnalise(evento) {
    evento.preventDefault();

    const nomePokemon = document.getElementById("nome-pokemon").value;
    const categoria = document.getElementById("categoria-analise").value;
    const descricao = document.getElementById("descricao-analise").value;
    const dataAnalise = document.getElementById("data-analise").value;

    const AnalisePokemon = Parse.Object.extend("AnalisesPokemon");
    const analise = new AnalisePokemon();

    analise.set("nomePokemon", nomePokemon);
    analise.set("categoria", categoria);
    analise.set("descricao", descricao);
    analise.set("dataAnalise", new Date(dataAnalise));

    try {
        await analise.save();

        alert("Análise cadastrada com sucesso!");

        document.getElementById("form-analise").reset();

        listarAnalises();

        console.log("Análise salva:", analise);

    } catch (erro) {
        console.error("Erro ao cadastrar análise:", erro);
        alert("Não foi possível cadastrar a análise.");

    }
}

async function listarAnalises() {
    const consulta = new Parse.Query("AnalisesPokemon");

    consulta.descending("createdAt");

    try {
        const resultados = await consulta.find();

        const lista = document.getElementById("lista-analises");

        if (resultados.length === 0) {
            lista.innerHTML = "<p>Nenhuma análise cadastrada.</p>";
            return;
        }

        lista.innerHTML = "";

        resultados.forEach(function (analise) {
            const nome = document.createElement("h3");
            nome.textContent = analise.get("nomePokemon");

            const categoria = document.createElement("p");
            categoria.textContent = "Categoria: " + analise.get("categoria");

            const descricao = document.createElement("p");
            descricao.textContent = analise.get("descricao");

            const data = document.createElement("p");
            const dataSalva = analise.get("dataAnalise");

            data.textContent = dataSalva
                ? "Data: " + dataSalva.toLocaleDateString("pt-BR")
                : "Data não informada";

            const botaoEditar = document.createElement("button");
            botaoEditar.textContent = "Editar";
            botaoEditar.addEventListener("click", function () {
                editarAnalise(analise.id);
            });

            const botaoExcluir = document.createElement("button");
            botaoExcluir.textContent = "Excluir";

            botaoExcluir.addEventListener("click", function () {
            excluirAnalise(analise.id);
            });

            const card = document.createElement("article");
            card.classList.add("card");

            card.appendChild(nome);
            card.appendChild(categoria);
            card.appendChild(descricao);
            card.appendChild(data);
            card.appendChild(botaoEditar);
            card.appendChild(botaoExcluir);

            lista.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao listar análises:", erro);
    }
}

async function editarAnalise(id) {
    const consulta = new Parse.Query("AnalisesPokemon");

    try {
        const analise = await consulta.get(id);

        const novoNome = prompt(
            "Nome do Pokémon:",
            analise.get("nomePokemon")
        );

        if (novoNome === null) return;

        const novaCategoria = prompt(
            "Categoria ou estratégia:",
            analise.get("categoria")
        );

        if (novaCategoria === null) return;

        const novaDescricao = prompt(
            "Descrição da análise:",
            analise.get("descricao")
        );

        if (novaDescricao === null) return;

        analise.set("nomePokemon", novoNome);
        analise.set("categoria", novaCategoria);
        analise.set("descricao", novaDescricao);

        await analise.save();

        alert("Análise atualizada com sucesso!");

        listarAnalises();

    } catch (erro) {
        console.error("Erro ao editar análise:", erro);
        alert("Não foi possível editar a análise.");
    }
}

async function excluirAnalise(id) {
    const confirmar = confirm("Tem certeza que deseja excluir esta análise?");

    if (!confirmar) return;

    const consulta = new Parse.Query("AnalisesPokemon");

    try {
        const analise = await consulta.get(id);

        await analise.destroy();

        alert("Análise excluída com sucesso!");

        listarAnalises();

    } catch (erro) {
        console.error("Erro ao excluir análise:", erro);
        alert("Não foi possível excluir a análise.");
    }
}
document
    .getElementById("form-analise")
    .addEventListener("submit", cadastrarAnalise);

testarConexao();
listarAnalises();