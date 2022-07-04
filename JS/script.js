console.log(gsap);

////     Setup of Canvas    *******************************************************************************************
const my_canvas     = document.getElementById("idmyCanvas");
const vctx          = my_canvas.getContext("2d");

my_canvas.width     =   900;
my_canvas.height    =   550;
//vctx.font           = '50px ';

// The Element.getBoundingClientRect() method returns a "DOMRect object", providing information about the size of an element 
// and its "position relative" to the viewport. */
let my_canvasPosition = my_canvas.getBoundingClientRect();  //  El método "Element.getBoundingClientRect()" devuelve un objeto 
                                                            //  "DOMRect", con el "tamaño de un elemento" y su "posición relativa" 
                                                            //  respecto a la ventana de visualización (viewport).

/* Syntax: domRect = element.getBoundingClientRect();
Retorna un objeto DOMRect, como un rectangle con la posicion del Element HTML (xleft, ytop, xrigth, ybottom),
 donde la posicion relativa con transformacion de coordenadas seria:

                            x = x -xleft; y = y - ytop:

Value:
The returned value is a DOMRect object which is the smallest rectangle which contains the entire element,
 including its padding and border-width. The left, top, right, bottom, x, y, width, and height properties
describe the position and size of the overall rectangle in pixels. 
Properties other than width and height are relative to the top-left of the viewport.*/

            // El metodo "getBoundingClientRect()" devuelve: un "objeto DOMRect" con ocho propiedades: 
            //                                           // 1.- izquierda (left), 2.- arriba (top), 3.- derecha (right), 4.- abajo (bottom), 
                                                         // 5.- x, 6.- y, 7.- ancho (width), 8.- alto (height).
                                                            
                        // 1.- El tamaño de un elemento ( x, y, width, height del elemento)
                        // 2.- La posicion relativa a la ventana gráfica (viewport) (left, top, right, bottom)

            //  Retorna un "objeto DOMRect", como un rectangle con la posicion del Element HTML (xleft, ytop, xrigth, ybottom), donde 
            //  la posicion relativa con transformacion de coordenadas seria:

            //                x = x -xleft; y = y - ytop;

            //  Nota:  Se tiene en cuenta el desplazamiento que se ha hecho. Esto significa que los bordes del rectángulo 
            //         (superior, izquierdo, inferior y derecho) cambian sus valores cada vez que cambia la posición de desplazamiento.


////    GLOBAL VARIABLES    *****************************************************************************************
let score                               = 0;    //  Score of the game ini
let numFrame                            = 0;    //  Frame/seg ini
let gameSpeed                           = 0;
let gameFrame                           = 0;    //  Inni Frame of the game
let gameOver                            = false;

let acelerationPartikeln                = 1.3;
const reibungen                         = 0.96;   // deseleracion de particulas
let   istBubble                         = true;

const BG = {
    x1 : 0,
    x2 : my_canvas.width,
    y : 0,
    width : my_canvas.width,
    height : my_canvas.height
};

const valueRandom   = Math.floor(Math.random() * 3 + 1);  //  In Class Bubble

const arrayEnemies                      = [];    //  Array und ObjeKt Enemies 
const arrayBubbles                      = [];    //  Array von Blasen im Meer //  --> Array of Bubbles in the canvas
const arrayPartikeln                    = [];    //  Array von Partikeln

const bubblePop1                        = document.createElement('audio');  //  --> "files sounds" of Bubbles
bubblePop1.src                          = './Sound/Pop1.mp3';
const bubblePop2                        = document.createElement('audio');
bubblePop2.src                          = './Sound/Pop2.mp3';

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Bildvariablen:
const objfischLeft      = new Image();
objfischLeft.src        = './img/fishLeft.png';

const objfischRigth     = new Image();
objfischRigth.src       = './img/fishRigth.png';

const objfischRigth2    = new Image();
objfischRigth2.src      = './img/fishRigth2.png';

let srcX, srcY;         // Stellung des Fisches

let spriteW             = 1992; 
let spriteH             =  981;
let cols                = 4; 
let rows                = 3;
let imgW                = spriteW/cols; 
let imgH                = spriteH/rows; 
let xIni                = my_canvas.width  - imgW/8; 
let yIni                = my_canvas.height - imgH/8;

let currentFrame        = 0;
let trackLeft           = 0;
let trackRigth          = 0;

let moveRigth           = false;
let moveLeft            = true;

//Functionen der Bewegung
function updateFrame () {
    setInterval ( function () {
        vctx.clearRect (xIni, yIni, imgW/8, imgH/8);
        currentFrame                                    = ++ currentFrame % cols;
        trackLeft                                       = ++ trackLeft % rows;
        srcX                                            = currentFrame * imgW;
        srcY                                            = trackLeft * imgH;
       // console.log("currentFrame: " + currentFrame + " trackLeft: " + trackLeft);

        let calculo                                     = my_canvas.width - (imgW / 8);
        // console.log ("calculo: " + calculo);
        // console.log ("xIni: " + xIni);
        
        if (xIni <= calculo && xIni >= 0 && !moveRigth) {
            moveLeft                                    = true;
            moveRigth                                   = false;
            xIni                                        = xIni - 0.2;
        } else {
            moveRigth                                   = true;
            moveLeft                                    = false;
            xIni                                        = xIni + 0.2;
            if(xIni >= calculo ) {
                moveLeft                                = true;
                moveRigth                               = false;
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

    } , 600);
}

function drawFrame () {
    updateFrame ();
    if (moveLeft) {
        vctx.drawImage (objfischLeft , srcX, srcY, imgW, imgH, xIni, yIni, imgW/8, imgH/8);
    } else {
        vctx.drawImage (objfischRigth2 , srcX, srcY, imgW, imgH, xIni, yIni, imgW/8, imgH/8);
    } 
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//  GLOBAL DATA JSON        *************************************************************************************
//  1.- Ini JSON of Fisch Objekt (constructor method argument value)
const iniFisch = {
    posX        : 0,
    posY        : my_canvas.height/2,
    radius      : 28,
    color       : 'transparent',
    angle       : 0,
    frameX      : 0,
    frameY      : 0,
    frame       : 0, 
    spriteX     : 498, 
    spriteY     : 327
};
//  GLOBAL DATA JSON        *************************************************************************************
//  2.- Ini JSON of Fisch Enemy Objekt (constructor method argument value)
const iniEnemy = {
    posX            : my_canvas.width + 200,
    posY            : Math.round(Math.random()*(my_canvas.height - 150)) + 90,
    radius          : 25,
    color           : 'transparent',
    frameX          : 0,
    frameY          : 0,
    frame           : 0, 
    spriteX         : 418, 
    spriteY         : 270
};

//  GLOBAL DATA JSON        *************************************************************************************
//  3.- Ini JSON of Bubble Objekt (constructor method argument value)
const iniBubble = {
    speed                   : Math.floor(Math.random() * 3.5 + 1),
    posXBubble              : Math.random() * my_canvas.width,
    posYBubble              : Math.random() * my_canvas.height,
    //posYBubble              : 0.9 * my_canvas.height,
    radius                  : Math.floor(Math.random() * 9 + 4),
    distance                : 0,
    countedCollision        : false,
    colorRandom             : 'hsl('+ Math.floor(Math.random()*360) + ', 60%, 60%)'
};

////  GLOBAL FUNCTIONS      ******************************************************************************************                                                           //      Sintaxis:  element.getBoundingClientRect();

function zeichenScore () {      // paint of Score
    let textScore                                   = "Score Bubble Fisch: ";
    vctx.save();
        vctx.strokeStyle                            =   "white";              //  -->  color externo
        vctx.fillStyle                              =   'black';              //  -->  color de relleno
        vctx.beginPath();                        //    -->>  iniciar ruta de dibujo
            vctx.font                           =   'bold 18px Georgia';
                                                // * estilo de texto, position of text
            vctx.fillText(textScore, 15 ,36);    //    -->>   texto con método fill
        vctx.closePath();                        //    -->>  finalizar ruta de dibujo
            
        vctx.beginPath();
            vctx.font                           = 'bold 24px Georgia';
            vctx.fillStyle                      = 'rgb(12, 1, 87)';
            vctx.fillText(score, 180 ,36);
            vctx.stroke();
        vctx.closePath();
    vctx.restore();
}

function hadleGameOver () {
    vctx.save();
        vctx.strokeStyle = "black";  //  External color
        vctx.fillStyle   = "white";  //  Fill color
        vctx.font        = 'bold 34px Georgia';

        vctx.beginPath();
            vctx.stroke();
            vctx.fillText('Game Over.  Ihre Bewertung:  ' + score + '  Punkte', 130, 280);  //  Text Game Over
        vctx.closePath();
    vctx.restore();

    gameOver = true;
}

function handleBackground () {
    vctx.drawImage (backgroundImage, 0, 0, my_canvas.width,my_canvas.height);
    BG.x1 = BG.x1  - backgroundSpeed;
    if(BG.x1 < - BG.width) {
       BG.x1 = BG.width;
    }
    BG.x2 = BG.x2 - backgroundSpeed;
    if(BG.x2 < - BG.width) {
        BG.x2 = BG.width;
    }
    vctx.drawImage (uberBackground1, BG.x1, BG.y, BG.width, BG.height, BG.x1, BG.y, BG.width, BG.height * 0.5);
    vctx.drawImage (uberBackground2, BG.x2, BG.y, BG.width, BG.height, BG.x2, BG.y, BG.width, BG.height * 0.5); 
}

//Mouse Interactivity. Create an Object mouse.
const mouse = {
    x: my_canvas.width/2,
    y: my_canvas.height/2,
    click: false
}

// Eventos del mouse.
my_canvas.addEventListener('mousedown', function (event){
    mouse.click = true;
    mouse.x = event.x - my_canvasPosition.left;
    mouse.y = event.y - my_canvasPosition.top;

    /*
    f_entecheidenPartikeln (mouse.x, mouse.y);
    for (let i = 0; i < arrayPartikeln.length; i++) {
        arrayPartikeln [i].update();
        arrayPartikeln[i].drawPartikel();   
    }
    */
   // console.log("mouse X: " + mouse.x + " and the mouse Y: " + mouse.y);
});

my_canvas.addEventListener('mouseup', function (event) {
    mouse.click = true;
});

////    BILDER      ***********************************************************************************************
//Zeichnen das Bildfisch:
const fischLeft                 = new Image();
fischLeft.src                   = './img/fishLeft.png';  // Left ==> Rigth
const fischRigth                = new Image();
fischRigth.src                  = './img/fishRigth.png';  //Anders

const enemyImage                = new Image();
enemyImage.src                  = 'img/enemyImage1.png';

const bubbleImage               = new Image();
bubbleImage.src                 = 'img/Bubbles/bubbleImage.png';

//Repeating Background Image
const uberBackground1           = new Image ();
uberBackground1.src             = 'img/Background/pruebaImgMovimiento2.jpg';
const uberBackground2           = new Image ();
uberBackground2.src             = 'img/Background/backgroundBewegung.png';

const backgroundSpeed           = 10;

const backgroundImage           = new Image();
backgroundImage.src             = 'img/Fondomar/FondoMar1.jpg';

my_canvas.addEventListener ('dblclick', e => {
    const arrayImag = ['img/Fondomar/FondoMar1.jpg', 'img/Fondomar/FondoMar2.jpg','img/Fondomar/FondoMar3.jpg','img/Fondomar/FondoMar4.jpg',
                       'img/Fondomar/FondoMar5.jpg', 'img/Fondomar/FondoMar6.jpg', 'img/Fondomar/FondoMar7.jpg', 'img/Fondomar/FondoMar8.jpg', 
                       'img/Fondomar/FondoMar9.jpg', 'img/Fondomar/FondoMar10.jpg', 'img/Fondomar/FondoMar11.jpg', 'img/Fondomar/FondoMar12.jpg', ];
    
    const randomImag            = Math.floor(Math.random () * 12);
    backgroundImage.src         = arrayImag[randomImag];
});

////  ********************************    Klasses     **********************************************************

// 1.-  Class Fisch     *****************************************************************************************
class Fisch {
    constructor (parObjectIniFisch) {
    
        this.iniFisch                       = parObjectIniFisch;
    
        this.x                              = this.iniFisch['posX'];
        this.y                              = this.iniFisch['posY'];
        this.radius                         = this.iniFisch['radius'];
        this.color                          = this.iniFisch['color'];
        this.angle                          = this.iniFisch['angle'];
        this.frameX                         = this.iniFisch['frameX'];
        this.frameY                         = this.iniFisch['frameY'];
        this.frame                          = this.iniFisch['frame'];
        this.spriteX                        = this.iniFisch['spriteX'];
        this.spriteY                        = this.iniFisch['spriteY'];
    }
    
    update () {
        const dx            = this.x - mouse.x;  // (dx, dx) es el desplazamiento del pez
        const dy            = this.y - mouse.y;
    
        let theta           = Math.atan2(dy, dx);  //  theta es el angulo de desplazamiento del pez, directtion of Fisch
        this.angle          = theta;
    
        if (dx != 0) {
            this.x -= (dx/30)*2;
        }
        if (dy != 0) {
            this.y -= (dy/30)*2;
        }
    }
    
    drawFisch () {
        if (mouse.click) {
            vctx.lineWidth                          =  0.2;
            vctx.fillStyle                          = 'blue';
            vctx.beginPath();
                vctx.moveTo(this.x, this.y);
                vctx.moveTo(mouse.x, mouse.y);
                vctx.stroke();
            vctx.closePath();
        }
    
            // vctx.fillStyle                             = this.color;
            // vctx.beginPath();
            //         vctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            //         vctx.fill();
            // vctx.closePath();
        vctx.save();
        vctx.translate(this.x, this.y);
        vctx.rotate(this.angle);
    
        if (this.x >= mouse.x) {
            vctx.drawImage ( fischLeft , this.frameX * this.spriteX, this.frameY * this.spriteY, this.spriteX, 
                                this.spriteY, 0 - 31, 0 -20, this.spriteX/7, this.spriteY/7 );
        } else {
            vctx.drawImage ( fischRigth, this.frameX * this.spriteX, this.frameY * this.spriteY, this.spriteX, 
                                this.spriteY, 0 - 31, 0 -20, this.spriteX/7, this.spriteY/7 );
        }
        vctx.restore();
    }
    
    static handleFisch (parObjectFish) {
        parObjectFish.update ();
        parObjectFish.drawFisch ();
    }
}
    

// 2.-  Class Fisch Enemy     ***********************************************************************************
class FischEnemy  extends Fisch {
    constructor (parObjectIniEnemy, parSpeed = Math.floor(Math.random()* 4 + 0.5)) {
        super(parObjectIniEnemy);
        this.speed                              = parSpeed;
    }

    update () {
        this.x -= this.speed;
        if (this.x < 0 - this.radius* 2) {
            this.x      = my_canvas.width + 200;
            this.y      = Math.random()*(my_canvas.height - 200) + 90;
            this.speed  = Math.random()* 2 + 0.5;
        }
        if (gameFrame % 7 == 0) {
            this.frame ++;
            if(this.frame == 12) this.frame = 0;
            if (this.frameX == 3 || this.frameX == 7 || this.frameX == 11) {
                this.frameX = 0;
            }
            else { 
                this.frameX ++;
            }
            if(this.frame == 3) {
                this.frameY = 0; }
            if (this.frame < 7) {
                this.frameY = 1;
            } if (this.frameX < 11) {
                this.frameY = 2;
            }
            else { 
                this.frameY ++;
            }
        }

        // collision with Fisch
            const dx                        = this.x - objectFisch.x;
            const dy                        = this.y - objectFisch.y;
            const distanceCollision         = Math.sqrt (dx*dx + dy*dy);
        if (distanceCollision < this.radius + objectFisch.radius - 15) {
            hadleGameOver ();
        }
    }

    drawEnemy () {
        vctx.lineWidth                          =  0.2;
        vctx.fillStyle = this.color;
        vctx.save();
            vctx.beginPath();
                vctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
                vctx.fill();
            vctx.closePath();
        
            vctx.drawImage( enemyImage, this.frameX * this.spriteX , this.frameY * this.spriteY, this.spriteX, 
            this.spriteY,this.x - 18, this.y - 18, this.radius * 1.9, this.radius * 1.95 );
        vctx.restore();    
    }

    static handleFischEnemy (parObjectFishEnemy) {
        parObjectFishEnemy.update ();
        parObjectFishEnemy.drawEnemy ();
    }
}

function handleEnemies (parObjectIniEnemy) {
    if (numFrame % 300 == 0) {  // Enemies entstehen alle 400 Frames ...
        arrayEnemies.push (new FischEnemy(parObjectIniEnemy));
        console.log('Nº de elementos del array de enemigos: ' + arrayEnemies.length);
    }
    for (let i = 0; i < arrayEnemies.length; i++) {
        arrayEnemies[i].update ();
        arrayEnemies[i].drawEnemy ();
        
        if (arrayEnemies[i].x < 0) {
            setTimeout (() => {
                arrayEnemies.splice(i, 1);
            }, 50);
            console.log('Nº de elementos del array de enemigos borrados?: ' + arrayEnemies.length );
            i--;
        } 
        /*
        else if (arrayEnemies [i]) {
            
            // Es gibt Kollision zwischen das Blasen und den Fisch
            if (arrayBubbles[i].distance < arrayBubbles[i].radius + objectFisch.radius) {
                f_entcheidenPartikeln (arrayBubbles[i].x, arrayBubbles[i].y, arrayBubbles[i].color);
                if (! arrayBubbles [i].countedCollision) {
                    if (arrayBubbles[i].sound = './Sound/Pop1.mp3') { 
                        bubblePop1.play(); 
                    } else {
                        arrayBubbles[i].sound = './Sound/Pop2.mp3';
                        bubblePop2.play();
                    }
                    arrayBubbles[i].countedCollision = true;
                    console.log('hay colision: ' + arrayBubbles[i].countedCollision);
                    
                    v_score ++;
                    setTimeout (() => {
                        arrayBubbles.splice(i, 1);
                    }, 0);
                    i--;    
                }
            }

        }

        */
    }
}


// 3.-  Class Blasen - Bubbles     ******************************************************************************
class Bubble {
    constructor ( parIniObjectBubble) {
        this.iniBubble                  = parIniObjectBubble;

        this.speed                      = this.iniBubble['speed'];
        this.x                          = this.iniBubble['posXBubble'];
        this.y                          = this.iniBubble['posYBubble'];; 
        this.radius                     = this.iniBubble['radius'];
        this.color                      = this.iniBubble['colorRandom'];
        this.distance                   = this.iniBubble['distance'];
        this.countedCollision           = this.iniBubble['countedCollision'];

        // if(Math.random <= 0.5) {
        //     this.sound = './Sound/Pop1.mp3';
        // } else {
        //     this.sound = './Sound/Pop2.mp3';
        // } 

       this.sound = Math.random() <= 0.5 ? bubblePop1 : bubblePop2;
    }

    update () {
        this.y              = this.y    -   this.speed;
        const dx            = this.x    -   objectFisch.x;
        const dy            = this.y    -   objectFisch.y;
        this.distance       = Math.floor(Math.sqrt (dx*dx + dy*dy));
    }

    drawBubble () {;
        vctx.fillStyle                  = this.color;
        vctx.save();
        vctx.beginPath();
            vctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            vctx.fill();
        vctx.closePath();
        vctx.restore();
        vctx.drawImage (bubbleImage, this.x * 0.82, this.y * 0.82, this.radius * 2.65, this.radius * 2.65);
        
        //  Array von Basten
        for (let i = 1; i < valueRandom + 1; i++) {
            vctx.fillStyle              = this.color;
            vctx.beginPath();
                vctx.arc(this.x, this.y + 22*i, this.radius/(4*i), 0, Math.PI*2);
                vctx.fill();
            vctx.closePath();
        }
    }
}

function entstehenBubbles () {
    if (numFrame % 20 == 0) {  // surgen Bubbles cada 20 Frames -- // Blasen entstehen alle 20 Frames ...
        const iniBubble = {
            speed                   : Math.floor(Math.random() * 3.5 + 1),
            posXBubble              : Math.random() * my_canvas.width,
            posYBubble              : Math.random() * my_canvas.height,
            //posYBubble              : 0.9 * my_canvas.height,
            radius                  : Math.floor(Math.random() * 9 + 4),
            distance                : 0,
            countedCollision        : false,
            colorRandom             : 'hsl('+ Math.floor(Math.random()*360) + ', 60%, 60%)'
        };
        arrayBubbles.push(new Bubble(iniBubble));
    }
    for (let i = 0; i < arrayBubbles.length; i++) { 
        arrayBubbles[i].update();
        arrayBubbles[i].drawBubble();
        
        if (arrayBubbles[i].y < 100 - arrayBubbles[i].radius * 2) {
            arrayBubbles.splice(i , 1);
            i--;
        } else if (arrayBubbles [i]) {
                                        // Es gibt Kollision zwischen das Blasen und den Fisch

            if (arrayBubbles[i].distance < arrayBubbles[i].radius + objectFisch.radius) {
                istBubble = true;
                entcheidenPartikeln (arrayBubbles[i].x, arrayBubbles[i].y, arrayBubbles[i].radius, arrayBubbles[i].color);  //  arrayBubbles[index1].radius

                if (! arrayBubbles [i].countedCollision) {
                    if (arrayBubbles[i].sound = 'Sound/Pop1.mp3') { 
                        bubblePop1.play(); 
                    } else {
                        arrayBubbles[i].sound = 'Sound/Pop2.mp3';
                        bubblePop2.play();
                    }
                    arrayBubbles[i].countedCollision = true;
                    score++;

                    setTimeout ( () => {
                        arrayBubbles.splice(i, 1);
                    }, 1);
                    i--;
                }
            }
        }
    }
}


// 4.-  Class Partikel             ******************************************************************************
//  4.- Ini JSON of Partikel Objekt (constructor method argument value)
const iniPartikel = {
    posXPartikel                    : 0,
    posYPartikel                    : 0,
    radius                          : Math.floor(Math.random () * 3  + 1),
    color                           : 'black',
    velocityX                       : 0,
    velocityY                       : 0,
    alpha                           : 1
};

class Partikel {
    constructor (parIniPartikel) {
        console.log(parIniPartikel)

        this.x                      = parIniPartikel['posXPartikel'];
        this.y                      = parIniPartikel['posYPartikel'];
        this.radius                 = parIniPartikel['radius'];
        this.color                  = parIniPartikel['color'];
        this.velocityX              = parIniPartikel['velocityX'] * Math.random() * acelerationPartikeln;
        this.velocityY              = parIniPartikel['velocityY'] * Math.random() * acelerationPartikeln;
        this.alpha                  = parIniPartikel['alpha'];
    }

    drawPartikel () {
        vctx.save();
            vctx.globalAlpha        = this.alpha;
            vctx.beginPath();
                vctx.arc (this.x, this.y, this.radius, 0, Math.PI*2);
                vctx.fillStyle          = this.color;
                vctx.fill();
            vctx.closePath();
        vctx.restore();
    }

    update () {
        //this.drawPartikel ();
        this.velocityX              = this.velocityX * reibungen;
        this.velocityY              = this.velocityY * reibungen;

        this.x                      = this.x + this.velocityX;
        this.y                      = this.y + this.velocityY;

        this.alpha                  -= 0.01;
  }
}

// Explotan las burbujas // Einfügen von Partikeln und Entecheiden Luftblasenpartikeln
function entcheidenPartikeln (px, py, pradius, pcolor) {
    let color                           = pcolor;
    let partikelRadius                  = pradius;
    let positionX                       = px;
    let positionY                       = py;
    
    const iniPartikelReal1 = {
        posXPartikel                    : positionX,
        posYPartikel                    : positionY,
        radius                          : Math.floor(Math.random () * 3  + 1),
        color                           : color,
        velocityX                       : ((Math.random() -0.5)) * 10 + ((Math.random() - 0.5) * 10),
        velocityY                       : ((Math.random() -0.5)) * 10 + ((Math.random() - 0.5) * 10),
        alpha                           : 1
    };
    const iniPartikelReal2 = {
        posXPartikel                    : positionX,
        posYPartikel                    : positionY,
        radius                          : Math.floor(Math.random () * 3  + 1),
        color                           : color,
        velocityX                       :  - ((Math.random() -0.5)) * 10 + ((Math.random() - 0.5) * 10),
        velocityY                       :  - ((Math.random() -0.5)) * 10 + ((Math.random() - 0.5) * 10),
        alpha                           : 1
    };

    for (let index = 0; index < partikelRadius/2; index++) {
        arrayPartikeln.push (new Partikel (iniPartikelReal1));
        arrayPartikeln.push (new Partikel (iniPartikelReal2)); 
    }

    // for (let i = 0; i < arrayPartikeln.length; i++) {
    //     arrayPartikeln[i].drawPartikel();
    //     arrayPartikeln[i].update();
    //     setTimeout(() => {
    //         arrayPartikeln.splice (i, 1);
    //     }, 0);
    // }
}

/*
for (let index2 = 0; index2 < arrayBubbles[i].radius * 5; index2++) { 
    arrayPartikeln.push (new c_Partikel (arrayBubbles[i].x, arrayBubbles[i].y, Math.random () * 2, 
    arrayBubbles[i].color, aleatorioX, aleatorioY));

        if (arrayBubbles[i].radius > 8) {
            //gsap.to (c_Feind, {radius: c_Feind.radius - 8});
            arrayBubbles[i].radius -= 8;
            setTimeout(() => {   
                arrayProjektile.splice(index2, 1);
            }, 0);
        } else {
            setTimeout(() => {   
                arrayProjektile.splice(index2, 1);
            }, 0);
        }
    }  
// Ende */


//  INSTANCE OF OBJECTS         ***************************************************************************************
//  1.- Eins Fisch Objekt
const objectFisch                       = new Fisch(iniFisch);

//  2.- Eins Fisch Enemy Objekt
const objectEnemy                       = new FischEnemy (iniEnemy);

////    ANIMATION OF PROGRAM    **************************************************************************************
// Function animate ()
function animate () {
    vctx.clearRect (0, 0, my_canvas.width, my_canvas.height);

    numFrame ++;
    gameFrame ++;

    handleBackground ();
    entstehenBubbles ();

    Fisch.handleFisch           (objectFisch);
    FischEnemy.handleFischEnemy (objectEnemy);

    handleEnemies (iniEnemy);

    zeichenScore ();

    drawFrame ();

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

    if (! gameOver) {
        requestAnimationFrame (animate);
    }
    
    /*The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests 
    that the browser calls a specified function to update an animation before the next repaint. The method takes a 
    callback as an argument to be invoked before the repaint.
    Syntax: window.requestAnimationFrame(callback);
    
    callback: The function to call when it's time to update your animation for the next repaint. The callback function 
    is passed one single argument. 
    */
}

animate ();

/////       Events Manager      ///////////////////////////////////////////

//  2.- Sobre windows, evento 'resize'
window.addEventListener( 'resize', function () {
    my_canvasPosition = my_canvas.getBoundingClientRect();  //  let canvasPosition = my_canvas.getBoundingClientRect();
});


