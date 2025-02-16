
class PokemonModel {
    id;
    nombre;
    tipos = [];
    altura;
    peso;
    habilidades = [];
    estadisticas = [];

    constructor(id, nombre, tipos, altura, peso, habilidades, estadisticas) {
        this.id = id;
        this.nombre = nombre;
        this.tipos = tipos;
        this.altura = altura / 10;
        this.peso = peso / 10;
        this.habilidades = habilidades;
        this.estadisticas = estadisticas;
    }
}