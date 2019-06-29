class UserGitHub {
    constructor(userDetails) {
        this.login = userDetails.login;
        this.foto = userDetails.avatar_url;
        this.bio = userDetails.bio;
        this.publicRepository = userDetails.public_repos;
        this.publicgists = userDetails.public_gists;
        this.followers = userDetails.followers;
        this.following = userDetails.following;
    }
}

async function getApiGitHub(firstName, lastName) {
    const firstUser = await request(firstName);
    if(firstUser.status && firstUser.status == 401) {
        //return "Usuario não encontrado!";
    }

    const lastUser = await request(lastName);
    if(lastUser.status && lastUser.status == 401) {
        //return "Usuario não encontrado!";
    }

    const firstUserGitHub = new UserGitHub(firstUser);
    const lastUserGitHub = new UserGitHub(lastUser);
}

function count(u){
    return  (u.publicRepository * 20 +
                  u.followers * 10 +
                  u.followers * 5 +
                  u.publicgists);
}

async function request(user) {
    //const fetchData = await fetch(`https://api.github.com/users/${user}`);
    const fetchData = await fetch(`https://pokeapi.co/api/v2/pokemon/${user}`);

    if(fetchData.status != 200) { return { "status": 401, "mensagem": "Usuario não encontrado!" }}
    
    return await fetchData.json();
}