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
    const lastUser = await request(lastName);

    const firstUserGitHub = new UserGitHub(firstUser);
    const lastUserGitHub = new UserGitHub(lastUser);



}

async function request(user) {
    //const fetchData = await fetch(`https://api.github.com/users/${user}`);
    const fetchData = await fetch(`https://pokeapi.co/api/v2/pokemon/${user}`);

    if(fetchData.status != 200) { return { "mensagem": "Usuario não encontrado!" }}
    
    return await fetchData.json();
}