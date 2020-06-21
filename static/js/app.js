
let planetsTBody = document.querySelector('.planets')
let nextBtn = document.getElementById('next')
let previousBtn =document.getElementById('previous')
const variable = 'https://swapi.dev/api/planets/?page=1'
const modal = document.querySelector('#show-modal')
const backdrop = document.getElementById('backdrop')
const closeModalBtn = document.querySelector('.modal__actions')
const planetsTable = document.querySelector('.planets-table')
const votesTable = document.querySelector('.votes-table')
const closeModalVote = document.querySelector('#close-vote')



closeModalVote.addEventListener('click', ()=>{
        backdrop.classList.toggle('visible')
        modal.classList.toggle('visible')
        votesTable.classList.toggle('visible')})

closeModalBtn.addEventListener('click', ()=>{
        backdrop.classList.toggle('visible')
        modal.classList.toggle('visible')
        planetsTable.classList.toggle('visible')
        })


async function getPlanets(planetsEndpoint) {
    let count = parseInt(planetsEndpoint[planetsEndpoint.length-1])
    planetsTBody.innerHTML = ''
    let data = await fetch(`${planetsEndpoint}`)
    let jsonData = await data.json()
    let resultData = jsonData.results
    nextBtn.setAttribute('data-fetch', jsonData.next)
    if (jsonData.next === null) {
        nextBtn.setAttribute('disabled', true)
    } else {
        nextBtn.removeAttribute('disabled')
    }
    previousBtn.setAttribute('data-fetch', jsonData.previous)
    if (jsonData.previous === null) {
        previousBtn.setAttribute('disabled', true)
    } else {
        previousBtn.removeAttribute('disabled')
    }

    let list = []

    for (let i=0; i<10; i++) {
        let newTr = document.createElement('tr')
        list.push(newTr)
        planetsTBody.appendChild(list[i])
        let th = document.createElement('th')
        th.innerHTML = `<th> ${i+1+(count-1)*10} </th>`
        list[i].appendChild(th)
        let tdElementName = document.createElement('td')
        tdElementName.innerHTML = `<td>${resultData[i].name}</td>`
        list[i].appendChild(tdElementName)
        let tdElementDiam = document.createElement('td')
        tdElementDiam.innerHTML = `<td> ${numberWithCommas(resultData[i].diameter)} km </td>`
        list[i].appendChild(tdElementDiam)
        let tdElementClimate = document.createElement('td')
        tdElementClimate.innerHTML = `<td> ${resultData[i].climate} </td>`
        list[i].appendChild(tdElementClimate)
        let tdElementTerrain = document.createElement('td')
        tdElementTerrain.innerHTML = `<td> ${resultData[i].terrain}</td>`
        list[i].appendChild(tdElementTerrain)
        let tdElementSWater = document.createElement('td')
        tdElementSWater.innerHTML = `<td> ${resultData[i].surface_water}</td>`
        list[i].appendChild(tdElementSWater)
        let tdElementPopulation = document.createElement('td')
        tdElementPopulation.innerHTML = `<td> ${numberWithCommas(resultData[i].population)} population</td>`
        list[i].appendChild(tdElementPopulation)
        let residents = document.createElement('td')
        let residentsListLength = resultData[i].residents.length
        if (residentsListLength === 0) {
            residents.innerHTML = `<td>No known residents</td>`
        } else {residents.innerHTML = `<td><button class="btn btn-light residents" type="button" >${residentsListLength} resident(s)</button></td>`

            residents.setAttribute('data-residents', `${resultData[i].residents}`)
            residents.setAttribute('data-planet', `${resultData[i].name}`)
            residents.addEventListener('click', openModal)
            }
        list[i].appendChild(residents)
        let username = document.getElementById('username')
        if (username) {
            let vote = document.createElement('td')
            vote.innerHTML = `<td><button class="btn btn-light">${'vote'}</button></td>`
            vote.setAttribute('data-planet', `${resultData[i].name}`)
            vote.setAttribute('data-index', `${i+1+(count-1)*10}`)
            list[i].appendChild(vote)
            vote.addEventListener('click', voteModal)

        }
    }
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

nextBtn.addEventListener('click', ()=>{
    let nextUrlData = document.querySelector('#next')
    let nextUrl = nextUrlData.dataset.fetch
    if (nextUrl !== null) {
        getPlanets(nextUrl)
    }
})

previousBtn.addEventListener('click', ()=>{

    let prevUrlData = document.querySelector('#previous')
    let prevUrl = prevUrlData.dataset.fetch
    if (prevUrl !== null) {
        getPlanets(prevUrl)
    }
})

function openModal() {
    const divPlanet = document.querySelector('.planet')
    const planetName = this.getAttribute('data-planet')
    divPlanet.innerHTML = `<h6>Residents of ${planetName}</h6>`
    let residents = this.getAttribute('data-residents').split(',')
    let tableModalData = document.querySelector('.modal_table_data')
    tableModalData.innerHTML = ""
    backdrop.classList.toggle('visible')
    modal.classList.toggle('visible')
    planetsTable.classList.toggle('visible')
    const accessResident = () => {
        residents.forEach(async resident => {
            let trModalData = document.createElement('tr')
            const residentDetails = await fetch(`${resident}`)
            const residentJson = await residentDetails.json()

            trModalData.innerHTML = `       <td>${residentJson.name}</td>
                                            <td>${residentJson.height}</td>
                                            <td>${residentJson.mass}</td>
                                            <td>${residentJson.hair_color}</td>
                                            <td>${residentJson.skin_color}</td>
                                            <td>${residentJson.eye_color}</td>
                                            <td>${residentJson.birth_year}</td>
                                            <td>${residentJson.gender}</td>`
            tableModalData.appendChild(trModalData)

        })
    }
    accessResident()
}

function voteModal() {
    const divPlanet = document.querySelector('.votes')
    const planetName = this.getAttribute('data-planet')
    const planetID = this.getAttribute('data-index')
    saveDoc(planetID, planetName)
    let tableModalDataVotes = document.querySelector('.modal_table_votes')
    tableModalDataVotes.innerHTML = ""
    backdrop.classList.toggle('visible')
    modal.classList.toggle('visible')
    votesTable.classList.toggle('visible')
    divPlanet.innerHTML = `<h6>Residents of ${planetName}</h6>`
}


function loadDoc(planetID, planetName) {
      let xhttp = new XMLHttpRequest();
      let tableModalDataVotes = document.querySelector('.modal_table_votes')
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
                const data = JSON.parse(xhttp.responseText)
                data.forEach(elem=>{
                    let trModalVotes = document.createElement('tr')
                    trModalVotes.innerHTML = `      
                                                    <td>${elem.planet}</td>
                                                    <td>${elem.count}</td>`
                    tableModalDataVotes.appendChild(trModalVotes)
                })
  }};

  xhttp.open("GET", "/vote/" + planetID + "/" + planetName, true);
  xhttp.send();
}


function saveDoc(planetID, planetName) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        loadDoc(planetID, planetName)
    }
    xhr.open("POST", "/vote/" + planetID + "/" + planetName, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(`id=${planetID}&name=${planetName}`);
}


getPlanets(variable)



