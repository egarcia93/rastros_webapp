let express =  require('express');
let app  = express();
var request = require("request");
var fs = require("fs");
let Image = require('./model/Image');
let analysis;
let emotion;



app.use(express.static('public'));
//Importante para mandar foto tamaño completo
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
let dotenv =  require('dotenv');
let mongoose = require('mongoose');
dotenv.config();

mongoose.connect(process.env.DB_CONNECT,
    {useNewUrlParser: true}, 
    ()=>console.log('Connected to db')
    );

    //Método API de detección facial
function make_request(method, url, data, files = {}, callback){
    var data = JSON.parse(JSON.stringify(data))
    for (var i of Object.keys(files))
        data[i] = fs.createReadStream(files[i])

    request({
        method: method,
            url: url,
            headers: {
                    'token': process.env.FACE_TOKEN
            },
            formData: data
    }, function (error, response, body) {
        if (error) throw new Error(error);

        if (callback != undefined)
            callback(JSON.parse(body))
    });
};

app.post('/api',async (req,res)=>{


    make_request("POST", "https://api.luxand.cloud/photo/detect", {"photo": req.body.snap}, {}, function(response){
       
   //Si no se detecta cara, enviar mensaje a usuario de tomar foto de nuevo
       analysis = response;
      // console.log(analysis);


  
       
    });
   
    make_request("POST", "https://api.luxand.cloud/photo/emotions", {"photo": req.body.snap}, {},  function(response){
      //Solo escoger emoción con mayor prbabilidad
        emotion = response;
        console.log(emotion.faces[0].emotions);
       
           

});
//falta añadir emoción y el porcentaje de la emoción
const img = new Image({
    lat: req.body.lat,
    lon: req.body.lon,
    image64: req.body.image64,
    age: analysis[0].age,
    gender: analysis[0].gender.value,
    genProb: analysis[0].gender.probability,
   
});  
//Aquí se manda a DB
try{
    await img.save();
    res.json({task:"success"})
    console.log("Saved");
}catch(err){
   // console.log("Face not found");
     res.status(400).send(err);
}

});
app.get('/api',async(req,res)=>{
    try{
        await Image.find().exec(function(err, doc) {
        
            res.json(doc)});
        
    }
    catch(err){
        res.status(400).send(err);
    }
});


app.listen(3000, () => console.log("Listening to port 3000"));