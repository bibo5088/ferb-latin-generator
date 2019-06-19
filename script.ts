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

    for (const char of str) {

        if (/(\s|[.,\/#!$%\^&\*;:{}=\-_`~()\[\]])/.test(char)) {

            if (currentType == WordType.Text) {

                currentType = WordType.Ignore;

                //Commit previous word
                if (currentValue.length > 0) {
                    words.push({type: WordType.Text, value: currentValue});
                    currentValue = "";
                }
            }

        } else {

            if (currentType == WordType.Ignore) {

                currentType = WordType.Text;

                //Commit previous word
                if (currentValue.length > 0) {
                    words.push({type: WordType.Ignore, value: currentValue});
                    currentValue = "";
                }
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

function convertToFerbLatin(str: string): string {
    let words = getWords(str);

    words = words.map(({type, value}) => {
        //Ignore newlines
        if (type == WordType.Text) {

            const firstLetter = value[0];
            value = `${value.substring(1)}${firstLetter}erb`

        }

        return {type, value};
    });

    return strFromWords(words);
}

(() => {

    const inputTextarea = document.getElementById("input") as HTMLTextAreaElement;
    const outputTextarea = document.getElementById("output") as HTMLTextAreaElement;

    const button = document.getElementById("button") as HTMLButtonElement;

    button.addEventListener("click", () => {
        outputTextarea.value = convertToFerbLatin(inputTextarea.value);
    });

})();