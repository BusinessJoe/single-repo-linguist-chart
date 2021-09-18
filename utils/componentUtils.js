const getTemplate = languages => `${config.STYLESHEET}
<h2 class="f4 mb-2 text-normal">Languages</h2>
<figure class="lang-figure Box">
    <div class="lang-bar">
        ${languages.reduce((ac, language) => {
            const color = config.LINGUIST_COLORS[language.language] ? config.LINGUIST_COLORS[language.language].color : '#cccccc';
            const percent = language.bytes / getTotalBytes(languages);
            return ac + `<div class="bar-language" style="background-color: ${color}; width: calc(${percent * 100}% - (2px * ${languages.length-1} / ${languages.length}));"></div>`
        }, "")}
    </div>
    <ul class="lang-list">
        ${languages.reduce((ac, language) => {
            const color = config.LINGUIST_COLORS[language.language] ? config.LINGUIST_COLORS[language.language].color : '#cccccc';
            const percent = language.bytes / getTotalBytes(languages);
            return ac + `<li class="lang-item">
                <div class="lang-dot" style="background-color: ${color};"></div>
                <div class="lang-label">${language.language}</div>
                <div class="lang-percent color-text-secondary">${(percent * 100).toFixed(1)}%</div>
            </li>`
        }, "")}
    </ul>
</figure>
`;

const getComponent = languages => {
    const component = document.createElement('div');
    component.classList = 'mt-4 extension-block';
    component.innerHTML = getTemplate(languages);
    return component;
}