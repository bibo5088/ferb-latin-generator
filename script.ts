enum WordType {
    Text,
    Ignore
}

interface Word {
    type: WordType;
    value: string;
}

function getWords(str: string): Word[] {
    const words: Word[] = [];

    let currentValue: string = "";
    let currentType: WordType = WordType.Text;

    const changeType = () => {
        currentType = currentType == WordType.Text ? WordType.Ignore : WordType.Text;
    };
    const pushWord = (type: WordType) => {
        if (currentValue.length > 0) {
            words.push({type: type, value: currentValue});
            currentValue = "";
        }
    };


    for (const char of str) {

        if (/(\s|[.,\/#!$%\^&\*;:{}=\-_`~()\[\]])/.test(char)) {

            if (currentType == WordType.Text) {

                changeType();
                pushWord(WordType.Text);
            }

        } else {

            // @ts-ignore
            if (currentType == WordType.Ignore) {

                changeType();
                pushWord(WordType.Ignore);
            }

        }

        currentValue += char;

    }

    //Add last word
    if (currentValue.length > 0) {
        words.push({type: currentType, value: currentValue});
    }

    return words;
}

function strFromWords(words: Word[]): string {

    let result: string = "";

    for (const word of words) {
        result += word.value;
    }

    return result;
}

function isValidFerbLatin(str: string): boolean {
    return str.length >= 4 && str.endsWith("erb");
}

function convertToFerbLatin(str: string): string {
    let words = getWords(str);

    words = words.map(({type, value}) => {

        if (type == WordType.Text) {

            const firstLetter = value[0];
            value = `${value.substring(1)}${firstLetter}erb`;

        }

        return {type, value};
    });

    return strFromWords(words);
}

function convertToNormal(str: string): string {
    let words = getWords(str);

    words = words.map(({type, value}) => {

        if (type == WordType.Text && isValidFerbLatin(value)) {

            //Remove erb
            value = value.substring(0, value.length - 3);

            const lastLetter = value[value.length - 1];
            value = `${lastLetter}${value.substring(0, value.length - 1)}`;

        }

        return {type, value};
    });

    return strFromWords(words);
}

(() => {

    const normalTextarea = document.getElementById("normal") as HTMLTextAreaElement;
    const ferbTextarea = document.getElementById("ferb") as HTMLTextAreaElement;

    const nfButton = document.getElementById("nf-button") as HTMLButtonElement;

    nfButton.addEventListener("click", () => {
        ferbTextarea.value = convertToFerbLatin(normalTextarea.value);
    });

    const fnButton = document.getElementById("fn-button") as HTMLButtonElement;

    fnButton.addEventListener("click", () => {
        normalTextarea.value = convertToNormal(ferbTextarea.value);
    });

})();