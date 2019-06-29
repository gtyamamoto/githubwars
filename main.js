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
    if(firstUser.status && firstUser.status == 401) {
        //return "Usuario não encontrado";
    }

    const lastUser = await request(lastName);
    if(lastUser.status && lastUser.status == 401)

    const firstUserGitHub = new UserGitHub(firstUser);
    const lastUserGitHub = new UserGitHub(lastUser);
    return {
        firstUserGitHub,
        lastUserGitHub
    }
}
async function getStartsFromUser(firstName,lastName){
    const requestStarsFirst = await request(firstName);
    const requestStarsSecond = await request(lastName);
    const starGazerOne = requestStarsFirst.reduce((prev,curr)=>prev.stargazers_count+curr.stargazers_count,0)
    const starGazerTwo = requestStarsSecond.reduce((prev,curr)=>prev.stargazers_count+curr.stargazers_count,0)
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



//DOM's 
const btnStart = document.querySelector('#btn-startfight')
const inputFirst = document.querySelector('#playerone-input')
const inputLast = document.querySelector('#playertwo-input')


btnStart.addEventListener('click',async (e)=>{
   const {firstUserGitHub,lastUserGitHub} = await getApiGitHub(inputFirst.value,inputLast.value);
   const { starGazerOne,
    starGazerTwo} = await getStartsFromUser(inputFirst.value,inputLast.value);
    firstUserGitHub.setStarts(starGazerOne)
    lastUserGitHub.setStarts(starGazerTwo)
    
})