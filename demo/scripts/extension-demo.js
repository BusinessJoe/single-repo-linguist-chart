let username = "mhollingshead";
const apiUrl = "https://api.github.com/";

let injectionPoint, htmlBlock, langBar, langList;
injectionPoint = document.querySelector('.wrapper');

let repos = []
let languages = [
    {language: "JavaScript", lines: 494}, 
    {language: "HTML", lines: 320}, 
    {language: "CSS", lines: 114}, 
    {language: "Python", lines: 43}, 
    {language: "C++", lines: 17}, 
    {language: "SCSS", lines: 12}, 
];

let addLanguageBars = () => {
    return new Promise((resolve, reject) => {
        let totalLines = 0;
        for (let i in languages) totalLines += languages[i].lines;
        for (let i = 0; i < languages.length; i++) {
            if (languages[i].lines / totalLines < 0.01) {
                if (languages[i].language != 'Other') {
                    updateLanguage("Other", languages[i].lines);
                    languages.splice(languages.indexOf(languages[i]), 1);
                    i = 0;
                }
            }
        }
        languages.forEach((language, ind, arr) => {
            buildBar(language, totalLines);
            if (ind === arr.length-1) resolve();
        });
    });
};

let buildLanguages = () => {
    new Promise((resolve, reject) => {
        repos.forEach((repo, ind, arr) => {
            fetch(repo + '/languages', {method: 'GET'})
            .then(response => {
                if (response.ok) return response.json();
            }).then(data => {
                if (data.ok) reject();
                for (let i in Object.keys(data)) {
                    updateLanguage(Object.keys(data)[i], Object.values(data)[i]);
                }
                if (ind === arr.length-1) resolve();
            });
        });
    }).then(() => {
        languages.sort((a, b) => {return b.lines - a.lines});
        saveData(username, languages);
        buildBlock();
    });
};

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    username = e.target.user.value;
    clearFigure();
    clearArrays();
    e.target.reset();
    if (username) {
        let savedData = readData(username) || null;
        if (savedData) {
            console.log("Using Cookie");
            languages = savedData;
            document.querySelector('.user__avatar').src = readData(username+"_avi");
            document.querySelector('.user__name').innerText = readData(username+"_name");
            buildBlock();
        }
        else {
            console.log("Fetching Data");
            fetch(apiUrl + 'users/' + username + '/repos', {method: 'GET'})
            .then(response => {
                if (response.ok) return response.json();
            }).then(data => {
                if (data[0]) {
                    document.querySelector('.user__avatar').src = data[0].owner.avatar_url;
                    saveData(username+"_avi", data[0].owner.avatar_url);
                    document.querySelector('.user__name').innerText = data[0].owner.login;
                    saveData(username+"_name", data[0].owner.login);
                    new Promise((resolve, reject) => {
                        data.forEach((repo, ind, arr) => {
                            repos.push(repo.url);
                            if (ind === arr.length-1) resolve();
                        });
                    }).then(() => {
                        buildLanguages();
                    });
                }
            });
        }
    }
});

function updateLanguage(key, value) {
    if (getLanguageIndex(key)) languages[getLanguageIndex(key)].lines += value;
    else languages.push({language: key, lines: value})
}

function getLanguageIndex(key) {
    for (let i in languages) if (languages[i].language === key) return i;
    return null;
}

function buildBar(language, totalLines) {
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
    perc.classList.add('lang-percent');
    perc.innerText = (percent * 100).toFixed(1) + '%';
    li.appendChild(perc);

    langList.appendChild(li);
}

function buildBlock() {
    htmlBlock = document.createElement('div');
    htmlBlock.classList = 'mt-4 extension-block';
    htmlBlock.innerHTML += '<style>.extension-block *{box-sizing: border-box;padding: 0;margin: 0;color:#24292e;}.lang-figure{border:1px solid #e1e4e8;border-radius:6px;padding:16px 16px 4px 16px; margin-right: 0; margin-left: 0;}.lang-list{list-style:none;display:flex;flex-wrap:wrap;width:100%}.lang-item{display:flex;align-items:center;margin-right:24px;margin-bottom:8px}.lang-dot{width:8px;height:8px;border-radius:50%;margin-right:8px}.lang-label{font-size:12px;font-weight:600;margin-right:4px}.lang-percent{font-size:12px;margin-right:4px;color:#586069}.lang-bar{height:8px;width:100%;border-radius:6px;margin-bottom:8px;display:flex}.bar-language{height:8px;}.bar-language:first-child{border-top-left-radius:8px;border-bottom-left-radius:8px}.bar-language:last-child{border-top-right-radius:8px;border-bottom-right-radius:8px;border-right:none}</style>';

    const sectionLabel = document.createElement('h2');
    sectionLabel.classList = 'f4 mb-2 text-normal';
    sectionLabel.innerText = 'Languages';
    htmlBlock.appendChild(sectionLabel);

    const figure = document.createElement('figure');
    figure.classList = 'lang-figure';

    langBar = document.createElement('div');
    langBar.classList = 'lang-bar';

    langList = document.createElement('ul');
    langList.classList = 'lang-list';

    addLanguageBars().then(() => {
        figure.appendChild(langBar);
        figure.appendChild(langList);

        htmlBlock.appendChild(figure);
        injectionPoint.prepend(htmlBlock);
    });
}

function clearFigure() {
    document.querySelector('.wrapper').innerHTML = "";
}

function clearArrays() {
    repos = [];
    languages = [];
}

function saveData(user, data) {
    let expire = new Date();
    expire.setTime(expire.getTime() + 3600000);
    document.cookie = `${user}_langs=${JSON.stringify(data)}; expires=${expire.toUTCString()};`;
}

function readData(user) {
    let result = document.cookie.match(new RegExp(user + '_langs=([^;]+)'));
    if (result) return JSON.parse(result[1]);
    else return null;
}

function clearUserData(user) {
    document.cookie = `${user}_langs=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

function init() {
    languages.sort((a, b) => {return b.lines - a.lines});
    buildBlock();
}

init();