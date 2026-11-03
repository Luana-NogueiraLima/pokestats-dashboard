
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

async function carregarDados() {
    try {
        const resposta = await fetch("data/pokestats_usage.json");
        const dados = await resposta.json();

        const nomesPokemon = [...new Set(
            dados.map(pokemon => pokemon.pokemon)
        )];

        console.log("Pokémon encontrados:", nomesPokemon);

        const detalhesPokemon = await Promise.all(
            nomesPokemon.map(async nome => {
                try {
                    const nomeAPI = ajustarNome(nome);

                    const respostaAPI = await fetch(
                        `https://pokeapi.co/api/v2/pokemon/${nomeAPI}`
                    );

                    if (!respostaAPI.ok) {
                        throw new Error(`Não encontrado: ${nome}`);
                    }

                    const pokemonAPI = await respostaAPI.json();

                    return {
                        nome: pokemonAPI.name,
                        imagem: pokemonAPI.sprites.front_default,
                        tipos: pokemonAPI.types.map(
                            tipo => tipo.type.name
                        ),
                        hp: pokemonAPI.stats[0].base_stat,
                        ataque: pokemonAPI.stats[1].base_stat,
                        defesa: pokemonAPI.stats[2].base_stat,
                        ataqueEspecial: pokemonAPI.stats[3].base_stat,
                        defesaEspecial: pokemonAPI.stats[4].base_stat,
                        velocidade: pokemonAPI.stats[5].base_stat
                    };

                } catch (erro) {
                    console.error(erro.message);
                    return null;
                }
            })
        );

        const pokemonValidos = detalhesPokemon.filter(
            pokemon => pokemon !== null
        );

        console.log("Pokémon carregados:", pokemonValidos.length);
        console.log("Detalhes dos Pokémon:", pokemonValidos);

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

        console.log("Dados combinados:", dadosCompletos);
        console.log("Total de registros:", dadosCompletos.length);
        console.log("Exemplo de registro:", dadosCompletos[0]);

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
            `${pokemonComMaiorSoma.nome} (${pokemonComMaiorSoma.soma})`;

        document.getElementById("kpi-tipo").textContent =
            tipoMaisComum[0];

        document.getElementById("kpi-hp").textContent =
            mediaHP.toFixed(1);

        console.log("Maior soma de atributos:", pokemonComMaiorSoma);
        console.log("Tipo mais comum:", tipoMaisComum);
        console.log("Média de HP:", mediaHP);

    } catch (erro) {
        console.error("Erro ao carregar os dados:", erro);
    }
}

carregarDados();
