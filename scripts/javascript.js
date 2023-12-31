var pokemons = []
const listaPokemonsHtml = document.getElementById('box-pokemons')
const input_pesquisa = document.getElementById('input-pesquisa')
const btn_load_more = document.getElementById('btn-load-more')
const numEncontrados = document.getElementById('num-pokemon-encontrado')
var offset = 0
var limit = 17

async function requisicaoPrimeirosPokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1292');
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        const data = await response.json();

        for (const element of data['results']) {
            let id = parseInt(element.url.split("/")[6]);
            const nomePokemon = element['name'];
            let imgPokemon = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

            // Formate o ID com zeros à esquerda
            const formattedId = id.toString().padStart(4, '0');

            const typeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-form/${id}/`);
            if (!typeResponse.ok) {
                console.error('Erro na requisição dos tipos');
                continue;
            }

            const typeData = await typeResponse.json();
            const typesPokemon = typeData['types'].map(type => type['type']['name']);

            if (id <= 18) {
                const item = document.createElement('li');
                item.innerHTML = `
                <div id="container-img-pokemon">
                    <img src="${imgPokemon}" alt="${element['name']}">
                </div>
                <div id="container-information-pokemon">
                    <p id="nameAndId"><strong>#${formattedId} ${element['name']}</strong></p>
                    ${verificationBtns(typesPokemon)}
                </div>
                `;
                listaPokemonsHtml.appendChild(item);
            }

            pokemons.push({ "id": formattedId, "name": nomePokemon, "imgPokemon": imgPokemon, "types": typesPokemon });
        }
    } catch (error) {
        console.error('Ocorreu um erro:', error);
    }
}


requisicaoPrimeirosPokemon()

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
                    <p id="nameAndId"><strong>#${pokemons[i]['id']} ${pokemons[i]['name']}</strong></p>
                    ${verificationBtns(pokemons[i]['types'])}
                </div>
            `
            listaPokemonsHtml.appendChild(item)
            cont++
        }
        btn_load_more.scrollIntoView({behavior:"smooth"})
        if(offset == 1296){
            btn_load_more.style.display = "none"
        }
}

function verificationBtns(types){
    let estrutura = ""
    if(types.length != 2){ 
        estrutura = `<button class="${types[0]}">${types[0]}</button>`
    }else{
        estrutura = `<button class="${types[0]}">${types[0]}</button><button class="${types[1]}">${types[1]}</button>`
    }
    return estrutura
}

function filtrar(){
    if(input_pesquisa.value == ""){
        location.reload()
    }
    let resultados = []
    let campoDig = input_pesquisa.value.toLowerCase()
    input_pesquisa.value = ""
    pokemons.forEach(element => {
        if(element['types'].includes(campoDig) || element['name'].includes(campoDig)  || element['id'].toString().includes(campoDig)){
            resultados.push(element)
        }
    });
    listaPokemonsHtml.innerHTML = ""
    resultados.forEach(element => {
        let item = document.createElement('li')
            item.innerHTML = `
                <div id="container-img-pokemon">
                    <img src="${element['imgPokemon']}" alt="${element['name']}">
                </div>
                <div id="container-information-pokemon">
                    <p id="nameAndId"><strong>#${element['id']} ${element['name']}</strong></p>
                    ${verificationBtns(element['types'])}
                </div>
            `
            listaPokemonsHtml.appendChild(item)
    });
    numEncontrados.innerHTML = resultados.length
    if(resultados.length == 0){
        listaPokemonsHtml.innerHTML = "<h3>Nenhum Pokémon corresponde à sua pesquisa!</h3>"
    }

    if(numEncontrados.innerHTML != "1292"){
        btn_load_more.style.display = "none"
    }else{
        btn_load_more.style.display = "block"
    }
}