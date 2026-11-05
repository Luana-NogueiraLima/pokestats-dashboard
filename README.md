# 🎮 PokéStats — Dashboard de Estatísticas Pokémon

## 📌 Sobre o projeto

O **PokéStats** é um dashboard interativo desenvolvido como projeto acadêmico, com o objetivo de explorar e apresentar dados sobre Pokémon, suas gerações e sua utilização no cenário competitivo.

O sistema reúne dados estatísticos do Smogon e informações complementares da PokéAPI, apresentando os resultados por meio de gráficos interativos, consulta individual de Pokémon e comparação de equipes.

Além disso, o projeto conta com uma área de análises pessoais, na qual é possível cadastrar, consultar, editar e excluir registros utilizando o Back4App.

## 🎯 Objetivos

- Apresentar estatísticas de utilização de Pokémon no cenário competitivo.
- Comparar dados entre as diferentes gerações.
- Identificar os Pokémon com maior utilização.
- Explorar a distribuição dos Pokémon por tipo.
- Consultar informações individuais sobre Pokémon.
- Permitir a montagem e comparação de equipes.
- Desenvolver uma interface interativa para visualização de dados.
- Implementar operações de cadastro, consulta, edição e exclusão (CRUD).

## 🛠️ Tecnologias utilizadas

- **HTML5:** estrutura das páginas.
- **CSS3:** estilização e organização visual.
- **JavaScript:** funcionalidades e manipulação dos dados.
- **Chart.js:** criação dos gráficos.
- **Smogon:** fonte das estatísticas de utilização competitiva.
- **PokéAPI:** consulta de informações, imagens, tipos e atributos dos Pokémon.
- **Back4App:** armazenamento e gerenciamento das análises cadastradas.
- **Git e GitHub:** versionamento e hospedagem do código-fonte.

## 📊 Funcionalidades

### Dashboard estatístico

- Visualização dos Pokémon mais utilizados no cenário competitivo.
- Comparação da utilização entre as gerações.
- Distribuição dos Pokémon por tipo.
- Apresentação de indicadores gerais dos dados analisados.

### Consulta de Pokémon

- Busca individual de Pokémon.
- Exibição de imagem, tipos e atributos básicos.
- Consulta de informações por meio da PokéAPI.

### Meu Time

- Montagem de uma equipe com até seis Pokémon.
- Visualização dos Pokémon selecionados.
- Comparação da média dos atributos básicos da equipe com os Pokémon analisados.
- Apresentação da comparação por meio de gráfico radar.

### Minhas análises Pokémon

Integração com o Back4App para realizar as operações CRUD:

- **Create:** cadastrar uma análise.
- **Read:** consultar e listar análises cadastradas.
- **Update:** editar uma análise existente.
- **Delete:** excluir uma análise.

## 📂 Estrutura do projeto

```text
pokestats-dashboard/
│
├── css/
│   └── style.css
│
├── data/
│   ├── Dados smogon
│   └── pokestats_usage.json
│
├── docs/
│   └── Fontes e metodologia
│
├── js/
│   ├── back4app.js
│   └── script.js
│
├── index.html
└── README.md
```

## 🔎 Fontes de dados

O projeto utiliza duas fontes principais:

- **Smogon:** fornece estatísticas de utilização de Pokémon no cenário competitivo. Os dados utilizados correspondem ao período de janeiro a março de 2026.
  - https://www.smogon.com/stats/

- **PokéAPI:** fornece informações complementares sobre os Pokémon, como imagens, nomes, tipos, gerações e atributos básicos.
  - https://pokeapi.co/

Os critérios de seleção, tratamento e organização dos dados estão descritos no documento [Fontes e metodologia](docs/Fontes%20e%20metodologia).

## 🚀 Como executar o projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/Luana-NogueiraLima/pokestats-dashboard.git
   ```

2. Abra a pasta do projeto no Visual Studio Code.

3. Execute o arquivo `index.html` utilizando a extensão Live Server ou outro servidor local.

4. Acesse o endereço disponibilizado pelo servidor no navegador.

### Integração com o Back4App

Para utilizar a área de análises, é necessário configurar a integração com o Back4App.

O arquivo responsável por essa conexão é `js/back4app.js`. Nele, devem estar configurados o Application ID e a JavaScript Key da aplicação criada no Back4App.

A classe utilizada para armazenar os registros é `AnalisesPokemon`.

## 👥 Equipe

Projeto desenvolvido em equipe como atividade acadêmica.

- Integrante 1: Beatriz da Silva Dias
- Integrante 2: Luana Nogueira de Lima
- Integrante 3: Maria Luiza do Nascimento Teixeira

## 📌 Status do projeto

Projeto acadêmico em fase de finalização.

---

Desenvolvido para fins acadêmicos.
