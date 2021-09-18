const fetchRepos = nickname => {
    return fetch(`${config.URL}/users/${nickname}/repos`, {method: 'GET'}).then(res => res.ok && res.json());
}

const fetchRepoLanguages = url => {
    return fetch(`${url}/languages`, {method: 'GET'}).then(res => res.ok && res.json());
}

const getRepoURLs = repos => {
    return new Promise(resolve => {
        resolve(repos.map(repo => repo.url));
    });
}

const getRepoLanguagePromises = repoURLs => {
    return repoURLs.map(url => fetchRepoLanguages(url))
};