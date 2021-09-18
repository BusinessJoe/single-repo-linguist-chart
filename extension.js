class LinguistChart {
    constructor(nickname) {
        this.nickname = nickname;
    }

    init() {
        if (!this.nickname) return;

        const cookie = readCookie(this.nickname);

        if (cookie) {
            this.inject(getComponent(cookie))
        }
        else {
            fetchRepos(this.nickname)
                .then(getRepoURLs)
                .then(getLanguages)
                .then(getComponent)
                .then(this.inject)
                .catch(e => console.error(e));
        }
    }

    inject(component) {
        config.INJECTION_POINT.prepend(component)
    }
}

new LinguistChart(getNickname()).init();