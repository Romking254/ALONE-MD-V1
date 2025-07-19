const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK095LzZUdGpsZ0FGcGllSzJ2YTk3Q2l1TlVMdXFuT0tDY2VNd2lXazRuZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUmNRN1o1NWRxQWtCUCtibkxXSVNGQnR2b3drMkdzSERtWVQyOHlVRWZSYz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJTSjFkV2dkRXgyaFA3elVFN3lyRzhBNm54OERHdWdkZXdrYzV1ckhGcWw4PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI0eFJkY09QOWNRL2JFdFluZWI4ZVJmbSthaDlBTXNUOXBEYTVPaFQ4Y0FzPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjBJS3ppZDREdHQxYlZjZ1RwQi9xaWV3Ry9lL2ExUUUrbVlZdGJOY254Rkk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkFiUnFPMmgwLzR0b0NWTWFENFhTTGJFN21ScHV2NXA2U1RPSXVQbWZzanM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVUNXSWZjL3VDOXZubFhlRG8wUTA4bFdmV3czdnVacERSRXFDbGRyOWFFUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVnZMRTFtc2d1aXVYSzYzcU1VYXdGb3dENlpGOFQvMWJUSFhqWUJYZWNXVT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImhWVVlsc2JyV2pJcHd5RTMxbkdteGlmV05Ld2Fwb21vY0pTWU5GMVYzdkNnQXdweE5ub0R3dnFwK3pSVEc1Mi9aMG15QnhxSHBQQXdwU0ZDWkRucENBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjA1LCJhZHZTZWNyZXRLZXkiOiJrODJLZXJ6Z1ZER0N1MmpDU09taHRGeUpxZjRJSW9NdnR2YXI4UktJNGNZPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwicmVnaXN0ZXJlZCI6dHJ1ZSwicGFpcmluZ0NvZGUiOiIxTk1QWjhXViIsIm1lIjp7ImlkIjoiMjU0NzQ4Njc5MzEyOjY5QHMud2hhdHNhcHAubmV0IiwibmFtZSI6Ik1yR29vZFZpYmVzIiwibGlkIjoiMTMwMDQzNDIyNTAyOTQ4OjY5QGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTm03cDh3Q0VMT1I3Y01HR0I0Z0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiZ0NDWVdSM3llSHQ0MlR4eisraWQwWEF3QkxtejE0V0tNNHR4TloveStHOD0iLCJhY2NvdW50U2lnbmF0dXJlIjoiY3padDdJMEZuWHg1K0ZTTmMyZFYvRlprSUZxQlZ2bnZGcG5WWEtZSHM4M2dGSFR2NkUvWGkzWE9DV2tHTDlQTnVFWStZaVZkbkp5aW9FYzA5MHd3Q2c9PSIsImRldmljZVNpZ25hdHVyZSI6ImNySjdqaERkSHlMM1E5N1lrZENycjRMRWdTQlByamZ5UnZFZ2RwN1VDZkY1d2JCU3k2b2dNaDBLOVI0UmlLZGFJc0RzVDF0azNMK2tOeGQ3V2p0dEJBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzQ4Njc5MzEyOjY5QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQllBZ21Ga2Q4bmg3ZU5rOGMvdm9uZEZ3TUFTNXM5ZUZpak9MY1RXZjh2aHYifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNCSUlCUT09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc1MjkxMDAxNiwibGFzdFByb3BIYXNoIjoiUFdrNUIiLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUJmUCJ9',
    PREFIXE: process.env.PREFIX || ".",
    GITHUB : process.env.GITHUB|| 'https://github.com/Toputech/ALONE-MD-V1',
    OWNER_NAME : process.env.OWNER_NAME || "Starboy",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "254748679312",  
    ANTI_LINK : process.env.ANTI_LINK || "yes",
    ANTI_BAD : process.env.ANTI_BAD || "yes",               
    AUTO_REPLY : process.env.AUTO_REPLY || "no",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'yes',             
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    AUTO_REACT: process.env.AUTO_REACTION || "yes",  
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || 'yes',              
    CHAT_BOT1: process.env.CHAT_BOT1 || "yes",
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "no",
    GCF: process.env.GROUP_CONTROL || 'no', 
    GREET : process.env.GREET || "no",            
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || 'viewed by Alone md',   
    AUTOBIO: process.env.AUTOBIO || 'yes',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'no',              
    GURL: process.env.GURL  || "https://whatsapp.com/channel/0029VaeRrcnADTOKzivM0S1r",
    WEBSITE :process.env.GURL || "https://whatsapp.com/channel/0029VaeRrcnADTOKzivM0S1r",
    CAPTION : process.env.CAPTION || "ALONE-MD",
    BOT : process.env.BOT_NAME || 'ALONE_MD',
    URL : process.env.BOT_MENU_LINKS || "https://files.catbox.moe/522t4u.jpg",
    MODE: process.env.PUBLIC_MODE || "no",              
    TZ: process.env.TIMEZONE || "Africa/Dodoma", 
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME || null,
    HEROKU_API_KEY : process.env.HEROKU_API_KEY || null,
    WARN_COUNT : process.env.WARN_COUNT || '4' ,
    ETAT : process.env.PRESENCE || '',
    GEMINI_API_KEY : process.env.GEMINI_API_KEY || 'AIzaSyCcZqDMBa8FcAdBxqE1o6YYvzlygmpBx14',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    ANTICALL: process.env.ANTICALL || 'yes',
                  ANTICALL_MSG: process.env.ANTICALL_MSG || 'Dont call i am busy🏆',
    CHATBOT : process.env.CHATBOT || 'no',  
       URL: process.env.URL || "https://files.catbox.moe/522t4u.jpg",  
              
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
