const MAX_POKEMON = 1025;
const urlPkm = "https://pokeapi.co/api/v2/pokemon/";
const numSearch = document.querySelector(".por-numero");
const nombreSearch = document.querySelector(".por-nombre");
let pokemon;

$(document).ready(() => {

    llamarMostrarPokemon();

    //llamar todos 
    async function llamarMostrarPokemon() {
        for(let i = 1; i <= MAX_POKEMON; i++) {
            await fetch(urlPkm + i)
            .then(response => response.json())
            .then(data => {
                pokemon = asignarModelo(data);
                displayPokemon(pokemon);
            });
        }
    }
    

    // usar el modelo de datos
    function asignarModelo(datos) {
        let pokemonObj = new PokemonModel(
            datos.id,
            datos.name,
            datos.types,
            datos.height,
            datos.weight,
            datos.abilities,
            datos.stats
        );
        return pokemonObj;
    }

    // enseñar pokemon en la pagina
    function displayPokemon(pokemonDis) {

        let tipos = pokemonDis.tipos.map(tipo => `<p class="${tipo.type.name} tipo">${tipo.type.name}</p>`);
        tipos = tipos.join('');

        const listaItem = $("<div ></div>").addClass("list-item").html(`
            <div class="pkm-img">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDis.id}.png" alt="${pokemonDis.nombre}"/>
            </div>
            <div class="info-pkm">
                <div class="id-nombre">
                    <p class="pkm-id">#${pokemonDis.id}</p>
                    <p class="pkm-nombre">${pokemonDis.nombre}</p>
                </div>
                <div class="pkm-tipos">
                    ${tipos}
                </div>
            </div>
        `).click(() => window.location.href = `./detail.html?id=${pokemonDis.id}`);

        $(".lista-contenedor").append(listaItem);
    }

    $("#busqueda").keypress(async e => { 
        if(e.which == 13) {
            $(".lista-contenedor").empty();

            const busquedaTerm = $("#busqueda").val();

            if(numSearch.selected) {
                for(let i = 1; i <= MAX_POKEMON; i++) {
                    await fetch(urlPkm + i)
                    .then(response => response.json())
                    .then(data => {
                        pokemon = asignarModelo(data);
                        pokemonId = pokemon.id + "";
                        if(pokemonId.startsWith(busquedaTerm)) {
                            displayPokemon(pokemon);
                        }
                    });
                }
            } else if(nombreSearch.selected) {
                for(let i = 1; i <= MAX_POKEMON; i++) {
                    await fetch(urlPkm + i)
                    .then(response => response.json())
                    .then(data => {
                        pokemon = asignarModelo(data);
                        if(pokemon.nombre.toLowerCase().startsWith(busquedaTerm)) {
                            displayPokemon(pokemon);
                        }
                    });
                }
            }

            if($("div.lista-contenedor").length == 0){
                $("#mensaje-no-encontrado").show();
            }
        }
        
    });

    $("#busqueda-cerrar").click(() => {
        $(".lista-contenedor").empty();
        $("#busqueda").val("");
        llamarMostrarPokemon();
        $("#mensaje-no-encontrado").hide();
    });

});