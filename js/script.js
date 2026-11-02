async function carregarDados() {
    const resposta = await fetch("data/pokestats_usage.json");

    const dados = await resposta.json();

    console.log(dados);
}

carregarDados();
