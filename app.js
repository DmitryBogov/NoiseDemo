//import SimplexNoise = require("simplex-noise");
//import  * as SimplexNoise from "simplex-noise";


function testColors(pixel) {
    
}


function first_coloring( pixel) {
    

    let RockLevel = 1;
    let groveLevel = 0.8;
    let waterLevel =  0.1;



    // Rokcks
    if (pixel >= groveLevel) {
        pixel = 255 / RockLevel * pixel;
        return {r: pixel, g:pixel, b:pixel}
    }

    // grass
    if (pixel > waterLevel ) {

        return {r: 0, g: 255 / waterLevel * pixel , b:  0 }
    } 

    //watter
    return {r: 0, g:0, b:  255  - (- 100 * pixel / waterLevel) }
 

   
}

function BlackWhiteColor(pixel) {

    if (pixel <= 0) {
        return {r: 255, g: 255, b:255};
    }
    if (pixel > 0) {
        return {r: 0, g: 0, b:0};
    }

  
    return {} 

}


//Функциональный класс
class Interpolations{
    constructor(){
    }

    // a и b границы функции
    static ExpInterpolation(a,b,x){
        
        let f = Math.pow(Math.E, x-1) 
        return Interpolations.LineInterpolation(a,b,f) ;
    }
    static CubeInterpolation(a, b, x){
    
        let result = Math.pow(x, 3) ;

        return result;
    }
    static LineInterpolation(a, b, x){

        return a*(1-x) + b * x;
    }
    static CosInterpolation(a, b, x){
        let ft = x * Math.PI *2;
        let f = (1 - Math.cos(ft)) * 0.5
        return  a*(1-f) + b*f;
    }
}

/**
 * Возвращает число от 0  до 100;
 * @param {*} pixel 
 * @returns 
 */
function DefoultColor(pixel) {

    let color = pixel*255;
    return {r: color, g: color, b:color}
}
function SetPixelRGB(imgData , x, y, w,  color) {  
    try {

        let i = y * w + x;
        i = i * 4;
        imgData.data[i + 0] = color.r;
        imgData.data[i + 1] = color.g;
        imgData.data[i + 2] = color.b;
        imgData.data[i + 3] = 255;
        

    } catch (error) {
        console.log("ERROR -> SetPixelRGB");
        console.log(error);
    }
    
}
function _SetPixelRGB(x, y, r, g, b) {
    ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (255) + ")";
    ctx.fillRect(x, y, 1, 1);
}



 function  CreateNoise(Seed = "0000", NoiseSize, Parametrs,  GetColor = DefoultColor ) {
    var simplex = new SimplexNoise(Seed);
    let layer = new ImageData(NoiseSize, NoiseSize);
    // Accuracy - МОДИФИКАТОР ОТВЕЧАЮЩИЙ ЗА КОЛИЧЕСВТО ГЕНЕРАЦИЙ
    let operation_percent = 100 /  NoiseSize ;
    let ProgressBar = document.getElementById("ProgressBar");
    let ProgressLabel = document.getElementById("ProgressLabel");
    ProgressLabel.innerHTML = "0%"
    ProgressBar.value = 0;
    
    let ProgressPecents = 0;
    /*
    let Parametrs = {
        Accuracy,
        Frequency,
        Position
    }
*/

    // ЧАСТОТА

    for (let y = 0; y < NoiseSize; y++) {

        ProgressPecents += operation_percent;
        ProgressBar.value = ProgressPecents;
        ProgressLabel.innerHTML = Math.round(ProgressPecents)  + "%"

        for (let x = 0; x < NoiseSize; x++) {

            let noiseX = (Parametrs.Position.x + x) * Parametrs.Frequency ;
            let noiseY = (Parametrs.Position.y + y) * Parametrs.Frequency;

//            let nx = x/width - 0.5, ny = y/height - 0.5;

           // let pixel =   Parametrs.Frequency *  simplex.noise2D(noiseX, noiseY); // [-1: +1]
           let pixel =   Parametrs.Accuracy *  simplex.noise2D(noiseX, noiseY); // [-1: +1]
           pixel = pixel / 2 + 0.5;
 
           // pixel=  Interpolations.ExpInterpolation(0, 1, pixel);
            pixel =  Parametrs.Interpolation(0, 1, pixel);
           // pixel=  Interpolations.LineInterpolation(0, 1, pixel);

            SetPixelRGB(layer, x, y, NoiseSize, GetColor(pixel) );


        }
    }
    
    ProgressLabel.innerHTML = "Complited"
    return layer;
}

// Для отрисовки на экран
function DrawZoomNoise(NoiseImageData, NoiseSize) {
    let ProgressBar = document.getElementById("ProgressBar_drawing");
    
   

    
    let bitmap = createImageBitmap(NoiseImageData, 0, 0, NoiseSize, NoiseSize);
    bitmap.then(result => {
        ctx.drawImage(result, 0,0, NoiseSize, NoiseSize, 0,0, DisplaySize, DisplaySize)
    });
    
}


function GetTypeInterpolation() {

    let InterpolationType = document.getElementById("InterpolationSecect").value;
    
    switch (InterpolationType) {
        case "ExpInterpolation":
            return Interpolations.ExpInterpolation
            break; 
        case "CubeInterpolation":
            return Interpolations.CubeInterpolation
            break;
        case "LineInterpolation":
            return Interpolations.LineInterpolation
            break;
        default:
            return Interpolations.LineInterpolation
            break;
    }
}


function redraw(changerID) {


    let NoiseSize = document.getElementById(changerID).value;
    if ( !NoiseSize )  {
        return;
    }
    //NoiseSize = parseInt(NoiseSize, 10);
    if (NoiseSize >= DisplaySize) {
        NoiseSize = DisplaySize;   
    }
    if (NoiseSize < 1) {
        NoiseSize = 1;   
    }

    document.getElementById("NoiseSizeRangeInput").value = NoiseSize;
    document.getElementById("NoiseSizeText").innerHTML = NoiseSize + "x"+ NoiseSize + "px";

    let Accuracy = document.getElementById("Accuracy_input").value ;
    Accuracy = Accuracy/ 100;
    document.getElementById("Accuracy_label").innerHTML = Accuracy;
   
    let Frequency = document.getElementById("Frequency_input").value ;
    Frequency = Frequency / 1000;
    document.getElementById("Frequency_label").innerHTML = Frequency;
    let Interpolation =  GetTypeInterpolation();
    
    let x = document.getElementById("Position_x_input").value;
    let y = document.getElementById("Position_y_input").value;
    let Position = {
        x:  parseInt(x, 10) | 0,
        y:  parseInt(y, 10) | 0
    }
    document.getElementById("Position_x_label").innerHTML = "X: " + Position.x;
    document.getElementById("Position_y_label").innerHTML = "Y: " + Position.y;
    

    let seed = document.getElementById("SeedInput").value;

    let Parametrs = {
        Accuracy,
        Frequency,
        Position,
        Interpolation
    }
    let start= new Date().getTime();
    let noise = CreateNoise(seed, NoiseSize, Parametrs,first_coloring);
    let end = new Date().getTime();
    console.log("Noise creating time:", (end - start));


    
    start= new Date().getTime();
    DrawZoomNoise(noise, NoiseSize);
    end = new Date().getTime();
    console.log("Drawing time:", (end - start));
}

let canvas = document.getElementById('Canvas');
let ctx = canvas.getContext('2d');
let DisplaySize = 600;
canvas.width = DisplaySize;
canvas.height = DisplaySize;









window.onload = () =>{
    
    document.getElementById('NoiseSizeRangeInput').max = DisplaySize;
    document.getElementById('NoiseSizeRangeInput').value = DisplaySize;
    redraw("NoiseSizeRangeInput");
}


//ctx.putImageData(noise, 0, 0);