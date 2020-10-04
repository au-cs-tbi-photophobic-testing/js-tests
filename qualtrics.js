class SurveyEngine {
    addOnload(callback) {
        window.onload = callback;
    }

    addOnReady(callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            document.attachEvent('onreadystatechanged', function() {
                if (document.readyState === 'complete') {
                    callback();
                }
            });
        }
    }

    addOnUnload(callback) {
        window.onunload = callback;
    }

    setEmbeddedData(key, value) {
        
    }
}

class Wrapper {
    constructor() {
        this.SurveyEngine = new SurveyEngine();
    }
}

const Qualtrics = new Wrapper();