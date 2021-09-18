const defaults = {
    WIDTH: 904,
    HEIGHT: 93,
    FONT_FAMILY: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
    FONT_SIZE: 16,
    PADDING_INCREMENT: 8,
    MIN_WIDTH: 400
}

const theme = {
    default_light: {
        TEXT_DEFAULT: '#24292f',
        TEXT_MUTED: '#57606a',
        BORDER_DEFAULT: '#d0d7de',
        BACKGROUND: '#ffffff'
    },
    default_dark: {
        TEXT_DEFAULT: '#c9d1d9',
        TEXT_MUTED: '#8b949e',
        BORDER_DEFAULT: '#30363d',
        BACKGROUND: '#0d1117'
    },
    dark_dimmed: {
        TEXT_DEFAULT: '#adbac7',
        TEXT_MUTED: '#768390',
        BORDER_DEFAULT: '#444c56',
        BACKGROUND: '#22272e'
    },
    dark_high_contrast: {
        TEXT_DEFAULT: '#f0f3f6',
        TEXT_MUTED: '#f0f3f6',
        BORDER_DEFAULT: '#7a828e',
        BACKGROUND: '#0a0c10'
    },
    universal: {
        TEXT_DEFAULT: '#79848f',
        TEXT_MUTED: '#79848f',
        BORDER_DEFAULT: '#79848f',
        BACKGROUND: 'none'
    }
}

module.exports = { defaults, theme };