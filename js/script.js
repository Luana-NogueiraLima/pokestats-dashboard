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

// ==========================================
// IDENTIDADE VISUAL DOS GRÁFICOS
// ==========================================

const coresGrafico = {
    azul: "#E53935",          // vermelho principal
    azulClaro: "#FF8A80",
    azulEscuro: "#1B2229",    // fundo do tooltip
    roxo: "#9B1C1C",          // vermelho escuro
    magenta: "#C62828",       // vermelho médio
    amarelo: "#FFCB05",
    laranja: "#FF9F1A",
    vermelho: "#E53935",
    verde: "#4CAF50",
    texto: "#F1F3F4",
    textoSuave: "#9AA7B0",
    grade: "rgba(255, 255, 255, 0.08)",
    fundo: "#26323A"
};

// Degradê vertical (barras em pé): magenta/roxo embaixo -> ciano em cima
function gradienteVertical(chart) {
    try {
        const area = chart.chartArea;

        if (!area || !Number.isFinite(area.top) || !Number.isFinite(area.bottom)) {
            return coresGrafico.roxo;
        }

        const g = chart.ctx.createLinearGradient(0, area.bottom, 0, area.top);
        g.addColorStop(0, coresGrafico.magenta);
        g.addColorStop(0.5, coresGrafico.roxo);
        g.addColorStop(1, coresGrafico.azul);
        return g;
    } catch (erro) {
        return coresGrafico.roxo;
    }
}

// Degradê horizontal (barras deitadas): magenta -> roxo -> ciano
function gradienteHorizontal(context) {
    try {
        const { chart, element } = context;
        const area = chart && chart.chartArea;

        if (!area || !element) return coresGrafico.roxo;

        const { base, x } = element.getProps(["base", "x"], true);

        if (!Number.isFinite(base) || !Number.isFinite(x) || base === x) {
            return coresGrafico.roxo;
        }

        const g = chart.ctx.createLinearGradient(
            Math.min(base, x), 0, Math.max(base, x), 0
        );
        g.addColorStop(0, coresGrafico.magenta);
        g.addColorStop(0.45, coresGrafico.roxo);
        g.addColorStop(1, coresGrafico.azul);
        return g;
    } catch (erro) {
        return coresGrafico.roxo;
    }
}

const fonteGraficos = {
    family: "'Inter', 'Arial', sans-serif",
    size: 12,
    weight: "500"
};

const configuracaoLegenda = {
    display: true,
    position: "bottom",
    labels: {
        color: coresGrafico.texto,
        font: fonteGraficos,
        usePointStyle: true,
        pointStyle: "circle",
        padding: 20,
        boxWidth: 8,
        boxHeight: 8
    }
};

const configuracaoTooltip = {
    backgroundColor: coresGrafico.azulEscuro,
    titleColor: "#FFFFFF",
    bodyColor: "#FFFFFF",
    borderColor: "rgba(229, 57, 53, 0.8)",
    borderWidth: 1,
    padding: 12,
    cornerRadius: 10,
    displayColors: true,
    titleFont: {
        family: fonteGraficos.family,
        size: 13,
        weight: "bold"
    },
    bodyFont: {
        family: fonteGraficos.family,
        size: 12
    }
};

// ==========================================
// TRADUÇÃO DOS TIPOS
// ==========================================

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

// ==========================================
// CONFIGURAÇÃO DOS EIXOS
// ==========================================

function configuracaoEixos() {
    return {
        x: {
            grid: {
                color: coresGrafico.grade,
                drawBorder: false
            },
            border: {
                display: false
            },
            ticks: {
                color: coresGrafico.textoSuave,
                font: fonteGraficos
            }
        },
        y: {
            grid: {
                color: coresGrafico.grade,
                drawBorder: false
            },
            border: {
                display: false
            },
            ticks: {
                color: coresGrafico.textoSuave,
                font: fonteGraficos
            }
        }
    };
}

// ==========================================
// GRÁFICO 1 - POKÉMON MAIS UTILIZADOS
// ==========================================

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

    const canvas = document.getElementById("grafico-mais-usados");

    if (!canvas) return;

    if (graficoMaisUsados) {
        graficoMaisUsados.destroy();
    }

    graficoMaisUsados = new Chart(canvas.getContext("2d"), {
        type: "bar",

        data: {
            labels: ranking.map(pokemon =>
                formatarNomeExibicao(pokemon.nome)
            ),

            datasets: [{
                label: "Utilização média",
                data: ranking.map(pokemon => pokemon.media),

                backgroundColor: gradienteHorizontal,

                borderRadius: 8,
                borderSkipped: false,
                barThickness: 17,
                maxBarThickness: 22
            }]
        },

        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,

            layout: {
                padding: {
                    right: 15,
                    left: 5
                }
            },

            plugins: {
                legend: {
                    ...configuracaoLegenda,
                    position: "bottom"
                },

                tooltip: {
                    ...configuracaoTooltip,

                    callbacks: {
                        label: function (context) {
                            return ` Utilização: ${context.raw.toFixed(2)}%`;
                        }
                    }
                }
            },

            scales: {
                x: {
                    beginAtZero: true,

                    grid: {
                        color: coresGrafico.grade,
                        drawBorder: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: coresGrafico.textoSuave,
                        font: fonteGraficos,

                        callback: function (valor) {
                            return valor + "%";
                        }
                    },

                    title: {
                        display: true,
                        text: "Utilização média (%)",
                        color: coresGrafico.texto,
                        font: {
                            ...fonteGraficos,
                            weight: "bold"
                        }
                    }
                },

                y: {
                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: coresGrafico.texto,
                        font: fonteGraficos
                    },

                    title: {
                        display: true,
                        text: "Pokémon",
                        color: coresGrafico.texto,
                        font: {
                            ...fonteGraficos,
                            weight: "bold"
                        }
                    }
                }
            }
        }
    });
}

// ==========================================
// GRÁFICO 2 - UTILIZAÇÃO POR GERAÇÃO
// ==========================================

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

    const canvas = document.getElementById("grafico-geracoes");

    if (!canvas) return;

    if (graficoGeracoes) {
        graficoGeracoes.destroy();
    }

    graficoGeracoes = new Chart(canvas.getContext("2d"), {
        type: "bar",

        data: {
            labels: geracoes.map(item => item.nome),

            datasets: [{
                label: "Utilização média",
                data: geracoes.map(item => item.media),

                backgroundColor: context => gradienteVertical(context.chart),
                hoverBackgroundColor: coresGrafico.laranja,

                borderRadius: 9,
                borderSkipped: false,
                barPercentage: 0.65,
                categoryPercentage: 0.75
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    ...configuracaoLegenda
                },

                tooltip: {
                    ...configuracaoTooltip,

                    callbacks: {
                        label: function (context) {
                            return ` Utilização: ${context.raw.toFixed(2)}%`;
                        }
                    }
                }
            },

            scales: {
                x: {
                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: coresGrafico.texto,
                        font: fonteGraficos
                    },

                    title: {
                        display: true,
                        text: "Geração",
                        color: coresGrafico.texto,
                        font: {
                            ...fonteGraficos,
                            weight: "bold"
                        }
                    }
                },

                y: {
                    beginAtZero: true,

                    grid: {
                        color: coresGrafico.grade
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: coresGrafico.textoSuave,
                        font: fonteGraficos,

                        callback: function (valor) {
                            return valor + "%";
                        }
                    },

                    title: {
                        display: true,
                        text: "Utilização média (%)",
                        color: coresGrafico.texto,
                        font: {
                            ...fonteGraficos,
                            weight: "bold"
                        }
                    }
                }
            }
        }
    });
}

// ==========================================
// GRÁFICO 3 - DISTRIBUIÇÃO DOS TIPOS
// ==========================================

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

    const coresTipos = {
        normal: "#A8A77A",
        fire: "#EE8130",
        water: "#6390F0",
        electric: "#F7D02C",
        grass: "#7AC74C",
        ice: "#96D9D6",
        fighting: "#C22E28",
        poison: "#A33EA1",
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        bug: "#A6B91A",
        rock: "#B6A136",
        ghost: "#735797",
        dragon: "#6F35FC",
        dark: "#705746",
        steel: "#B7B7CE",
        fairy: "#D685AD"
    };

    const canvas = document.getElementById("grafico-tipos");

    if (!canvas) return;

    if (graficoTipos) {
        graficoTipos.destroy();
    }

    graficoTipos = new Chart(canvas.getContext("2d"), {
        type: "doughnut",

        data: {
            labels: tiposOrdenados.map(item =>
                traduzirTipo(item[0])
            ),

            datasets: [{
                label: "Quantidade de Pokémon",

                data: tiposOrdenados.map(item => item[1]),

                backgroundColor: tiposOrdenados.map(
                    item => coresTipos[item[0]] || coresGrafico.azul
                ),

                borderColor: "#26323A",
                borderWidth: 4,
                hoverBorderWidth: 5,
                hoverOffset: 10,
                spacing: 2
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            cutout: "62%",

            plugins: {
                legend: {
                    display: true,
                    position: "bottom",

                    labels: {
                        color: coresGrafico.texto,
                        font: fonteGraficos,
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 14,
                        boxWidth: 8,
                        boxHeight: 8
                    }
                },

                tooltip: {
                    ...configuracaoTooltip,

                    callbacks: {
                        label: function (context) {
                            const total = context.dataset.data.reduce(
                                (soma, valor) => soma + valor,
                                0
                            );

                            const porcentagem =
                                (context.raw / total) * 100;

                            return ` ${context.label}: ${context.raw} Pokémon (${porcentagem.toFixed(1)}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ==========================================
// GRÁFICO 4 - COMPARAÇÃO DO MEU TIME
// ==========================================

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

        backgroundColor: "rgba(229, 57, 53, 0.25)",
        borderColor: coresGrafico.azul,

        pointBackgroundColor: coresGrafico.azul,
        pointBorderColor: "#26323A",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,

        borderWidth: 3,
        fill: true
    }];

    if (meuTime.length > 0) {
        const mediaTime = atributos.map(
            atributo => calcularMedia(meuTime, atributo)
        );

        datasets.push({
            label: "Meu time",

            data: mediaTime,

            backgroundColor: "rgba(255, 203, 5, 0.22)",
            borderColor: coresGrafico.amarelo,

            pointBackgroundColor: coresGrafico.amarelo,
            pointBorderColor: "#26323A",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,

            borderWidth: 3,
            fill: true
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

    graficoComparacao = new Chart(canvas.getContext("2d"), {
        type: "radar",

        data: {
            labels: atributos.map(atributo => atributo.nome),
            datasets: datasets
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    ...configuracaoLegenda
                },

                tooltip: {
                    ...configuracaoTooltip,

                    callbacks: {
                        label: function (context) {
                            return ` ${context.dataset.label}: ${context.raw.toFixed(1)}`;
                        }
                    }
                }
            },

            scales: {
                r: {
                    beginAtZero: true,
                    min: 0,
                    max: 255,

                    angleLines: {
                        color: coresGrafico.grade
                    },

                    grid: {
                        color: coresGrafico.grade
                    },

                    pointLabels: {
                        color: coresGrafico.texto,
                        font: {
                            ...fonteGraficos,
                            size: 11,
                            weight: "600"
                        }
                    },

                    ticks: {
                        stepSize: 50,
                        color: coresGrafico.textoSuave,
                        backdropColor: "transparent",
                        font: {
                            ...fonteGraficos,
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

// ==========================================
// BUSCAR DETALHES DE UM POKÉMON NA API
// ==========================================

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

        imagem:
            pokemonAPI.sprites?.other?.home?.front_default ||
            pokemonAPI.sprites?.other?.["official-artwork"]?.front_default ||
            pokemonAPI.sprites?.front_default,

        tipos: pokemonAPI.types.map(tipo => tipo.type.name),

        hp: pokemonAPI.stats[0].base_stat,
        ataque: pokemonAPI.stats[1].base_stat,
        defesa: pokemonAPI.stats[2].base_stat,
        ataqueEspecial: pokemonAPI.stats[3].base_stat,
        defesaEspecial: pokemonAPI.stats[4].base_stat,
        velocidade: pokemonAPI.stats[5].base_stat
    };
}

// ==========================================
// BARRAS DE ATRIBUTOS
// ==========================================

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

// ==========================================
// CONSULTAR POKÉMON
// ==========================================

async function consultarPokemon() {
    const campoBusca = document.getElementById("buscar-analise");
    const nome = campoBusca.value.trim().toLowerCase();

    const detalhes = document.getElementById("detalhes-pokemon");

    if (nome === "") {
        alert("Digite o nome de um Pokémon!");
        return;
    }

    const nomeAPI = ajustarNome(nome);

    const pokemonEncontrado = pokedexCompleta.find(
        pokemon => pokemon.name === nomeAPI
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

// ==========================================
// ADICIONAR POKÉMON AO TIME
// ==========================================

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

    const nomeAPI = ajustarNome(nomeSelecionado);

    const nomeEncontrado = pokedexCompleta.find(
        pokemon => pokemon.name === nomeAPI
    );

    if (!nomeEncontrado) {
        alert("Esse Pokémon não foi encontrado na Pokédex!");
        return;
    }

    const pokemonExistente = meuTime.find(
        pokemon => pokemon.nome === nomeAPI
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

// ==========================================
// ATUALIZAR LISTA DO MEU TIME
// ==========================================

function atualizarListaTime() {
    const lista = document.getElementById("lista-time");

    lista.innerHTML = "";

    if (meuTime.length === 0) {
        lista.innerHTML = "<p>Seu time ainda está vazio.</p>";
    } else {
        const container = document.createElement("div");
        container.className = "grid-time";

        meuTime.forEach(pokemon => {
            const item = document.createElement("article");
            item.className = "pokemon-time-card";

            const nomeFormatado = formatarNomeExibicao(pokemon.nome);

            const imagem = document.createElement("img");
            imagem.src = pokemon.imagem || "";
            imagem.alt = nomeFormatado;

            const titulo = document.createElement("h3");
            titulo.textContent = nomeFormatado;

            const tipos = document.createElement("p");
            tipos.textContent = pokemon.tipos
                .map(traduzirTipo)
                .join(" / ");

            item.appendChild(imagem);
            item.appendChild(titulo);
            item.appendChild(tipos);

            container.appendChild(item);
        });

        lista.appendChild(container);
    }

    criarGraficoComparacao();
}

// ==========================================
// CARREGAR POKÉDEX
// ==========================================

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

// ==========================================
// CARREGAR DADOS DO DASHBOARD
// ==========================================

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
                ...(detalhe || {})
            };
        });

        // Criar os gráficos
        criarGraficoMaisUsados(dadosCompletos);
        criarGraficoGeracoes(dadosCompletos);
        criarGraficoTipos();
        criarGraficoComparacao();

        // Atualizar os indicadores
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

        const mediaHP = totalPokemon > 0
            ? pokemonValidos.reduce(
                (total, pokemon) => total + pokemon.hp,
                0
            ) / totalPokemon
            : 0;

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
            pokemonComMaiorSoma.nome
                ? `${formatarNomeExibicao(pokemonComMaiorSoma.nome)} (${pokemonComMaiorSoma.soma})`
                : "—";

        document.getElementById("kpi-tipo").textContent =
            tipoMaisComum[0]
                ? traduzirTipo(tipoMaisComum[0])
                : "—";

        document.getElementById("kpi-hp").textContent =
            mediaHP.toFixed(1);

        console.log("Maior soma de atributos:", pokemonComMaiorSoma);
        console.log("Tipo mais comum:", tipoMaisComum);
        console.log("Média de HP:", mediaHP);

    } catch (erro) {
        console.error("Erro ao carregar os dados:", erro);
    }
}

// ==========================================
// EVENTOS
// ==========================================

document.getElementById("adicionar-pokemon").addEventListener(
    "click",
    adicionarPokemonTime
);

document.getElementById("consultar-pokemon").addEventListener(
    "click",
    consultarPokemon
);

// ==========================================
// INICIALIZAÇÃO
// ==========================================

carregarDados();
carregarPokedex();