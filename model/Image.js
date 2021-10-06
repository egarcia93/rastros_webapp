const mongoose =  require('mongoose');

const messageSchema =  new mongoose.Schema({

    lat:{
        type: String,
        
    },
    
    lon:{
        type: String,
       
    },

    image64:{
        type: String
     
        
    },
    age:{
        type: String
    },

    gender:{
        type: String

    },

    genProb:{
        type: String
    },
    emotion:{

        type: String
    },
    emotionProb:{
        type: String
    }


});


module.exports = mongoose.model('Image',messageSchema);