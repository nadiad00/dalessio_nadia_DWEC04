let currentPkmId = null;

$(document).ready(() => {
    const MAX_POKEMON = 1025;
    const pkmId = new URLSearchParams(window.location.search).get("id");
    const id = parseInt(pkmId, 10);

    if(id < 1 || id > MAX_POKEMON) {
        return(window.location.href = "./index.html");
    }
    currentPkmId = id;
    cargarPkm(id);
});

async function cargarPkm(id) {
    try {
        const pokemon = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => response.json())
            .then(data => {
                return new PokemonModel(
                    data.id,
                    data.name,
                    data.types,
                    data.height,
                    data.weight,
                    data.abilities,
                    data.stats
                );
            })
        ]);

        const abilitiesContenedor = $(".pkm-abilities").val("");

        if(currentPkmId == id) {
            displayPokemonDetails(pokemon);

            const[flechaL, flechaR] = ["#flecha-l", "#flecha-r"].map(selection => document.querySelector(sel));
            flechaL.removeEventListener("click", navigarPokemon());
            flechaR.removeEventListener("click", navigarPokemon());

            if(id !== 1) {
                flechaL.addEventListener("click", () => navigarPokemon(id - 1));
            }
            if(id !== MAX_POKEMON) {
                flechaR.addEventListener("click", () => navigarPokemon(id + 1));
            }

            // cambia de pestaña sin refrescar la pagina
            window.history.pushState({}, "", `./detail.html?id=${id}`);
        }

        return true;

    } catch(error) {
        console.error("No se han podido cargar los Pokémon.");
        return false;
    }
}

async function navigarPokemon(id) {
    currentPkmId = id;
    await cargarPkm(id);
}

const coloresTipos = {
    normal: "#868076",
    fighting: "#531c0f",
    fire: "#ef8a2b",
    water: "#4189c4",
    grass: "#328333",
    electric: "#efe22c",
    ice: "#86d3e0",
    poison: "#46185c",
    ground: "#ad9960",
    flying: "#7095d8",
    psychic: "#dc2788",
    bug: "#9ac43f",
    ghost: "#2c224e",
    dark: "#181304",
    dragon: "#2e18c0",
    steel: "#8b9a9f",
    fairy: "#e1a7e7"
};


function aplicarEstiloElementos(elementos, cssProperty, value) {
    elementos.forEach(element => {
        element.style[cssProperty] = value;
    });
}

function rgbaFromHex(hexColor) {
    return [parseInt(hexColor.slice(1, 3), 16), parseInt(hexColor.slice(3, 5), 16), parseInt(hexColor.slice(5, 7), 16)]
    .join(", ");
}

function aplicarBgTipo(pokemon) {
    const mainTipo = pokemon.tipos[0].type.name;
    const color = coloresTipos[mainTipo];

    if(!color) {
        console.warn(`No existe color por el tipo ${mainTipo}`);
        return;
    }

    const detailMainElement = document.querySelector(".main-pkm");
    aplicarEstiloElementos([detailMainElement], "backgroundColor", color);
    aplicarEstiloElementos([detailMainElement], "borderColor", color);

    aplicarEstiloElementos(document.querySelectorAll(".tipos-contenedor > p"), "backgroundColor", color);
    aplicarEstiloElementos(document.querySelectorAll(".stat-contenedor p.stats"), "color", color);
    aplicarEstiloElementos(document.querySelectorAll(".stat-contenedor .progress-bar"), "color", color);

    const rgbaColor = rgbaFromHex(color);
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
    .stat-contenedor .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }
        
    .stat-contenedor .progress-bar::-webkit-progress-value {
        background-color: ${color};
    }`
}

function mayusLetra(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function crearAniadirElem(parent, tag, options = {}) {
    const element = document.createElement(tag);
    Object.keys(options).forEach(key => element[key] = options[key]);
    parent.appendChild(element);
    return element;
}

function displayPokemonDetails(pokemon) {
    document.querySelectorAll("title").textContent = mayusLetra(pokemon.nombre);

    const detailMainElement = document.querySelector(".main-pkm");
    detailMainElement.classList.add(pokemon.nombre.toLowerCase());

    document.querySelector(".nombre-pkm-contenedor .nombre-pkm").textContent = mayusLetra(pokemon.nombre);

    document.querySelector(".id-pkm-contenedor").textContent = `#${String(pokemon.id).padStart(3, "0")}`;

    const imgElement = document.querySelector(".img-pkm-contenedor img");
    imgElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

    const typeContenedor = document.querySelector(".tipos-contenedor");
    typeContenedor.innerHTML = "";
    pokemon.tipos.forEach(type => {
        crearAniadirElem(typeContenedor, "p", {
            className: `tipo ${type.name}`,
            textcontent: type.name,
        });
    });

    document.querySelector(".weight-pkm").textContent = `${pokemon.peso}kg`;
    document.querySelector(".height-pkm").textContent = `${pokemon.altura}m`;

    const abilitiesContenedor = document.querySelector(".pkm-abilities .pkm-details");
    pokemon.habilidades.forEach(habilidad => {
        crearAniadirElem(abilitiesContenedor, "p", {
            className: `habilidad`,
            textcontent: habilidad.name,
        });
    });

    const statsContenedor = document.querySelector(".stats-contenedor");
    statsContenedor.innerHTML = "";

    const statNameMapping = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special attack": "SATK",
        "special defense": "SDEF",
        speed: "SPD"
    }

    pokemon.estadisticas.forEach(({stat, base_stat}) => {
        const statDiv = document.createElement("div");
        statDiv.className = "stat-contenedor";
        statsContenedor.appendChild(statDiv);
        crearAniadirElem(statDiv, "p", {
            className: `stats`,
            textcontent: statNameMapping[stat.name],
        });
        crearAniadirElem(statDiv, "p", {
            className: `stats-num`,
            textcontent: String(base_stat).padStart(3, "0"),
        });
        crearAniadirElem(statDiv, "p", {
            className: `progress-bar`,
            value: base_stat,
            max: 100
        });
    });

}