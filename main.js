class UserGitHub {
    constructor(userDetails) {
        this.login = userDetails.login;
        this.foto = userDetails.avatar_url;
        this.bio = userDetails.bio;
        this.publicRepository = userDetails.public_repos;
        this.publicgists = userDetails.public_gists;
        this.followers = userDetails.followers;
        this.following = userDetails.following;
        this.stars = 0;
    }
    setStarts(stars){
        this.stars = stars;
    }
}

async function getApiGitHub(firstName, lastName) {
    const firstUser = await request(firstName);
    if( firstUser.status == 401) {
        return {firstUserGitHub:null,lastUserGitHub:null};
    }

    const lastUser = await request(lastName);
    if( firstUser.status == 401) {
        return {firstUserGitHub:null,lastUserGitHub:null};
    }

    const firstUserGitHub = new UserGitHub(firstUser);
    const lastUserGitHub = new UserGitHub(lastUser);
    return {
        firstUserGitHub,
        lastUserGitHub
    }
}
async function getStartsFromUser(firstName,lastName){
    const requestStarsFirst = await request(firstName,false);
    const requestStarsSecond = await request(lastName,false);
    console.log(requestStarsFirst,requestStarsSecond)
    const starGazerOne = requestStarsFirst.reduce((prev,curr)=>prev.stargazers_count+!curr.stargazers_count ? 0 : curr.stargazers_count,0)
    const starGazerTwo = requestStarsSecond.reduce((prev,curr)=>prev.stargazers_count+!curr.stargazers_count ? 0 : curr.stargazers_count,0)
    console.log(starGazerOne,requestStarsSecond)
    return {
        starGazerOne,
        starGazerTwo
    }
}
async function request(user,onlyUser=true) {
    const fetchData = await fetch(`${onlyUser? `https://api.github.com/users/${user}` : `https://api.github.com/users/${user}/repos`}`);
    //const fetchData = await fetch(`https://pokeapi.co/api/v2/pokemon/${user}`);

    if(fetchData.status != 200) { return { "status": 401, "mensagem": "Usuario não encontrado!" }}
    
    return await fetchData.json();
}

function count(u){
    return  (u.publicRepository * 20 +
                  u.followers * 10 +
                  u.following * 5 +
                  u.stars * 10 +
                  u.publicgists * 5);
}


//DOM's 
const btnStart = document.querySelector('#btn-startfight')
const inputFirst = document.querySelector('#playerone-input')
const inputLast = document.querySelector('#playertwo-input')
const totalFirst = document.querySelector('#total-playerone')
const totalLast = document.querySelector('#total-playertwo')
const imgFirst = document.querySelector('#playerone-img')
const imgLast = document.querySelector('#playertwo-img')
const  listPointFirst = document.querySelector('#player-one-table')
const  listPointLast = document.querySelector('#player-two-table')
function clearUser(number) {
    if(number===1){
        inputFirst.textContent=''
        totalFirst.textContent=''
        imgFirst.setAttribute('src','')
        
        listPointFirst.innerHTML=''
        document.querySelector('.img-wins-one').style.display='none'

    }else{
        inputLast.textContent=''
        totalLast.textContent=''
        imgLast.setAttribute('src','')
        listPointLast.innerHTML=''
        document.querySelector('.img-wins-two').style.display='none'

    }
}   
function createListPoints (firstUser,element){
     let stringHTML = ''
     stringHTML+=`<tr><td>Rep Publico</td>
     <td>${firstUser.publicRepository}</td>
     <td>${firstUser.publicRepository*20}</td>
     </tr>
     <tr><td>Followers</td>
     <td>${firstUser.followers}</td>
     <td>${firstUser.followers*10}</td>
     </tr>
     <tr><td>Seguindo</td>
     <td>${firstUser.following}</td>
     <td>${firstUser.following*5}</td>
     </tr>
     <tr><td>Estrelas</td>
     <td>${firstUser.stars}</td>
     <td>${firstUser.stars*10}</td>
     </tr>
     <tr><td>Gists</td>
     <td>${firstUser.publicgists}</td>
     <td>${firstUser.publicgists*5}</td>
     </tr>
     
     
     `
    element.innerHTML = stringHTML
}

btnStart.addEventListener('click',async (e)=>{
   const {firstUserGitHub,lastUserGitHub} = await getApiGitHub(inputFirst.value,inputLast.value);
   console.log(firstUserGitHub,lastUserGitHub)
   clearUser('one')
   clearUser('two')
    if(firstUserGitHub==null||lastUserGitHub==null){
        if(!firstUserGitHub) {clearUser('one')
        document.querySelector('.not-found-profile-one').style.display='block'
    
    }
        if(!lastUserGitHub) {
            
            clearUser('two')
            document.querySelector('.not-found-profile-two').style.display='block'
        }
    }
   const { starGazerOne,
    starGazerTwo} = await getStartsFromUser(inputFirst.value,inputLast.value);
    firstUserGitHub.setStarts(starGazerOne)
    lastUserGitHub.setStarts(starGazerTwo)
    createListPoints(firstUserGitHub,listPointFirst)
    createListPoints(lastUserGitHub,listPointLast)
    const countFirst = count(firstUserGitHub)
    const countSecond = count(lastUserGitHub)
    console.log(countFirst,countSecond)
    totalFirst.textContent = countFirst
    totalLast.textContent = countSecond
    imgFirst.setAttribute('src',firstUserGitHub.foto)
    imgLast.setAttribute('src',lastUserGitHub.foto)
    document.querySelector('.not-found-profile-one').style.display='none'
    document.querySelector('.not-found-profile-two').style.display='none'
    if(countFirst>=countSecond){

        document.querySelector('.img-wins-one').style.display='block'
    }
    else{
        document.querySelector('.img-wins-two').style.display='block'

    }
})