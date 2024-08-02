const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require('./american-to-british-titles.js');
const britishOnly = require('./british-only.js')

class Translator {

    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    americanToBritish(sentence){
        let translated = sentence;
        const americanOnlyKeys = Object.keys(americanOnly);
        const americanToBritishSpellingKeys = Object.keys(americanToBritishSpelling);
        const americanToBritishTitlesKeys = Object.keys(americanToBritishTitles);

        americanToBritishSpellingKeys.forEach(word=>{
            
            let escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let regex = new RegExp(`\\b${escapedWord}\\b`, 'i');
            while(translated.match(regex)){
                translated = translated.replace(regex, `<span class="highlight">${americanToBritishSpelling[word]}</span>`)
            }
        });

        americanOnlyKeys.forEach(word=>{
            let escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let regex = new RegExp(`\\b${escapedWord}\\b`, 'i');
            while(translated.match(regex)){
                translated = translated.replace(regex, `<span class="highlight">${americanOnly[word]}</span>`)
            }
        });

        americanToBritishTitlesKeys.forEach(word=>{
            let escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let regex = new RegExp(escapedWord, 'i');
            while(translated.match(regex)){
                translated = translated.replace(regex, `<span class="highlight">${americanToBritishTitles[word].charAt(0).toUpperCase() + americanToBritishTitles[word].slice(1)}</span>`)
            }
        });

        let regexTime = new RegExp(/(\b\d{1,2}):(\d{2}\b)/);
        while(translated.match(regexTime)){
            translated = translated.replace(regexTime, `<span class="highlight">${translated.match(regexTime)[0].split(':').join('.')}</span>`)
        }
        return translated
    }

    britishToAmerican(sentence){
        let translated = sentence;
        const britishOnlyKeys = Object.keys(britishOnly);
        const britishToAmericanSpellingKeys = Object.values(americanToBritishSpelling);
        const britishToAmericanTitleKeys = Object.values(americanToBritishTitles);

        britishToAmericanSpellingKeys.forEach(word=>{
            
            let escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let regex = new RegExp(`\\b${escapedWord}\\b`, 'i');
            while(translated.match(regex)){
                translated = translated.replace(regex, `<span class="highlight">${this.getKeyByValue(americanToBritishSpelling, word)}</span>`)
            }
        });

        britishOnlyKeys.forEach(word=>{
            let escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let regex = new RegExp(`\\b\(\?<!-\)${escapedWord}\\b`, 'i');
            while(translated.match(regex)){
                translated = translated.replace(regex, `<span class="highlight">${britishOnly[word]}</span>`)
            }
        });

        britishToAmericanTitleKeys.forEach(word=>{
            let escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let regex = new RegExp(`\\b${escapedWord}\(\?!\\.\)\\b`, 'i');
            while(translated.match(regex)){
                translated = translated.replace(regex, `<span class="highlight">${this.getKeyByValue(americanToBritishTitles, word).charAt(0).toUpperCase()+this.getKeyByValue(americanToBritishTitles, word).slice(1)}</span>`)
            }
        });

        let regexTime = new RegExp(/(\b\d{1,2})\.(\d{2}\b)/);
        while(translated.match(regexTime)){
            translated = translated.replace(regexTime, `<span class="highlight">${translated.match(regexTime)[0].split('.').join(':')}</span>`)
        
        }
        return translated
    }
}

module.exports = Translator;