const fs = require('fs');
const { JSDOM } = require('jsdom');
const axios = require('axios');
const { GITHUB_REQ_HEADER,  } = require('../common/config');
const { renderChart } = require('../renderers/linguistChartRenderer');

const getChart = (req, res) => {
    const nickname = req.params.nickname;
    const options = req.query;

    if (nickname === 'favicon.ico') {
        return res.status(404).send()
    };

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', `public, max-age=${7200}`);

    const template = fs.readFileSync('./template/index.html');
    const { window } = new JSDOM(template, { resources: "usable", runScripts: "dangerously" });

    window.onload = () => {
        window.fetch = url => axios.get(url, GITHUB_REQ_HEADER);
        window.finish = err => {
            if (err) {
                return res.status(503).send('Error generating chart');
            } else {
                return res.status(200).send(renderChart(window, options));
            }
        }
        window.start(nickname);
    }
}

module.exports = { getChart };