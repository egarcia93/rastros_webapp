let locationData;
let lat,lon;
let capture;
const boton = document.getElementById('snapButton');
let clicked = false;
let canvas;
let data;


boton.addEventListener('click', async event=>{
    clicked = true;
    capture.loadPixels();
    let snap = capture.canvas.toDataURL('image/png', 1.0);
    //createImg(snap);

   
    let data = {lat,lon,snap};
    let message = JSON.stringify(data); 
    ///console.log(message);

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        body:  message,
        };
            
    const response = await fetch('/api', options);
    //console.log(response);
     const json = await response.json();
     console.log(json);

});


function setup(){

    background(255);
    canvas = createCanvas(240,180);
    canvas.parent('sketch_container');
    capture = createCapture('VIDEO');
    capture.hide();
    capture.elt.muted = true;
    clicked =  true;





    if('geolocation' in navigator){
        console.log("Geo available");
        navigator.geolocation.getCurrentPosition(position=>{
                lat = position.coords.latitude.toString();
                lon =  position.coords.longitude.toString();


        });
    }else{
        lat = 0;
        lon = 0;
    }

}
function draw(){


image(capture,0,0,width,height);
}

//getData();

async function getData() {
const response = await fetch('/api');
const data = await response.json();

for (item of data) {
const root = document.createElement('p');
const image = document.createElement('img');


image.src = item.image64;


root.append(image);
document.body.append(root);
}
console.log(data);
}