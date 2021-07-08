const apiUrl = "https://api.github.com/";
let injectionPoint, htmlBlock, langBar, langList, username;
let repos = []
let totalLines = 0;

if (document.querySelector('.p-nickname')) {
    username = document.querySelector('.p-nickname').innerText.replace(' ', '');
}

let addLanguageBars = languages => {
    return new Promise(resolve => {
        for (let i = 0; i < languages.length; i++) {
            if ((languages[i].lines / totalLines < 0.01) && (languages[i].language != 'Other')) {
                let index = getLanguageIndex("Other", languages)
                if (index) languages[index].lines += languages[i].lines;
                else languages.push({language: "Other", lines: languages[i].lines});
                languages.splice(languages.indexOf(languages[i]), 1);
                i--;
            }
        }
        languages.forEach((language, ind, arr) => {
            buildBar(language, totalLines, languages);
            if (ind === arr.length-1) resolve();
        });
    });
};

let buildLanguages = () => {
    return new Promise(resolve => {
        let languages = [];
        let visited = 0;
        for (let i in repos) {
            fetch(repos[i] + '/languages', {method: 'GET'})
            .then(response => {
                if (response.ok) return response.json();
            })
            .then(data => {
                for (let j in Object.keys(data)) {
                    let key = Object.keys(data)[j];
                    let value = Object.values(data)[j];
                    let index = getLanguageIndex(key, languages)
                    if (index) languages[index].lines += value;
                    else languages.push({language: key, lines: value});
                }
                visited++;
            });
        }
        let waitForVisited = setInterval(() => {
            if (visited === repos.length) {
                resolve(languages);
                clearInterval(waitForVisited);
                console.log("Cleared Interval");
            }
        }, 1)
    });
};

if (username) {
    injectionPoint = document.querySelector('main').children[1].children[0].children[1].children[1].children[0];
    let savedData = readData(username) || null;
    if (savedData) {
        console.log("Using Cookie");
        let languages = savedData;
        buildBlock(languages);
    }
    else {
        console.log("Fetching data");
        fetch(apiUrl + 'users/' + username + '/repos', {method: 'GET'})
        .then(response => {
            if (response.ok) return response.json();
        })
        .then(data => {
            if (data[0]) {
                new Promise((resolve, reject) => {
                    data.forEach((repo, ind, arr) => {
                        repos.push(repo.url);
                        if (ind === arr.length-1) resolve();
                    });
                })
                .then(() => {
                    buildLanguages().then(languages => {
                        languages.sort((a, b) => {return b.lines - a.lines});
                        saveData(username, languages);
                        buildBlock(languages);
                    });
                });
            }
        });
    }
}

function buildBar(language, totalLines, languages) {
    let color;
    if (languageColors[language.language]) color = languageColors[language.language].color;
    else color = '#cccccc';
    let percent = language.lines / totalLines;

    let div = document.createElement('div');
    div.classList.add('bar-language');
    div.style.backgroundColor = color;
    div.style.width = `calc(${(percent * 100)}% - (2px * ${languages.length-1} / ${languages.length}))`;
    langBar.appendChild(div);

    let li = document.createElement('li');
    li.classList.add('lang-item');

    let dot = document.createElement('div');
    dot.classList.add('lang-dot');
    dot.style.backgroundColor = color;
    li.appendChild(dot);

    let label = document.createElement('div');
    label.classList.add('lang-label');
    label.innerText = language.language;
    li.appendChild(label);

    let perc = document.createElement('div');
    perc.classList = 'lang-percent color-text-secondary';
    perc.innerText = (percent * 100).toFixed(1) + '%';
    li.appendChild(perc);

    langList.appendChild(li);
}

function buildBlock(languages) {
    languages.forEach(language => {totalLines += language.lines;});
    htmlBlock = document.createElement('div');
    htmlBlock.classList = 'mt-4 extension-block';
    htmlBlock.innerHTML += '<style>.extension-block *{box-sizing: border-box;padding: 0;margin: 0;}.lang-figure{padding:16px 16px 4px 16px; margin-right: 0; margin-left: 0;}.lang-list{list-style:none;display:flex;flex-wrap:wrap;width:100%}.lang-item{display:flex;align-items:center;margin-right:24px;margin-bottom:8px}.lang-dot{width:8px;height:8px;border-radius:50%;margin-right:8px}.lang-label{font-size:12px;font-weight:600;margin-right:4px}.lang-percent{font-size:12px;margin-right:4px;}.lang-bar{height:8px;width:100%;border-radius:6px;margin-bottom:8px;display:flex;justify-content:space-between}.bar-language{height:8px;min-width:2px}.bar-language:first-child{border-top-left-radius:8px;border-bottom-left-radius:8px}.bar-language:last-child{border-top-right-radius:8px;border-bottom-right-radius:8px;border-right:none}</style>';

    const sectionLabel = document.createElement('h2');
    sectionLabel.classList = 'f4 mb-2 text-normal';
    sectionLabel.innerText = 'Languages';
    htmlBlock.appendChild(sectionLabel);

    const figure = document.createElement('figure');
    figure.classList = 'lang-figure Box';

    langBar = document.createElement('div');
    langBar.classList = 'lang-bar';

    langList = document.createElement('ul');
    langList.classList = 'lang-list';

    addLanguageBars(languages).then(() => {
        figure.appendChild(langBar);
        figure.appendChild(langList);

        htmlBlock.appendChild(figure);
        injectionPoint.prepend(htmlBlock);
    });
}

function getLanguageIndex(key, arr) {
    for (let i in arr) if (arr[i].language === key) return i;
    return null;
}

function saveData(user, data) {
    let expire = new Date();
    expire.setTime(expire.getTime() + 3600000);
    document.cookie = `${user}_langs=${JSON.stringify(data)}; expires=${expire.toUTCString()}; path=/${user}`;
}

function readData(user) {
    let result = document.cookie.match(new RegExp(user + '_langs=([^;]+)'));
    if (result) return JSON.parse(result[1]);
    else return null;
}

function clearUserData(user) {
    document.cookie = `${user}_langs=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}