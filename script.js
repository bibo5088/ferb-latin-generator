var WordType;
(function (WordType) {
    WordType[WordType["Text"] = 0] = "Text";
    WordType[WordType["Ignore"] = 1] = "Ignore";
})(WordType || (WordType = {}));
function getWords(str) {
    var words = [];
    var currentValue = "";
    var currentType = WordType.Text;
    for (var _i = 0, str_1 = str; _i < str_1.length; _i++) {
        var char = str_1[_i];
        if (/(\s|[.,\/#!$%\^&\*;:{}=\-_`~()\[\]])/.test(char)) {
            if (currentType == WordType.Text) {
                currentType = WordType.Ignore;
                //Commit previous word
                if (currentValue.length > 0) {
                    words.push({ type: WordType.Text, value: currentValue });
                    currentValue = "";
                }
            }
        }
        else {
            if (currentType == WordType.Ignore) {
                currentType = WordType.Text;
                //Commit previous word
                if (currentValue.length > 0) {
                    words.push({ type: WordType.Ignore, value: currentValue });
                    currentValue = "";
                }
            }
        }
        currentValue += char;
    }
    //Add last word
    if (currentValue.length > 0) {
        words.push({ type: currentType, value: currentValue });
    }
    return words;
}
function strFromWords(words) {
    var result = "";
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];
        result += word.value;
    }
    return result;
}
function convertToFerbLatin(str) {
    var words = getWords(str);
    words = words.map(function (_a) {
        var type = _a.type, value = _a.value;
        //Ignore newlines
        if (type == WordType.Text) {
            var firstLetter = value[0];
            value = "" + value.substring(1) + firstLetter + "erb";
        }
        return { type: type, value: value };
    });
    return strFromWords(words);
}
(function () {
    var inputTextarea = document.getElementById("input");
    var outputTextarea = document.getElementById("output");
    var button = document.getElementById("button");
    button.addEventListener("click", function () {
        outputTextarea.value = convertToFerbLatin(inputTextarea.value);
    });
})();
