const getLanguageIndex = (language, languages) => {
    for (let i in languages) {
        if (languages[i].language === language) return i;
    }
}

const getTotalBytes = languages => {
    return languages.reduce((ac, language) => ac + language.bytes, 0)
};

const reduceLanguages = languageGroups => languageGroups.reduce((acc, languageGroup) => {
    const languages = [...acc];
    Object.keys(languageGroup).forEach(language => {
        const index = getLanguageIndex(language, languages);
        index ? languages[index].bytes += languageGroup[language] : languages.push({ language: language, bytes: languageGroup[language] });
    });
    return languages;
}, []);

const groupInfrequentLanguages = languages => {
    const totalBytes = getTotalBytes(languages);
    for (let i = 0; i < languages.length; i++) {
        if ((languages[i].bytes / totalBytes < 0.01) && (languages[i].language !== 'Other')) {
            const index = getLanguageIndex("Other", languages)
            index ? languages[index].bytes += languages[i].bytes : languages.push({language: "Other", bytes: languages[i].bytes});
            languages.splice(languages.indexOf(languages[i]), 1);
            i--;
        }
    }
    return languages.sort((a, b) => b.bytes - a.bytes);
}

const getLanguages = async repos => {
    let languages = [];

    await Promise.all(getRepoLanguagePromises(repos))
    .then(reduceLanguages)
    .then(groupInfrequentLanguages)
    .then(res => languages = res)
    .catch(e => {
        console.error(e);
    });

    saveCookie(getNickname(), languages);
    return languages;
}