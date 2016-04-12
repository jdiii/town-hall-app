module.exports = {

    /*
    * Your MongoDB database and collection info.
    * You can change the names if you'd like.
    */
    'database':{
        'url' : 'mongodb://localhost:27017/qa', //database
        'dataCollection' : 'qa', //collection for q&a data
        'userCollection' : 'user' //note: users are not implemented yet.
    },

    /*
    * Your Google OAuth client secrets.
    * See console.developer.google.com.
    */
    'googleAuth' : {
        'clientID' : '',
        'clientSecret' : '',
        'callbackURL' : '',
        'domains' : [] //optional. Empty array to allow anyone in. Otherwise, list Google domains you wish to allow.
    },

    /*
    * Internal app settings.
    */
    'settings':{
        'appTitle' : 'Q&A', //this appears on the login page and the app header
        'appLogo' : '', //optional, path to a logo image (relative to /public/ folder)
        'modSecret' : '', //optional. this is a secret passphrase to reach the moderator view, e.g. /mod?secret=passphrase will authenticate. Leave blank for no password.
        'sessionSecret' : 'hidden tiger rotten banana', //you should replace this with your own nonsense phrase.
        'voteLimit' : 0 //set to a >0 integer if you want to limit votes per person
    }

}
