
let planetsTBody = document.querySelector('.planets')
let nextBtn = document.getElementById('next')
let previousBtn =document.getElementById('previous')
const variable = 'https://swapi.dev/api/planets/?page=1'
const modal = document.querySelector('#show-modal')
const backdrop = document.getElementById('backdrop')
const closeModalBtn = document.querySelector('.modal__actions')

closeModalBtn.addEventListener('click', ()=>{
        backdrop.classList.toggle('visible')
        modal.classList.toggle('visible')})



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
            // residents.setAttribute('data-index', `${i+1+(count-1)*10}`)
            residents.setAttribute('data-residents', `${resultData[i].residents}`)
            residents.setAttribute('data-planet', `${resultData[i].name}`)
            residents.addEventListener('click', openModal)
            }
        list[i].appendChild(residents)
        let vote = document.createElement('td')
        vote.innerHTML = `<td><button class="btn btn-light">${'votele lu peste'}</button></td>`
        list[i].appendChild(vote)
    }

    //
    // let oare = document.querySelectorAll('.butonuCuResideti')
    // if (oare.length !== 0) {console.log('merge oare')}
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
                console.log(trModalData)
            })
        }

        accessResident()

        // var z = document.createElement('p'); // is a node
        // z.innerHTML = 'test satu dua tiga';
        // document.body.appendChild(z);

        // for (resident of residents) {
        //     console.log(residents)
        //     console.log(resident.name)
        //     async (resident)=> {
        //         let dataR= await fetch(`${resident}`)
        //         let residentData = await dataR.json()
        //         console.log(residentData)
        //     }

//             const forEachLoop = _ => {
//               console.log('Start')
//
//               fruitsToGet.forEach(async fruit => {
//                 const numFruit = await getNumFruit(fruit)
//                 console.log(numFruit)
//               })
//
//               console.log('End')
// }

            // modal.innerHTML += resident
            // console.log(resident)
            // let residentElement = document.createElement('td')
            // residentElement.innerHTML = `<td>${resident}</td>`
            // modal.appendChild('residentElement')
}
        // modal.innerHTML = residents
        // console.log(`buton ${residentsButtonIndex}`)
        // this.residenceButtons[residenceButtonIndex].addEventListener('click', ()=> {console.log('ai apasat butonul' `${residenceButtons[residenceButtonIndex]}`)})
        // console.log(residenceButtons[residenceButtonIndex])
        // // backdrop.classList.toggle('visible')
        // // modal.classList.toggle('visible')




getPlanets(variable)



// const variablePeople = 'https://swapi.dev/api/people/'
// async function getPeople(peopleEndpoint){
//     let dataPeople = await fetch(`${peopleEndpoint}`)
//     let jsonDataPeople = await dataPeople.json()
//     let resultDataPeople = jsonDataPeople.results
//     console.log(jsonDataPeople)
// }
//
// getPeople((variablePeople))
//
// function residences(number) {
//                 if (number === 3) {
//                     tdElementResidents.innerHTML = `<td class="btn-residents"><button>${number}</button></td>`
//                     planetsTr.appendChild(tdElementResidents)
//                 } else {
//                     tdElementResidents.innerHTML = `<td><button>No residance</button></td>`
//                     planetsTr.appendChild(tdElementResidents)
//                 }
//             }
//             residences(3)