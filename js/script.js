
function ajustarNome(nome) {
    const nomesEspeciais = {
        "keldeo": "keldeo-ordinary",
        "ogerpon-wellspring": "ogerpon"
    };

    if (nomesEspeciais[nome.toLowerCase()]) {
        return nomesEspeciais[nome.toLowerCase()];
    }

    return nome.toLowerCase().replaceAll(" ", "-");
}

function formatarNomeExibicao(nome) {
    return nome
        .split("-")
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join("-");
}

let graficoMaisUsados = null;
let graficoGeracoes = null;
let graficoTipos = null;
let graficoComparacao = null;

let pokemonValidos = [];
let meuTime = [];
let pokedexCompleta = [];

function traduzirTipo(tipo) {
    const traducoes = {
        normal: "Normal",
        fire: "Fogo",
        water: "Água",
        electric: "Elétrico",
        grass: "Planta",
        ice: "Gelo",
        fighting: "Lutador",
        poison: "Venenoso",
        ground: "Terrestre",
        flying: "Voador",
        psychic: "Psíquico",
        bug: "Inseto",
        rock: "Pedra",
        ghost: "Fantasma",
        dragon: "Dragão",
        dark: "Sombrio",
        steel: "Aço",
        fairy: "Fada"
    };

    return traducoes[tipo.toLowerCase()] || tipo;
}

function criarGraficoMaisUsados(dados) {
    const utilizacaoPokemon = {};

    dados.forEach(registro => {
        const nome = registro.pokemon;

        if (!utilizacaoPokemon[nome]) {
            utilizacaoPokemon[nome] = {
                total: 0,
                quantidade: 0
            };
        }

        utilizacaoPokemon[nome].total += registro.usoPercentual;
        utilizacaoPokemon[nome].quantidade++;
    });

    const ranking = Object.entries(utilizacaoPokemon)
        .map(([nome, valores]) => ({
            nome: nome,
            media: valores.total / valores.quantidade
        }))
        .sort((a, b) => b.media - a.media)
        .slice(0, 10);

    const contexto = document
        .getElementById("grafico-mais-usados")
        .getContext("2d");

    if (graficoMaisUsados) {
        graficoMaisUsados.destroy();
    }

    graficoMaisUsados = new Chart(contexto, {
        type: "bar",
        data: {
            labels: ranking.map(
                pokemon => formatarNomeExibicao(pokemon.nome)
            ),
            datasets: [{
                label: "Média de utilização (%)",
                data: ranking.map(pokemon => pokemon.media),
                backgroundColor: "#3978C5",
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Utilização média (%)"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Pokémon"
                    }
                }
            }
        }
    });
}

function criarGraficoGeracoes(dados) {
    const utilizacaoGeracoes = {};

    dados.forEach(registro => {
        const geracao = registro.geracao;

        if (!utilizacaoGeracoes[geracao]) {
            utilizacaoGeracoes[geracao] = {
                total: 0,
                quantidade: 0
            };
        }

        utilizacaoGeracoes[geracao].total += registro.usoPercentual;
        utilizacaoGeracoes[geracao].quantidade++;
    });

    const geracoes = Object.entries(utilizacaoGeracoes)
        .map(([geracao, valores]) => ({
            numero: Number(geracao),
            nome: `Geração ${geracao}`,
            media: valores.total / valores.quantidade
        }))
        .sort((a, b) => a.numero - b.numero);

    const contexto = document
        .getElementById("grafico-geracoes")
        .getContext("2d");

    if (graficoGeracoes) {
        graficoGeracoes.destroy();
    }

    graficoGeracoes = new Chart(contexto, {
        type: "bar",
        data: {
            labels: geracoes.map(item => item.nome),
            datasets: [{
                label: "Média de utilização (%)",
                data: geracoes.map(item => item.media),
                backgroundColor: "#3978C5",
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Geração"
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Utilização média (%)"
                    }
                }
            }
        }
    });
}

function criarGraficoTipos() {
    if (pokemonValidos.length === 0) {
        return;
    }

    const contagemTipos = {};

    pokemonValidos.forEach(pokemon => {
        pokemon.tipos.forEach(tipo => {
            contagemTipos[tipo] = (contagemTipos[tipo] || 0) + 1;
        });
    });

    const tiposOrdenados = Object.entries(contagemTipos)
        .sort((a, b) => b[1] - a[1]);

    const contexto = document
        .getElementById("grafico-tipos")
        .getContext("2d");

    if (graficoTipos) {
        graficoTipos.destroy();
    }

    graficoTipos = new Chart(contexto, {
        type: "doughnut",
        data: {
            labels: tiposOrdenados.map(
                item => traduzirTipo(item[0])
            ),
            datasets: [{
                label: "Quantidade de Pokémon",
                data: tiposOrdenados.map(item => item[1]),
                backgroundColor: [
                    "#A8A77A",
                    "#EE8130",
                    "#6390F0",
                    "#F7D02C",
                    "#7AC74C",
                    "#96D9D6",
                    "#C22E28",
                    "#A33EA1",
                    "#E2BF65",
                    "#A98FF3",
                    "#F95587",
                    "#A6B91A",
                    "#B6A136",
                    "#735797",
                    "#6F35FC",
                    "#705746",
                    "#B7B7CE",
                    "#D685AD"
                ],
                borderWidth: 2,
                borderColor: "#ffffff"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "right"
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.raw} Pokémon`;
                        }
                    }
                }
            }
        }
    });
}

function criarGraficoComparacao() {
    if (pokemonValidos.length === 0) {
        return;
    }

    const atributos = [
        { nome: "HP", chave: "hp" },
        { nome: "Ataque", chave: "ataque" },
        { nome: "Defesa", chave: "defesa" },
        { nome: "Ataque especial", chave: "ataqueEspecial" },
        { nome: "Defesa especial", chave: "defesaEspecial" },
        { nome: "Velocidade", chave: "velocidade" }
    ];

    const calcularMedia = (lista, atributo) => {
        const soma = lista.reduce(
            (total, pokemon) => total + pokemon[atributo.chave],
            0
        );

        return soma / lista.length;
    };

    const mediaGeral = atributos.map(
        atributo => calcularMedia(pokemonValidos, atributo)
    );

    const datasets = [{
        label: "Média geral",
        data: mediaGeral,
        backgroundColor: "rgba(57, 120, 197, 0.2)",
        borderColor: "#3978C5",
        borderWidth: 2
    }];

    if (meuTime.length > 0) {
        const mediaTime = atributos.map(
            atributo => calcularMedia(meuTime, atributo)
        );

        datasets.push({
            label: "Meu time",
            data: mediaTime,
            backgroundColor: "rgba(255, 165, 0, 0.2)",
            borderColor: "#FFA500",
            borderWidth: 2
        });
    }

    const canvas = document.getElementById("grafico-comparacao");

    if (!canvas) {
        console.error("Canvas grafico-comparacao não encontrado.");
        return;
    }

    if (graficoComparacao) {
        graficoComparacao.data.datasets = datasets;
        graficoComparacao.update();
        return;
    }

    const contexto = canvas.getContext("2d");

    graficoComparacao = new Chart(contexto, {
        type: "radar",
        data: {
            labels: atributos.map(atributo => atributo.nome),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    min: 0,
                    max: 255,
                    ticks: {
                        stepSize: 50
                    }
                }
            }
        }
    });
}

async function buscarDetalhesPokemon(nome) {
    const nomeAPI = ajustarNome(nome);

    const resposta = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nomeAPI}`
    );

    if (!resposta.ok) {
        throw new Error("Pokémon não encontrado na PokéAPI.");
    }

    const pokemonAPI = await resposta.json();

    return {
        nome: pokemonAPI.name,
        imagem: pokemonAPI.sprites.other["official-artwork"].front_default
            || pokemonAPI.sprites.front_default,
        tipos: pokemonAPI.types.map(tipo => tipo.type.name),
        hp: pokemonAPI.stats[0].base_stat,
        ataque: pokemonAPI.stats[1].base_stat,
        defesa: pokemonAPI.stats[2].base_stat,
        ataqueEspecial: pokemonAPI.stats[3].base_stat,
        defesaEspecial: pokemonAPI.stats[4].base_stat,
        velocidade: pokemonAPI.stats[5].base_stat
    };
}

function gerarBarraAtributo(nome, valor) {
    const porcentagem = Math.min((valor / 255) * 100, 100);

    return `
        <div class="atributo">
            <div class="atributo-info">
                <span>${nome}</span>
                <strong>${valor}</strong>
            </div>

            <div class="barra-fundo">
                <div
                    class="barra-valor"
                    style="width: ${porcentagem}%"
                ></div>
            </div>
        </div>
    `;
}

async function consultarPokemon() {
    const campoBusca = document.getElementById("buscar-analise");
    const nome = campoBusca.value.trim().toLowerCase();

    const detalhes = document.getElementById("detalhes-pokemon");

    if (nome === "") {
        alert("Digite o nome de um Pokémon!");
        return;
    }

    const pokemonEncontrado = pokedexCompleta.find(
        pokemon => pokemon.name === nome
    );

    if (!pokemonEncontrado) {
        alert("Pokémon não encontrado na Pokédex!");
        return;
    }

    detalhes.innerHTML = "<p>Carregando dados do Pokémon...</p>";

    try {
        const pokemon = await buscarDetalhesPokemon(nome);

        const somaAtributos =
            pokemon.hp +
            pokemon.ataque +
            pokemon.defesa +
            pokemon.ataqueEspecial +
            pokemon.defesaEspecial +
            pokemon.velocidade;

        const tiposFormatados = pokemon.tipos
            .map(traduzirTipo)
            .join(", ");

        const nomeFormatado = formatarNomeExibicao(pokemon.nome);

        detalhes.innerHTML = `
            <div class="detalhes-card">

                <h3>${nomeFormatado}</h3>

                <img
                    src="${pokemon.imagem}"
                    alt="${nomeFormatado}"
                    width="200"
                >

                <p><strong>Tipos:</strong> ${tiposFormatados}</p>

                <h3>Atributos</h3>

                <div class="lista-atributos">
                    ${gerarBarraAtributo("HP", pokemon.hp)}
                    ${gerarBarraAtributo("Ataque", pokemon.ataque)}
                    ${gerarBarraAtributo("Defesa", pokemon.defesa)}
                    ${gerarBarraAtributo("Ataque especial", pokemon.ataqueEspecial)}
                    ${gerarBarraAtributo("Defesa especial", pokemon.defesaEspecial)}
                    ${gerarBarraAtributo("Velocidade", pokemon.velocidade)}
                </div>

                <p>
                    <strong>Soma dos atributos:</strong>
                    ${somaAtributos}
                </p>

            </div>
        `;

    } catch (erro) {
        console.error("Erro ao consultar Pokémon:", erro);

        detalhes.innerHTML =
            "<p>Não foi possível carregar os dados desse Pokémon.</p>";
    }
}

async function adicionarPokemonTime() {
    const selecionarPokemon = document.getElementById("selecionar-pokemon");
    const nomeSelecionado = selecionarPokemon.value.trim().toLowerCase();

    if (nomeSelecionado === "") {
        alert("Digite o nome de um Pokémon!");
        return;
    }

    if (meuTime.length >= 6) {
        alert("Seu time já possui 6 Pokémon!");
        return;
    }

    const nomeEncontrado = pokedexCompleta.find(
        pokemon => pokemon.name === nomeSelecionado
    );

    if (!nomeEncontrado) {
        alert("Esse Pokémon não foi encontrado na Pokédex!");
        return;
    }

    const pokemonExistente = meuTime.find(
        pokemon => pokemon.nome === nomeSelecionado
    );

    if (pokemonExistente) {
        alert("Esse Pokémon já está no seu time!");
        return;
    }

    try {
        const novoPokemon = await buscarDetalhesPokemon(nomeSelecionado);

        meuTime.push(novoPokemon);

        atualizarListaTime();

        selecionarPokemon.value = "";

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar os dados desse Pokémon.");
    }
}

function atualizarListaTime() {
    const lista = document.getElementById("lista-time");

    lista.innerHTML = "";

    if (meuTime.length === 0) {
        lista.innerHTML = "<p>Seu time ainda está vazio.</p>";
    } else {
        meuTime.forEach(pokemon => {
            const item = document.createElement("p");

            item.textContent = formatarNomeExibicao(pokemon.nome);

            lista.appendChild(item);
        });
    }

    criarGraficoComparacao();
}

async function carregarPokedex() {
    try {
        const resposta = await fetch(
            "https://pokeapi.co/api/v2/pokemon?limit=2000"
        );

        if (!resposta.ok) {
            throw new Error("Não foi possível acessar a PokéAPI.");
        }

        const dados = await resposta.json();

        pokedexCompleta = dados.results;

        const lista = document.getElementById("lista-pokedex");

        lista.innerHTML = "";

        pokedexCompleta.forEach(pokemon => {
            const opcao = document.createElement("option");

            opcao.value = formatarNomeExibicao(pokemon.name);

            lista.appendChild(opcao);
        });

        console.log("Pokédex carregada:", pokedexCompleta.length);

    } catch (erro) {
        console.error("Erro ao carregar a Pokédex:", erro);
    }
}

async function carregarDados() {
    try {
        const resposta = await fetch("data/pokestats_usage.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o arquivo JSON.");
        }

        const dados = await resposta.json();

        const nomesPokemon = [...new Set(
            dados.map(pokemon => pokemon.pokemon)
        )];

        console.log("Pokémon encontrados:", nomesPokemon);

        const detalhesPokemon = await Promise.all(
            nomesPokemon.map(async nome => {
                try {
                    return await buscarDetalhesPokemon(nome);
                } catch (erro) {
                    console.error(erro.message);
                    return null;
                }
            })
        );

        pokemonValidos = detalhesPokemon.filter(
            pokemon => pokemon !== null
        );

        console.log("Pokémon carregados:", pokemonValidos.length);

        const dadosCompletos = dados.map(registro => {
            const nomeAPI = ajustarNome(registro.pokemon);

            const detalhe = pokemonValidos.find(
                pokemon => pokemon.nome === nomeAPI
            );

            return {
                ...registro,
                ...detalhe
            };
        });

        criarGraficoMaisUsados(dadosCompletos);
        criarGraficoGeracoes(dadosCompletos);
        criarGraficoTipos();
        criarGraficoComparacao();

        const totalPokemon = pokemonValidos.length;

        const pokemonComMaiorSoma = pokemonValidos.reduce(
            (maior, pokemon) => {
                const soma =
                    pokemon.hp +
                    pokemon.ataque +
                    pokemon.defesa +
                    pokemon.ataqueEspecial +
                    pokemon.defesaEspecial +
                    pokemon.velocidade;

                return soma > maior.soma
                    ? { nome: pokemon.nome, soma: soma }
                    : maior;
            },
            { nome: "", soma: 0 }
        );

        const mediaHP = pokemonValidos.reduce(
            (total, pokemon) => total + pokemon.hp,
            0
        ) / totalPokemon;

        const contagemTipos = {};

        pokemonValidos.forEach(pokemon => {
            pokemon.tipos.forEach(tipo => {
                contagemTipos[tipo] = (contagemTipos[tipo] || 0) + 1;
            });
        });

        const tipoMaisComum = Object.entries(contagemTipos).reduce(
            (maior, atual) => atual[1] > maior[1] ? atual : maior,
            ["", 0]
        );

        document.getElementById("kpi-total").textContent = totalPokemon;

        document.getElementById("kpi-maior-soma").textContent =
            `${formatarNomeExibicao(pokemonComMaiorSoma.nome)} (${pokemonComMaiorSoma.soma})`;

        document.getElementById("kpi-tipo").textContent =
            traduzirTipo(tipoMaisComum[0]);

        document.getElementById("kpi-hp").textContent =
            mediaHP.toFixed(1);

        console.log("Maior soma de atributos:", pokemonComMaiorSoma);
        console.log("Tipo mais comum:", tipoMaisComum);
        console.log("Média de HP:", mediaHP);

    } catch (erro) {
        console.error("Erro ao carregar os dados:", erro);
    }
}

document.getElementById("adicionar-pokemon").addEventListener(
    "click",
    adicionarPokemonTime
);

document.getElementById("consultar-pokemon").addEventListener(
    "click",
    consultarPokemon
);

carregarDados();
carregarPokedex();
