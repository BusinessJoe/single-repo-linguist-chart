require('dotenv').config()

const fs = require('fs');
const { JSDOM } = require('jsdom');
const axios = require('axios');
const { GITHUB_REQ_HEADER,  } = require('./common/config');
const { renderChart } = require('./renderers/linguistChartRenderer');

const template = fs.readFileSync('./template/index.html');
const { window } = new JSDOM(template, { resources: "usable", runScripts: "dangerously" });

const [nickname, repo] = process.argv[2].split('/');

const options = {
    background: 'false',
    title: 'false',
};

window.onload = () => {
    window.fetch = url => axios.get(url, GITHUB_REQ_HEADER);
    window.finish = err => {
        if (err) {
            console.error(err);
        } else {
            const svg = renderChart(window, options);
            console.log(svg);
        }
    }
    window.start(nickname, repo);
}
