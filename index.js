const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const {Role} =  require('./Role.js');
const {Member} = require('./Member.js');
const {Synonyme} = require('./Synonyme.js');
const udcmembre = [];
let answers = 0;
let reactionsCount = 0;
const udcrole = [new Role("Civil"),new Role('Undercover')];
const dico = ["téléphone","fruit","legume","scooter","histoire","drogue","verre","couleurs","pays","Divorce","Vagabond","Cahier","Pur","animeaux","bougnoul","wesh","tattoo","dermographe","oiseaux","warzone","bite","gargouille","Lampe","Bouteille","séries","voiture","satellite","chaise","Etoiles","planète","système","jeux","sexe","chatte","cigarette","Profil","Collision","Kamikaze"];
let indexJoueur = null;
let channel = null;

function addmembre(msg) {

    if (udcmembre.length <= 6) {
        udcmembre.push(new Member(msg.author.id, msg.author.username));
        msg.channel.send(`${msg.author} veut jouer à l'undercover ${udcmembre.length}/6.`);
        msg.delete();
    }else {
        msg.channel.send("Il n'y a plus de place :(");
    }
  }


  client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);
    client.user.setPresence({
        activity: {
            name: "Undercover"
        }
    })

});

client.on('message', msg => {
    channel = msg.channel;
if (msg.content === '!add')
    addmembre(msg);


if (msg.content === '!undercover'){
    //Attribuer le role Undercover
    indexJoueur = Math.floor(Math.random() * udcmembre.length);
    console.log('Le joueur undercover est id:  '+ indexJoueur);

    let i = 0;
    udcmembre[indexJoueur].addRole(udcrole[1]);
    const wordIndex = Math.floor(Math.random() * dico.length);
    Synonyme.get(dico[wordIndex]).then(res => {
        const randomWord = res
        udcrole[1].mot = randomWord;
        udcrole[0].mot = dico[wordIndex];
        for (user of udcmembre) {
            const udcjoueur = msg.guild.members.cache.get(user.id);
            
            udcjoueur.send("La partie d'undercover va bientôt commencer !");
            
            if(i != indexJoueur){
                user.addRole(udcrole[0]);//Civil
                let message = new Discord.MessageEmbed()
                .setColor('#0099ff')
	            .setTitle(`Votre mot est ${udcrole[0].mot}`);
                udcjoueur.send(message);
            }
            else{
                user.addRole(udcrole[1]);//Undercover
                let message = new Discord.MessageEmbed()
	            .setColor('#0099ff')
	            .setTitle(`Votre mot est ${udcrole[1].mot}`);
                udcjoueur.send(message);
            }
            i++;
        }
        msg.channel.send('Nous sommes au 1er tour, faites vos jeux messieurs.');
    });
}

    if (msg.content === '!nb'){

        for (user of udcmembre) {
            msg.channel.send(`${msg.guild.members.cache.get(user.id)} est ${user.role.libelle}`);
        }
    }

    if (msg.content == "!nv"){
        async function clear() {
            msg.delete();
            const fetched = await msg.channel.messages.fetch({limit: 99});
            msg.channel.bulkDelete(fetched);
        }
        clear();
    }

    if(msg.content === '!helpudc'){

        msg.channel.send({
            embed: {
                color: 0xe43333,
                title: `Commande pour jouer à l'undercover:`,
                fields: [
                    {   
                    name: "!add",
                    value: "Permet d'ajouter un joueur pour la partie (Il n'est pas possible d'ajouter un joueur en le mentionnant, seul l'auteur de la commande peut rentrer dans la partie.",
                    },
                    {
                    name: "!undercover\nPermet de lancer la partie quand tous les joueurs se sont joint à la partie.",              
                    }
                ],
                footer: {
                    text: `Jeu développé par Droot`
                }
            }
        })
    }
    if(msg.content.startsWith("!mot")){
        isWaiting = false;
        user = udcmembre.find(u => u.id == msg.author.id);
        user.mots.push(msg.content.split(" ")[1]);
        answers +=1;
        msg.channel.send(`${msg.guild.members.cache.get(user.id)} a écrit le mot ${msg.content.split(" ")[1]}`);
        msg.delete();
        if(answers % udcmembre.length == 0 && answers != udcmembre.length * 3){
            msg.channel.send(`Nous sommes au ${(answers / udcmembre.length)+1}eme tour`);
        }
        if(answers == udcmembre.length * 3){
            afficherLesMots();
            msg.channel.send('Le jeu est fini, il faut maintenant débattre');
            for(const user of udcmembre){
                msg.channel.send(`${msg.guild.members.cache.get(user.id)}`);
            }
        }
    }
    
});
    client.on('messageReactionAdd', async (reaction, user) => {
        reactionsCount++;
        if(reactionsCount == udcmembre.length){
            channel.send(`l'Undercover était ${udcmembre[indexJoueur].username}`)
        }
        console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
        // The reaction is now also fully available and the properties will be reflected accurately:
        console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
        
    });
function afficherLesMots(){
    for(const user of udcmembre){
        console.table(user.mots);
    }
}


client.login(config.token);