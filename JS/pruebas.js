console.log(gsap);
// Setup Canvas
const my_canvas = document.getElementById("idmyCanvas");
const vctx = my_canvas.getContext("2d");

my_canvas.width;
my_canvas.height;

let v_score = 0;
let v_NumFrame = 0;

let my_canvasPosition = my_canvas.getBoundingClientRect();
/*The Element.getBoundingClientRect() method returns a DOMRect object providing information about the size of an element and its position relative to the viewport.

Syntax: domRect = element.getBoundingClientRect();
Retorna un objeto DOMRect, como un rectangle con la posicion del Element HTML (xleft, ytop, xrigth, ybottom), donde la posicion relativa con transformacion de coordenadas seria:

x = x -xleft; y = y - ytop:

Value:
The returned value is a DOMRect object which is the smallest rectangle which contains the entire element, including its padding and border-width. The left, top, right, bottom, x, y, width, and height properties describe the position and size of the overall rectangle in pixels. Properties other than width and height are relative to the top-left of the viewport.*/

//Mouse Interactivity. Create an Object mouse.
const mouse = {
    x: my_canvas.width/2,
    y: my_canvas.height/2,
    click: false
}

my_canvas.addEventListener('mousedown', function (event){
    mouse.click = true;
    mouse.x = event.x - my_canvasPosition.left;
    mouse.y = event.y - my_canvasPosition.top;
/*
    console.log("mouse X: " + mouse.x + " and the mouse Y: " + mouse.y);
    console.log("Array de particulas: " + arrayPartikeln.length); 
*/
});

my_canvas.addEventListener('mouseup', function (event) {
    mouse.click = true;
    c_istBubble = false;
    f_entecheidenPartikeln1 (mouse.x, mouse.y); //relleno array de Partikeln
});

//Objekt objektFisch
// Bildvariablen:
const objfischLeft = new Image();
objfischLeft.src = './img/fishLeft.png';
const objfischRigth = new Image();
objfischRigth.src = './img/fishRigth.png';
const objfischRigth2 = new Image();
objfischRigth2.src = './img/fishRigth2.png';

let srcX; var srcY; // Stellung des Fisches

let spriteW = 1992; 
let priteH = 981; 
let cols = 4; 
let rows = 3;
let imgW = spriteW/cols; 
let imgH = spriteH/rows; 
let xIni = my_canvas.width - imgW/8; 
let yIni = imgH/8;

var currentFrame = 0;
var trackLeft = 0;
let trackRigth = 0;

let moveRigth = false;
let moveLeft = true;

//Functionen der Bewegung

function updateFrame () {
    setInterval ( function () {
        vctx.clearRect (xIni, yIni, imgW/8, imgH/8);
        currentFrame = ++ currentFrame % cols;
        trackLeft = ++ trackLeft % rows;
        srcX = currentFrame * imgW;
        srcY = trackLeft * imgH;
       // console.log("currentFrame: " + currentFrame + " trackLeft: " + trackLeft);

        var calculo = my_canvas.width - (imgW / 8);
        console.log ("calculo: " + calculo);
        console.log ("xIni: " + xIni);
        
        if (xIni <= calculo && xIni >= 0 && !moveRigth) {
            moveLeft = true;
            moveRigth = false;
            xIni = xIni - 0.2;
        } else {
            moveRigth = true;
            moveLeft = false;
            xIni = xIni + 0.2;
            if(xIni >= calculo ) {
                moveLeft = true;
                moveRigth = false;
            }
        }
        
        /*
        if (xIni >= calculo && moveLeft) {
            console.log ("xIni: " + xIni);
            moveRigth = false;
            srcY = trackLeft * imgH;
            xIni = xIni - 0.5;
        } elseif (xIni < calculo && moveRigth) {
            moveLeft = false;
            moveRigth = true;
            if (xIni < (my_canvas.width - 70) && moveRigth) {
                srcY = trackLeft * imgH;
                xIni = xIni + 0.5;
            }
            moveRigth = false;
            moveLeft = false;
        }
        */

    } , 500);
}

function drawFrame () {
    updateFrame ();
    if (moveLeft) {
        vctx.drawImage (objfischLeft , srcX, srcY, imgW, imgH, xIni, yIni, imgW/8, imgH/8);
    } else {
        vctx.drawImage (objfischRigth2 , srcX, srcY, imgW, imgH, xIni, yIni, imgW/8, imgH/8);
    } 
}
////////////////////////////////////////// END /////////////////////////////////////
class c_Fisch {
    constructor (x, y, radius, color, angle, frameX, frameY, frame, spriteX, spriteY) {
        this.x = 0;
        this.y = my_canvas.height/2;
        this.radius = 30;
        this.color = 'rgb(208, 245, 245)';
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteX = 498;
        this.spriteY = 327;
    }

    update () {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        if (dx != 0) {
            this.x -= (dx/30)*2;
        }
        if (dy != 0) {
            this.y -= (dy/30)*2;
        }
    }

    drawFisch () {
        if (mouse.click) {
            vctx.lineWidth = 0.2;
            vctx.fillStyle = 'blue';
            vctx.beginPath();
            vctx.moveTo(this.x, this.y);
            vctx.moveTo(mouse.x, mouse.y);
            vctx.stroke();
            vctx.closePath();
        }

        vctx.save ();
        vctx.fillStyle = this.color;
        vctx.beginPath();
        vctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        vctx.fill();
        vctx.closePath();
        vctx.restore();
        vctx.save();
        vctx.translate(this.x, this.y);
        vctx.rotate(this.angle);

       if (this.x >= mouse.x) {
        vctx.drawImage( objfischLeft , this.frameX * this.spriteX, this.frameY * this.spriteY, this.spriteX, this.spriteY, 0 - 40, 0 -28, this.spriteX/7, this.spriteY/7 );
       } else {
        vctx.drawImage( objfischRigth, this.frameX * this.spriteX, this.frameY * this.spriteY, this.spriteX, this.spriteY, 0 - 40, 0 -28, this.spriteX/7, this.spriteY/7 );
       }
       vctx.restore();
    }
}

const objectFisch = new c_Fisch();

// Object Bubble (Luftblasen)
const arrayBubbles = [];

const bubblePop1 = document.createElement('audio');
bubblePop1.src = './Sound/Pop1.mp3';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = './Sound/Pop2.mp3';

const valueRandom = Math.random() * 3 + 1;

class c_Bubble {
    constructor (speed, x, y, radius, color, distance, countedCollision, sound) {
        const colorAleatorio = 'hsl('+ Math.random()*360 + ', 50%, 50%)';
        
        this.speed = Math.random()*8 + 1;
        this.x = Math.random()*my_canvas.width;
        this.y =  my_canvas.height;
        this.radius = Math.random()*12 + 3;
        this.color = colorAleatorio;
        this.distance;
        this.countedCollision = false;
        this.sound;

        if(Math.random <= 0.5) {
            this.sound = './Sound/Pop1.mp3';
        } else {
            this.sound = './Sound/Pop2.mp3';
        } 
       // this.sound = Math.random() <= 0.5 ? bubblePop1 : bubblePop2;
    }

    update () {
        this.y = this.y - this.speed;
        const dx = this.x -objectFisch.x;
        const dy = this.y -objectFisch.y;
        this.distance = Math.sqrt (dx*dx + dy*dy);
    }

    drawBubble () {
        vctx.save();
        vctx.fillStyle = this.color;
        vctx.beginPath();
        vctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        vctx.fill();
        vctx.closePath();
        vctx.restore();

        for (let i = 1; i < valueRandom; i++) {
            vctx.save();
            vctx.fillStyle = this.color;
            vctx.beginPath();
            vctx.arc(this.x, this.y + 20*i, this.radius/(4*i), 0, Math.PI*2);
            vctx.fill();
            vctx.closePath();
            vctx.restore();
        }
    }
}

function f_entstehenBubbles () {
    if (v_NumFrame % 30 == 0) {  // surgen Bubbles cada 30 Frames
        arrayBubbles.push(new c_Bubble());  // creo una burbuja
    }
    for (let i = 0; i < arrayBubbles.length; i++) {  // modifico y pinto la burbuja
        arrayBubbles[i].update();
        arrayBubbles[i].drawBubble();
    }
    for (let index1 = 0; index1 < arrayBubbles.length; index1++) {
        if (arrayBubbles[index1].y < 0 - arrayBubbles[index1].radius*2) {
            setTimeout(() => {
                arrayBubbles.splice(index1 , 1);
            }, 0);      
        }  

        // Begin colision
        if(arrayBubbles[index1].distance < arrayBubbles[index1].radius + objectFisch.radius) {
            //*******************************************************
            c_istBubble = true;
            f_entecheidenPartikeln2 (arrayBubbles[index1].x, arrayBubbles[index1].y, arrayBubbles[index1].radius, arrayBubbles[index1].color);

            if (!arrayBubbles[index1].countedCollision) {
                if (arrayBubbles[index1].sound = './Sound/Pop1.mp3') { 
                    bubblePop1.play(); 
                } else {
                   // arrayBubbles[index1].sound = './Sound/Pop3.mp3';
                    bubblePop2.play();
                }
            }     
            arrayBubbles[index1].countedCollision = true;
            setTimeout(() => {
                arrayBubbles.splice(index1 , 1);
            }, 0);      
        }
        // End
    }  
}

// Object Partikeln (von Luftblasen)
let arrayPartikeln = [];

let v_aceleracionPartikeln              = 1.5;
const v_Reibungen                       = 0.96;
let c_istBubble                         = true;

class Partikel {
    constructor (x, y, radius, ecolor, velocityX, velocityY) {
        var colorAleatorio      = 'hsl('+ Math.random()*360 + ', 65%, 65%)'
        this.x                  = x;
        this.y                  = y;
        this.radius             = radius;

        if (c_istBubble) {
            this.color = ecolor;
        } else {
            this.color = colorAleatorio;
        }

        this.velocityX          = velocityX * Math.random() * v_aceleracionPartikeln;
        this.velocityY          = velocityY * Math.random() * v_aceleracionPartikeln;
        this.alpha              = 1;
    }

    update () {
        this.velocityX          = this.velocityX * v_Reibungen;
        this.velocityY          = this.velocityY * v_Reibungen;

        this.x                  = this.x + this.velocityX;
        this.y                  = this.y + this.velocityY;

        this.alpha              -= 0.01;     
    }

    drawPartikel () {
        vctx.save();
        vctx.globalAlpha        = this.alpha;
        vctx.beginPath();
        vctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        vctx.fillStyle          = this.color;
        vctx.fill();
        vctx.closePath();
        vctx.restore();
    }   
}

// Einfügen von Partikeln und Entecheiden Luftblasenpartikeln
function f_entecheidenPartikeln1 (ex, ey) {
    let colorAleatorio                  = 'hsl('+ Math.random()*360 + ', 65%, 65%)'
    let randomX                         = ((Math.random() -0.5)) * 5 + ((Math.random() - 0.5) * 5) ;
    let randomY                         = ((Math.random() -0.5)) * 5 + ((Math.random() - 0.5) * 5) ;
    let px                              = ex;
    let py                              = ey;
    let pColor                          = colorAleatorio;

    for (let index = 0; index < Math.random()*8 + 5; index++) {
        arrayPartikeln.push (new Partikel (px, py, Math.random () * 1 + 1, pColor, randomX, randomY));
    }

   // for (let i = 0; i < arrayPartikeln.length; i++) {  // modifico y pinto la burbuja
   //     arrayPartikeln[i].update();
   //     arrayPartikeln[i].drawPartikel();
   // }
/*
    if (v_NumFrame % 50 == 0) {  // surgen Partikles cada 50 Frames
        arrayPartikeln.push(new c_Bubble());  // creo una Partiklen
    }
    for (let i = 0; i < arrayPartikeln.length; i++) {  // modifico y pinto la burbuja
        arrayPartikeln[i].update();
        //arrayPartikeln[i].drawPartikel();
    }
*/
   // console.log('Nummer von Array von Partikeln: ' + arrayPartikeln.length);
    /*
    for (let index1 = 0; index1 < arrayBubbles.length; index1++) {
        if (arrayBubbles[index1].y < 0 - arrayBubbles[index1].radius*2) {
            arrayBubbles.splice(index1 , 1);           
        }  
    }  
    */
    
}

function f_entecheidenPartikeln2 (ex, ey, eradius, ecolor) {
    let color                           = ecolor;
    let randomX                         = ((Math.random() -0.5)) * 10 + ((Math.random() - 0.5) * 10) ;
    let randomY                         = ((Math.random() -0.5)) * 10 + ((Math.random() - 0.5) * 10) ;
    //var angle1 = Math.atan2 (aleatorioY, aleatorioX);
    //var angle2 = - angle1;
    let px                              = ex;
    let py                              = ey;

    for (let index = 0; index < eradius/2; index++) {
        arrayPartikeln.push (new Partikel (px, py, Math.random () * 3 + 1, color, randomX, randomY));
        arrayPartikeln.push (new Partikel (px, py, Math.random () * 3 + 1, color, -randomX, -randomY));
    }

   // for (let i = 0; i < arrayPartikeln.length; i++) {  // modifico y pinto la burbuja
   //     arrayPartikeln[i].update();
   //     arrayPartikeln[i].drawPartikel();
   // }
/*
    if (v_NumFrame % 50 == 0) {  // surgen Partikles cada 50 Frames
        arrayPartikeln.push(new c_Bubble());  // creo una Partiklen
    }
    for (let i = 0; i < arrayPartikeln.length; i++) {  // modifico y pinto la burbuja
        arrayPartikeln[i].update();
        //arrayPartikeln[i].drawPartikel();
    }
*/
    //console.log('Nummer von Array von Partikeln: ' + arrayPartikeln.length);
    /*
    for (let index1 = 0; index1 < arrayBubbles.length; index1++) {
        if (arrayBubbles[index1].y < 0 - arrayBubbles[index1].radius*2) {
            arrayBubbles.splice(index1 , 1);           
        }  
    }  
    */
    
}

// Function animate ()
function animate () {
    vctx.clearRect (0, 0, my_canvas.width, my_canvas.height);
    v_NumFrame ++;
    f_entstehenBubbles ();

    objectFisch.update();
    objectFisch.drawFisch();

    drawFrame ();

    vctx.fillStyle          = 'black';
    vctx.fillText('Score: ' + v_score, 18, 30);

    requestAnimationFrame (animate);
    /*The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    Syntax: window.requestAnimationFrame(callback);
    
    callback: The function to call when it's time to update your animation for the next repaint. The callback function is passed one single argument. 
    */

    arrayPartikeln.forEach( (parPartikel, indexPartikel) => {
            if(parPartikel.alpha <= 0) {
                setTimeout(() => {
                    arrayPartikeln.splice (indexPartikel, 1);
                }, 0);
            } else {
                parPartikel.update ();
                parPartikel.drawPartikel ();   
            }
            //console.log("Nummer von Partikeln ist: " + arrayPartikeln.length);
        }
        
    );
}


animate ();


