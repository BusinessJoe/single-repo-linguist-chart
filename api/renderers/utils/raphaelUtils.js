const { CHAR_MAP } = require("../../common/charMap");

const renderfix = ()=>{};

const roundedRect = function (x, y, w, h, r1, r2, r3, r4){
    let array = [];
    array = array.concat(["M",x+r1,y]);
    array = array.concat(['l',w-r1-r2,0]);
    array = array.concat(["q",r2,0, r2,r2]);
    array = array.concat(['l',0,h-r3-r2]);
    array = array.concat(["q",0,r3, -r3,r3]);
    array = array.concat(['l',-w+r4+r3,0]);
    array = array.concat(["q",-r4,0, -r4,-r4]);
    array = array.concat(['l',0,-h+r4+r1]);
    array = array.concat(["q",0,-r1, r1,-r1]);
    array = array.concat(["z"]);
    return this.path(array);
};

const textWidthReducer = (acc, char) => acc + CHAR_MAP[char];
const boldTextWidthReducer = (acc, char) => acc + CHAR_MAP[char + '*'];

const getTextWidth = (text, fontSize, bold) => {
    return text.split("").reduce(bold ? boldTextWidthReducer : textWidthReducer, 0) * fontSize / 16;
}

module.exports = { renderfix, roundedRect, getTextWidth };