const searchBtn = document.querySelector("#search-btn");
const inputSearch = document.querySelector("#search-txt");
const outputDiv = document.querySelector(".search-result-card");
const headerDiv = document.querySelector(".container-header");
const loadingDiv = document.querySelector(".loading")

const APIURL = 'https://api.github.com/users/';

function getURL(username){
    return APIURL + username;
}

function getRepoURL(username){
    return APIURL + username + "/repos";
}

function findUser(username){  
    fetch(getURL(username))
    .then(response=> {
        if(!response.ok){
            const responseError = {
                statusText: response.statusText,
                status: response.status
           };
            throw responseError;
        }
        return response.json()
    })
    .then(json => {
        loadingDiv.style.display = "none";
       outputDiv.innerHTML += renderProfileCard(json.avatar_url, json.login, json.followers, json.following)
    })
    .catch(errorHandler)
    ;
}

function errorHandler(error){
    
    if(error.status == 404){
        loadingDiv.style.display = "none";
        headerDiv.style.marginTop ="2rem";
        outputDiv.innerHTML = `<div class="error-div"> <img src="./assets/Octocat.png" class="error-img"> <div class="error-msg">Oops! User Not found :( </div></div>`; 
    }

    if(error.status == 403){
        loadingDiv.style.display = "none";
        headerDiv.style.marginTop ="2rem";
        outputDiv.innerHTML = `<div class="error-div"> <img src="./assets/Octocat.png" class="error-img"> <div class="error-msg">Oops! Rate Limit Exceeded! Try again later :( </div></div>`; 
    }

    console.log(error.status, error.statusText)
}

function getRepos(username){

    fetch(getRepoURL(username))
    .then(response=> {
        if(!response.ok){
            const responseError = {
                statusText: response.statusText,
                status: response.status
           };
            throw responseError;
        }
        return response.json()
    })
    .then(json => {
        
        loadingDiv.style.display = "none";
        headerDiv.style.marginTop = "2rem";
        if(json.length >= 2){
            json = shuffleArray(json)
            outputDiv.innerHTML += renderRepos(json)
        }
        
    })
    .catch(errorHandler)
    ;

}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

searchBtn.addEventListener("click", () => {

    outputDiv.innerHTML = "";
    loadingDiv.style.display = "block";
    findUser(inputSearch.value);
    getRepos(inputSearch.value)
    // headerDiv.style.marginTop = "2rem";
    // outputDiv.innerHTML = renderProfileCard() + renderRepos;
})



function renderProfileCard(profileImage, profileUsername, followerCount, followingCount){

    return ` <div class="profile-card">
                <img class="profile-image" src="${profileImage}" alt="">
                <div class="profile-username">${profileUsername}</div>
                <div class="profile-stats">
                    <img class="icon-stats" src="./assets/users.png" alt="">
                    <div class="follow-count"> ${followerCount} <span style="color: #6B7280"> followers </span> ${followingCount} <span style="color: #6B7280">following </span></div>  
                </div>
            </div>
            `;
}

function renderRepos(repoObj){

    return `<div class="repos-card">
                <h3>Some Repos</h3>
                <div class="repo-card">
                    <div class="repo-title">
                    <img src="./assets/repo.png" alt="" class="repo-icon">
                    <div class="repo-name">${repoObj[0].name}</div>
                    </div>
                    <div class="repo-date">
                        Created at ${repoObj[0].created_at}
                    </div>
                    <div class="repo-stats">
                        <img class="icon-stats" src="./assets/star.png" alt="">
                        <div class="star-count"> ${repoObj[0].stargazers_count} </div>
                        <img class="icon-stats" src="./assets/fork.png" alt="">
                        <div  class="fork-count">${repoObj[0].forks}</div>
                    </div>
                </div>

                <div class="repo-card">
                    <div class="repo-title">
                        <img src="./assets/repo.png" alt="" class="repo-icon">
                        <div class="repo-name">${repoObj[1].name}</div>
                    </div>
                    <div class="repo-date">
                        Created at ${repoObj[1].created_at}
                    </div>
                    <div class="repo-stats">
                        <img class="icon-stats" src="./assets/star.png" alt="">
                        <div class="star-count"> ${repoObj[1].stargazers_count} </div>
                        <img class="icon-stats" src="./assets/fork.png" alt="">
                        <div  class="fork-count">${repoObj[1].forks}</div>
                    </div>
            </div>
            `;
}