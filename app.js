const searchBtn = document.querySelector("#search-btn");
const inputSearch = document.querySelector("#search-txt");
const outputDiv = document.querySelector(".search-result-card");
const headerDiv = document.querySelector(".container-header");
const loadingDiv = document.querySelector(".loading")
const profileCardDiv = document.querySelector(".profile-card");
const reposCardDiv = document.querySelector(".repos-card");
const errorDiv = document.querySelector(".error")

const APIURL = 'https://api.github.com/users/';

let userFound = false;

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
        console.log(json)
        userFound = true;
        loadingDiv.style.display = "none";
       profileCardDiv.innerHTML = renderProfileCard(json.avatar_url, json.login, json.followers, json.following, json.html_url)
    })
    .catch(errorHandler)
    ;
}

function errorHandler(error){
    
    userFound = false;
    if(error.status == 404){
        loadingDiv.style.display = "none";
        headerDiv.style.marginTop ="2rem";
        errorDiv.innerHTML = `<div class="error-div"> <img src="./assets/Octocat.png" class="error-img"> <div class="error-msg">Oops! User Not found :( </div></div>`; 

    }

    if(error.status == 403){
        loadingDiv.style.display = "none";
        headerDiv.style.marginTop ="2rem";
        errorDiv.innerHTML = `<div class="error-div"> <img src="./assets/Octocat.png" class="error-img"> <div class="error-msg">Oops! Rate Limit Exceeded! Try again later :( </div></div>`; 
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
            reposCardDiv.innerHTML = renderRepos(json);
            window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
        }
        else if(json.length === 0 && userFound){
            reposCardDiv.innerHTML = `
            <div class="error-div no-repo-error-div"> <img src="./assets/Octocat.png" class="no-repo-error-img"> <div class="error-msg"> No Repos  :( </div></div>`
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

function clickHandler() {
    
    errorDiv.innerHTML = "";
    reposCardDiv.innerHTML = "";
    profileCardDiv.innerHTML = "";
    loadingDiv.style.display = "block";
    setTimeout(()=>{
        findUser(inputSearch.value);
        getRepos(inputSearch.value);
    }, 1500)
    
}

searchBtn.addEventListener("click", clickHandler)

inputSearch.addEventListener("keypress", (e) => {

    if(e.key === 'Enter'){
        clickHandler();
    }
});


function renderProfileCard(profileImage, profileUsername, followerCount, followingCount, htmlUrl){

    return ` 
                <a href="${htmlUrl}" target="_blank" style="text-decoration:none;">
                    <img class="profile-image" src="${profileImage}" alt="">
                </a>
                
                <a href="${htmlUrl}" target="_blank" style="text-decoration:none;">
                    <div class="profile-username">${profileUsername}</div>
                </a>
                <div class="profile-stats">
                    <img class="icon-stats" src="./assets/users.png" alt="">
                    <div class="follow-count"> ${followerCount} <span style="color: #6B7280"> followers </span> ${followingCount} <span style="color: #6B7280">following </span></div>  
                </div>
            
            `;
}

function renderRepos(repoObj){

    return `
                <h3>Some Repos</h3>
                <div class="repo-card">
                    <div class="repo-title">
                    <img src="./assets/repo.png" alt="" class="repo-icon">
                    <a style="text-decoration-none;" href= "${repoObj[0].html_url}"  target="_blank"> <div class="repo-name">${repoObj[0].name}</div></a>
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
                        <a style="text-decoration-none;" href= "${repoObj[1].html_url}" target="_blank"> <div class="repo-name">${repoObj[1].name}</div></a>
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
            
            `;
}