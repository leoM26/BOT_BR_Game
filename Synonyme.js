class Synonyme{
    
    static async get(mot){
        const fetch = require("node-fetch");
        const apiKey = "TMwj2Ivztj0mdVDzPiMzKTVXmfsEcg6Z";
        const requete = await fetch(`https://api.dicolink.com/v1/mot/${mot}/synonymes?limite=10&api_key=${apiKey}`);
        const response = await requete.json();
        return Synonyme.randomWord(response);
    }

    static randomWord(words){
        const index = Math.floor(Math.random() * words.length);
        console.log("L'index du mot est " + index)
        console.log(words[index].mot);
        return words[index].mot;
    }
}


module.exports = {Synonyme}