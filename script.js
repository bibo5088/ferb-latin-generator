var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var WordType;
(function (WordType) {
    WordType[WordType["Text"] = 0] = "Text";
    WordType[WordType["Ignore"] = 1] = "Ignore";
})(WordType || (WordType = {}));
function getWords(str) {
    var e_1, _a;
    var words = [];
    var currentValue = "";
    var currentType = WordType.Text;
    var changeType = function () {
        currentType = currentType == WordType.Text ? WordType.Ignore : WordType.Text;
    };
    var pushWord = function (type) {
        if (currentValue.length > 0) {
            words.push({ type: type, value: currentValue });
            currentValue = "";
        }
    };
    try {
        for (var str_1 = __values(str), str_1_1 = str_1.next(); !str_1_1.done; str_1_1 = str_1.next()) {
            var char = str_1_1.value;
            if (/(\s|[.,\/#!$%\^&\*;:{}=\-_`~()\[\]])/.test(char)) {
                if (currentType == WordType.Text) {
                    changeType();
                    pushWord(WordType.Text);
                }
            }
            else {
                // @ts-ignore
                if (currentType == WordType.Ignore) {
                    changeType();
                    pushWord(WordType.Ignore);
                }
            }
            currentValue += char;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (str_1_1 && !str_1_1.done && (_a = str_1.return)) _a.call(str_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    //Add last word
    if (currentValue.length > 0) {
        words.push({ type: currentType, value: currentValue });
    }
    return words;
}
function strFromWords(words) {
    var e_2, _a;
    var result = "";
    try {
        for (var words_1 = __values(words), words_1_1 = words_1.next(); !words_1_1.done; words_1_1 = words_1.next()) {
            var word = words_1_1.value;
            result += word.value;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (words_1_1 && !words_1_1.done && (_a = words_1.return)) _a.call(words_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return result;
}
function isValidFerbLatin(str) {
    return str.length >= 4 && str.endsWith("erb");
}
function convertToFerbLatin(str) {
    var words = getWords(str);
    words = words.map(function (_a) {
        var type = _a.type, value = _a.value;
        if (type == WordType.Text) {
            var firstLetter = value[0];
            value = "" + value.substring(1) + firstLetter + "erb";
        }
        return { type: type, value: value };
    });
    return strFromWords(words);
}
function convertToNormal(str) {
    var words = getWords(str);
    words = words.map(function (_a) {
        var type = _a.type, value = _a.value;
        if (type == WordType.Text && isValidFerbLatin(value)) {
            //Remove erb
            value = value.substring(0, value.length - 3);
            var lastLetter = value[value.length - 1];
            value = "" + lastLetter + value.substring(0, value.length - 1);
        }
        return { type: type, value: value };
    });
    return strFromWords(words);
}
(function () {
    var normalTextarea = document.getElementById("normal");
    var ferbTextarea = document.getElementById("ferb");
    var nfButton = document.getElementById("nf-button");
    nfButton.addEventListener("click", function () {
        ferbTextarea.value = convertToFerbLatin(normalTextarea.value);
    });
    var fnButton = document.getElementById("fn-button");
    fnButton.addEventListener("click", function () {
        normalTextarea.value = convertToNormal(ferbTextarea.value);
    });
})();
