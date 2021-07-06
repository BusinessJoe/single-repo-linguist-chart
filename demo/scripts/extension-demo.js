let username = "mhollingshead";
const apiUrl = "https://api.github.com/";

let injectionPoint, htmlBlock, langBar, langList;
injectionPoint = document.querySelector('.wrapper');

let repos = []
let languages = [
    {language: "HTML", lines: 354799}, 
    {language: "JavaScript", lines: 286931}, 
    {language: "CSS", lines: 73608}, 
    {language: "Python", lines: 30036}, 
    {language: "C++", lines: 11916}, 
];

let addLanguageBars = () => {
    return new Promise((resolve, reject) => {
        let totalLines = 0;
        languages.forEach(language => {totalLines += language.lines});
        languages.forEach((language, ind, arr) => {
            buildBar(language, totalLines);
            if (ind === arr.length-1) resolve();
        });
    });
};

let buildLanguages = () => {
    new Promise((resolve, reject) => {
        repos.forEach((repo, ind, arr) => {
            fetch(repo + '/languages', {method: 'GET'}).then(response => response.json()).then(data => {
                for (let i in Object.keys(data)) {
                    updateLanguage(Object.keys(data)[i], Object.values(data)[i]);
                }
                if (ind === arr.length-1) resolve();
            });
        });
    }).then(() => {
        languages.sort((a, b) => {return b.lines - a.lines});
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
        
        fetch(apiUrl + 'users/' + username + '/repos', {method: 'GET'}).then(response => response.json()).then(data => {
            if (data[0]) {
                document.querySelector('.user__avatar').src = data[0].owner.avatar_url;
                document.querySelector('.user__name').innerText = data[0].owner.login;
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
    else color = '#f2f2f2';
    let percent = language.lines / totalLines;

    let div = document.createElement('div');
    div.classList.add('bar-language');
    div.style.backgroundColor = color;
    div.style.width = (percent * 100) + '%';
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
    htmlBlock.innerHTML += '<style>.extension-block *{box-sizing: border-box;padding: 0;margin: 0;color:#24292e;}.lang-figure{border:1px solid #e1e4e8;border-radius:6px;padding:16px 16px 4px 16px; margin-right: 0; margin-left: 0;}.lang-list{list-style:none;display:flex;flex-wrap:wrap;width:100%}.lang-item{display:flex;align-items:center;margin-right:24px;margin-bottom:8px}.lang-dot{width:8px;height:8px;border-radius:50%;margin-right:8px}.lang-label{font-size:12px;font-weight:600;margin-right:4px}.lang-percent{font-size:12px;margin-right:4px;color:#586069}.lang-bar{height:8px;width:100%;border-radius:6px;margin-bottom:8px;display:flex}.bar-language{height:8px;border-right:2px solid #fff;min-width:2px}.bar-language:first-child{border-top-left-radius:8px;border-bottom-left-radius:8px}.bar-language:last-child{border-top-right-radius:8px;border-bottom-right-radius:8px;border-right:none}</style>';

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

function init() {
    languages.sort((a, b) => {return b.lines - a.lines});
    buildBlock();
}

init();