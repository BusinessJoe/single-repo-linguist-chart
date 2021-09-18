require('dotenv').config()

const GITHUB_REQ_HEADER = {
    'headers': {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
    }
};

module.exports = { GITHUB_REQ_HEADER };