const { LINGUIST_COLORS } = require('../common/linguistColors');
const { defaults, theme } = require('./defaults/defaults');
const { renderfix, roundedRect, getTextWidth } = require('./utils/raphaelUtils');

const renderChart = (window, options) => {
    const WIDTH = options.width ? options.width < defaults.MIN_WIDTH ? defaults.MIN_WIDTH : options.width : defaults.WIDTH,
    THEME = theme[options.theme] ? options.theme : "default_light",
    BACKGROUND = options.background === 'true' ? theme[THEME].BACKGROUND : null,
    BORDER = options.border === 'false' ? false : true,
    TITLE = options.title === 'false' ? false : true,
    TITLE_TEXT = options.title_text || "Languages",
    FONT_FAMILY = defaults.FONT_FAMILY;
    TITLE_FONT_SIZE = defaults.FONT_SIZE,
    SUBTITLE_FONT_SIZE = defaults.FONT_SIZE * 0.75,
    PADDING_INCREMENT = defaults.PADDING_INCREMENT,
    SVG_PADDING = BACKGROUND ? 12 : 0,
    TEXT_COLOR_DEFAULT = theme[THEME].TEXT_DEFAULT,
    TEXT_COLOR_MUTED = theme[THEME].TEXT_MUTED,
    BORDER_COLOR_DEFAULT = theme[THEME].BORDER_DEFAULT,
    TITLE_HEIGHT = TITLE_FONT_SIZE * 1.5 + PADDING_INCREMENT,
    SUBTITLE_HEIGHT = SUBTITLE_FONT_SIZE * 1.5 + PADDING_INCREMENT,
    FIGURE_WIDTH = WIDTH - 2 - 2 * SVG_PADDING,
    FIGURE_PADDING = PADDING_INCREMENT * 2 - 1,
    BAR_WIDTH = FIGURE_WIDTH - (2 * FIGURE_PADDING),
    BAR_HEIGHT = 8,
    BAR_MARGIN = PADDING_INCREMENT,
    DOT_WIDTH = 8;

    let HEIGHT = defaults.HEIGHT + (2 * SVG_PADDING) - (TITLE ? 0 : TITLE_HEIGHT),
    FIGURE_HEIGHT = (2 * FIGURE_PADDING) + SUBTITLE_HEIGHT + 4;

    window.Raphael.prototype.renderfix = renderfix;
    window.Raphael.fn.roundedRect = roundedRect;

    const languages = window.languages;
    const totalBytes = window.languages.reduce((acc, language) => acc + language.bytes, 0);

    const svgElement = window.document.getElementById('svg');
    const paper = window.Raphael(svgElement, WIDTH, HEIGHT);

    let indentX, indentY;
    indentX = SVG_PADDING;
    indentY = SVG_PADDING;

    let background = paper
        .rect((BACKGROUND && BORDER) ? 1 : 0, (BACKGROUND && BORDER) ? 1 : 0, (BACKGROUND && BORDER) ? WIDTH - 2 : WIDTH, (BACKGROUND && BORDER) ? HEIGHT - 2 : HEIGHT, 6)
        .attr({ 'fill': BACKGROUND || 'none', 'stroke': (BACKGROUND && BORDER) ? BORDER_COLOR_DEFAULT : 'none' });

    if (TITLE) {
        paper
            .text(indentX, TITLE_FONT_SIZE + indentX, TITLE_TEXT)
            .attr({'text-anchor': 'start', 'font-size': TITLE_FONT_SIZE, 'font-family': FONT_FAMILY})
            .attr('fill', TEXT_COLOR_DEFAULT);

        indentY += TITLE_HEIGHT;
    }

    let figure = paper
        .rect(1 + indentX, indentY, FIGURE_WIDTH, FIGURE_HEIGHT, 6)
        .attr({'fill': 'none', 'stroke': BORDER_COLOR_DEFAULT, 'stroke-width': 1});

    indentX += FIGURE_PADDING;
    indentY += FIGURE_PADDING;

    languages.forEach((language, ind) => {
        const language_width = (BAR_WIDTH * language.bytes / totalBytes) - (languages.length - 1) * 2 / languages.length;
        const language_color = LINGUIST_COLORS[language.language] ? LINGUIST_COLORS[language.language].color : '#cccccc';
                        
        if (ind === 0) {
            paper
                .roundedRect(indentX, indentY, language_width, BAR_HEIGHT, BAR_HEIGHT / 2, 0, 0, BAR_HEIGHT / 2)
                .attr({'fill': language_color, 'stroke': 'none'});
        } else if (ind === languages.length-1) {
            paper
                .roundedRect(indentX, indentY, language_width, BAR_HEIGHT, 0, BAR_HEIGHT / 2, BAR_HEIGHT / 2, 0)
                .attr({'fill': language_color, 'stroke': 'none'});
        } else {
            paper
                .rect(indentX, indentY, language_width, BAR_HEIGHT)
                .attr({'fill': language_color, 'stroke': 'none'});
        }

        indentX += language_width + 2;
    });
                    
    indentX = FIGURE_PADDING + SVG_PADDING;
    indentY += BAR_HEIGHT + BAR_MARGIN;

    for (let i = 0; i < languages.length; i++) {
        const language_color = LINGUIST_COLORS[languages[i].language] ? LINGUIST_COLORS[languages[i].language].color : '#cccccc';
                        
        const dot = paper
            .rect(indentX, indentY + 5, DOT_WIDTH, DOT_WIDTH, DOT_WIDTH / 2)
            .attr({'fill': language_color, 'stroke': 'none'})
                        
        indentX += DOT_WIDTH + 8;
        let text;
                        
        const languageText = paper
            .text(indentX, indentY + 14, languages[i].language)
            .attr({'text-anchor': 'start', 'font-size': SUBTITLE_FONT_SIZE, 'font-family': FONT_FAMILY, 'font-weight': 600})
            .attr('fill', TEXT_COLOR_DEFAULT);
                 
        text = languages[i].language;
        indentX += getTextWidth(text, SUBTITLE_FONT_SIZE, true) + 6;
                        
        const languagePercent = paper
            .text(indentX, indentY + 14, (languages[i].bytes / totalBytes * 100).toFixed(1) + "%")
            .attr({'text-anchor': 'start', 'font-size': SUBTITLE_FONT_SIZE, 'font-family': FONT_FAMILY})
            .attr('fill', TEXT_COLOR_MUTED);
               
        text = (languages[i].bytes / totalBytes * 100).toFixed(1) + "%";
        indentX += getTextWidth(text, SUBTITLE_FONT_SIZE, false) + 24;

        if (indentX > FIGURE_WIDTH + SVG_PADDING) {
            dot.remove();
            languageText.remove();
            languagePercent.remove();
            background.remove();
            figure.remove();
            background.remove();
            indentX = FIGURE_PADDING + SVG_PADDING;
            indentY += SUBTITLE_HEIGHT;
            HEIGHT += SUBTITLE_HEIGHT;
            FIGURE_HEIGHT += SUBTITLE_HEIGHT;
            paper.setSize(WIDTH, HEIGHT);
            
            background = paper
                .rect((BACKGROUND && BORDER) ? 1 : 0, (BACKGROUND && BORDER) ? 1 : 0, (BACKGROUND && BORDER) ? WIDTH - 2 : WIDTH, (BACKGROUND && BORDER) ? HEIGHT - 2 : HEIGHT, 6)
                .attr({ 'fill': BACKGROUND || 'none', 'stroke': (BACKGROUND && BORDER) ? BORDER_COLOR_DEFAULT : 'none' })
                .toBack();
            figure = paper
                .rect(1 + SVG_PADDING, (TITLE ? TITLE_HEIGHT : 0) + SVG_PADDING, FIGURE_WIDTH, FIGURE_HEIGHT, 6)
                .attr({'fill': 'none', 'stroke': BORDER_COLOR_DEFAULT, 'stroke-width': 1});

            i--;
        }
    }

    return svgElement.innerHTML;
};

module.exports = { renderChart };