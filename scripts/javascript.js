var pokemons = []
var validacao = true
var listaPokemonsHtml = document.getElementById('box-pokemons')
var offset = 0
var limit = 17
var input_pesquisa = document.getElementById('input-pesquisa')

async function requisicaoPokemon(){
    if(validacao){
        await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1017')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na requisição');
        }
        return response.json();
      })
      .then(data => {
        let cont = 1
        data['results'].forEach(element => {
            let nomePokemon = element['name']
            let imgPokemon = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${cont}.png`
            let typesPokemon = []
             fetch(`https://pokeapi.co/api/v2/pokemon-form/${cont}/`)//GET Types
            .then(response => response.json())
            .then(async function (data){
                await data['types'].forEach(element => {
                    let tipos = element['type']['name']
                    typesPokemon.push(tipos)
                });
            })
            .catch(function (error){
                console.log(error);
            })
            pokemons.push({"id": cont, "name": nomePokemon, "imgPokemon": imgPokemon, "types": typesPokemon})
            cont++
        });
      })
      .catch(error => {
        console.error('Ocorreu um erro:', error);
      });
      validacao = false
    }  
}

function mostrarPokemons(){
    requisicaoPokemon()
    setTimeout(() => {
        var cont = 1
        for(let i = 0;i <= 17; i++){
            let item = document.createElement('li')
            item.innerHTML = `
                <div id="container-img-pokemon">
                    <img src="${pokemons[i]['imgPokemon']}" alt="${pokemons[i]['name']}">
                </div>
                <div id="container-information-pokemon">
                    <p id="nameAndId"><strong>#${cont} ${pokemons[i]['name']}</strong></p>
                    ${verificationBtns(i)}
                </div>
            `
            listaPokemonsHtml.appendChild(item)
            cont++
        }
    }, 800);
}

function carregarMais(){
        var cont = limit + 2
        offset += 18
        limit += 18
        for(let i = offset;i <= limit; i++){
            let item = document.createElement('li')
            item.innerHTML = `
                <div id="container-img-pokemon">
                    <img src="${pokemons[i]['imgPokemon']}" alt="${pokemons[i]['name']}">
                </div>
                <div id="container-information-pokemon">
                    <p id="nameAndId"><strong>#${cont} ${pokemons[i]['name']}</strong></p>
                    ${verificationBtns(i)}
                </div>
            `
            listaPokemonsHtml.appendChild(item)
            cont++
        }
        window.scrollTo(0, 500)
        scrollIntoView({ behavior: 'smooth' })
}

function verificationBtns(cont){
    let estrutura = ""
    if(pokemons[cont].types.length != 2){
        estrutura = `<button class="${pokemons[cont].types[0]}">${pokemons[cont]['types'][0]}</button>`
    }else{
        estrutura = `<button class="${pokemons[cont].types[0]}">${pokemons[cont]['types'][0]}</button><button class="${pokemons[cont].types[1]}">${pokemons[cont]['types'][1]}</button>`
    }
    return estrutura
}

mostrarPokemons()