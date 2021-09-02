const puppy = require("puppeteer"); 

const id = "hafacor406@0pppp.com";
const pass = "hafacor";

let browserPromise = puppy.launch({  // harr method ek promise return krega
    headless: false,  //-> to see browser
    defaultViewport: false,
});

let tab;

browserPromise.then(function(browser){
    let pagesPromise = browser.pages();  //-> get all open tab array of tabs
    return pagesPromise;
}).then(function(pages){
    tab = pages[0]; //-> access tab 1
    let pageOpenPromise = tab.goto("https://www.hackerrank.com/auth/login");
    return pageOpenPromise;
}).then(function(){
    let idPromise = tab.type("#input-1", id); 
    return idPromise;
}).then(function(){
    let passPromise = tab.type("#input-2", pass);
    return passPromise;
}).then(function(){
    let loginPromise = tab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
    return loginPromise;
}).then(function(){
    let waitPromise = tab.waitForSelector("#base-card-1-link", {visible: true}); // IP kit
    return waitPromise;
}).then(function(){
    let IPKclickPromise = tab.click("#base-card-1-link");
    return IPKclickPromise;
}).then(function(){
    let waitPromise = tab.waitForSelector("a[data-attr1='warmup']", {visible: true}); // Array
    return waitPromise;
}).then(function(){
    let arrayBoxClickPromise = tab.click("a[data-attr1='warmup']");
    return arrayBoxClickPromise;
}).then(function(){
    let waitPromise = tab.waitForSelector(".js-track-click.challenge-list-item", {visible: true});
    return waitPromise;
}).then(function(){ // get all ques link
    let allButtonsPromise = tab.$$('.js-track-click.challenge-list-item');  // $: find ele , $$: find elements
    return allButtonsPromise;
}).then(function(data){  
    let allButtonUrlsPromise = [];
    for(let i of data) { // get url
        let urlPromise = tab.evaluate(function(ele){
            return ele.getAttribute("href");
        },i);
        allButtonUrlsPromise.push(urlPromise);
    }
    return Promise.all(allButtonUrlsPromise);
}).then(function(data){
    let problemSolved = solveQuestion("https://www.hackerrank.com" + data[0]);
    for(let i = 1; i < data.length; i++) {
        problemSolved = problemSolved.then(function(){
            return solveQuestion("https://www.hackerrank.com" + data[i]);
        })
    }
}).catch(function(err){
    console.log("error occured");
});

function solveQuestion(url) {
    let problemUrl = url;
    let editorialUrl = url.replace("?","/editorial?");
    return new Promise(function(resolve,reject) {
        tab.goto(editorialUrl).then(function(){
            let answerLanguagePromise = tab.$$(".hackdown-content h3");
            return answerLanguagePromise;
        }).then(function(data) {
            let answerLanguages = [];
            for(let i of data) {
                let languagePromise = tab.evaluate(function(ele){
                    return ele.textContent;
                },i);
                answerLanguages.push(languagePromise);
            }
            return Promise.all(answerLanguages);
        }).then(function(data){
            for(let i in data) {
                if(data[i] == "C++") {
                    let finalAnswerPromise = tab.$$(".highlight").then(function(answers){
                        let answerPromise = tab.evaluate(function(ele){
                            return ele.textContent;
                        },answers[i]);
                        return answerPromise;
                    });
                    return finalAnswerPromise;
                }
            }
        }).then(function(data){
            // console.log(data);
            return tab.goto(problemUrl).then(function(){
                let checkboxWaitPromise = tab.waitForSelector(".checkbox-input", {visible: true});
                return checkboxWaitPromise;
            }).then(function(){
                let checkboxClickPromise = tab.click(".checkbox-input");
                return checkboxClickPromise;
            }).then(function(){
                let answerTypePromise = tab.type(".custominput",data);
                return answerTypePromise;
            }).then(function(){
                return tab.keyboard.down("Control").then(function(){
                    return tab.keyboard.press("A").then(function(){
                        return tab.keyboard.press("X");
                    });
                });
            }).then(function(){
                let editorClickPromise = tab.click(".monaco-scrollable-element.editor-scrollable.vs");
                return editorClickPromise;
            }).then(function(){
                return tab.keyboard.press("A").then(function(){
                    return tab.keyboard.press("V").then(function(){
                        return tab.keyboard.up("Control");
                    });
                });
            });
        }).then(function(){
            return tab.click(".ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled");
        }).then(function(){
            resolve();
        });
    })
}

// function solveQuestion(url) {
//     return new Promise(function(resolve, reject) {
//         tab.goto(url).then(function(){
//          resolve();
//         });
//     })
// }