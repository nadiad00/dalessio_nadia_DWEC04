const MAX_POKEMON = 1304;
const listaContenedor = document.querySelector(".lista-contenedor");
const busquedaIn = document.querySelector("#busqueda");
const numSort = document.querySelector(".por-numero");
const nombreSort = document.querySelector(".por-nombre");
const msjNotFound = document.querySelector("#mensaje-no-encontrado");
const btnCerrar = document.getElementById("busqueda-cerrar");

let allPokemon = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then(response => response.json())
.then(data => {
    allPokemon = data.results;
    displayPokemon(allPokemon);
});



async function fetchPokemonDataBeforeRedirect(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => response.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            .then(response => response.json())
        ]);
    } catch (error) {
        console.log("No se ha podido obtener la información antes del rediccionamiento");
    }
}

function displayPokemon(pokemon) {
    listaContenedor.innerHTML = "";

    pokemon.forEach(pokemon => {

        let tipos = pokemon.types?.map(type => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
        tipos = tipos?.join('');

        const pokemonId = pokemon.url.split("/")[6];
        const listaItem = document.createElement("div");
        listaItem.className = "list-item";
        listaItem.innerHTML = `
            <div class="pkm-img">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemon.name}"/>
            </div>
            <div class="info-pkm">
                <div class="id-nombre">
                    <p class="pkm-id">#${pokemonId}</p>
                    <p class="pkm-nombre">${pokemon.name}</p>
                </div>
                <div class="pkm-tipos">
                    ${tipos}
                </div>
            </div>
        `;
        listaItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect(pokemonId);
            if(success) {
                window.location.href = `./pokemon.html?id=${pokemonId}`;
            }
        });

        listaContenedor.appendChild(listaItem);
    });
}

$("#tipos").click(() => {
    $(".normal").css("background", "gray");
})

busquedaIn.addEventListener("keyup", handleSearch);


function handleSearch() {
    const busquedaTerm = busquedaIn.value.toLowerCase();
    let pkmFiltrados;

    // ordenar.addEventListener('change', () => {
    //     ordenarValor = this.value;
    //     return ordenarValor;
    // });

    if(numSort.selected) {
        pkmFiltrados = allPokemon.filter(pokemon => {
            const pokemonId = pokemon.url.split("/")[6];
            return pokemonId.startsWith(busquedaTerm);
        });
    } else if(nombreSort.selected) {
        pkmFiltrados = allPokemon.filter(pokemon => {
            return pokemon.name.toLowerCase().startsWith(busquedaTerm);
        });
    } else {
        pkmFiltrados = allPokemon;
    }

    displayPokemon(pkmFiltrados);

    if(pkmFiltrados.length === 0) {
        msjNotFound.style.display = "block";
    } else {
        msjNotFound.style.display = "none";
    }
}

btnCerrar.addEventListener("click", limpriarBusqueda);

function limpriarBusqueda() {
    busquedaIn.value = "";
    displayPokemon(allPokemon);
    msjNotFound.style.display = "none";
}