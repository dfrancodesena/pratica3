const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.width = 400;
ctx.height=225;

const intervalo=10;
let tempo =0;
let maxtempo = 10000;
 
function Personagem(imagem, x, y, h, w) {
    this.x=x;
    this.y=y;
    this.estado=0;
    this.img = new Image();
    this.img.src = imagem; 
    this.width = w;
    this.height = h;
    
    /* 
     * Calcula como desenhar o n-esimo frame de um sprite
     */
    this.desenha = function(n) { 
        let posX = this.x-fundo.sx;
        let sx = this.width*n;
        let sy =0;
        if (sx>this.img.width-this.width) {
            sy = this.height * Math.floor(sx/this.img.width);
            sx = (sx % this.img.width);
        }
        try {
            ctx.drawImage(this.img, sx, sy ,this.width,this.height,
                posX, this.y, this.width,this.height); 
        } catch (e) {
            alert(e.toString());
        }
    }
}

function Estado(ini,fini, sx, sy, vel, personagem) {
    this.frameIni=ini;
    this.frameFim=fini;
    this.num=ini;
    this.sx = sx;
    this.sy = sy;
    this.velocidade=vel;
    this.personagem = personagem;
    this.complemento;
    
    this.prox = function() {
        if (this.num===this.frameFim){
            this.num= this.frameIni;  
        } 
        else { 
            this.num=  this.num+1;
            this.trans();
        }
    }
    this.muda = function() {
        let x = tempo/this.velocidade;
        if (x-Math.floor(x)>0) return false;
        else  return true;
        
    }
    this.trans = function() {
        if (this.complemento!==undefined) {
            this.complemento();
        }
    }
}

var fundo =  new function(){
    this.img = new Image();
    this.img.src = 'fundo.png';  
    this.sx=200;
    this.desenha = function(){
        ctx.drawImage(this.img, this.sx, 0, 400, 225, 0, 0, 400, 225);
      }  
}

var heroi =  new function(){
    let that = this;
    this.agente = new Personagem('heroi.png', 400,45, 95,50 );
    this.corrente=0;
    this.estados= new Array();
    this.estados[0] = new Estado(4,12,0,0,500, this);  
    this.estados[1] = new Estado(0,4 ,0,0,200, this);
    this.estados[2] = new Estado(13,17 ,0,0,200, this);
 
    this.estados[1].complemento=  function() {
        that.agente.x= Math.max(0, that.agente.x-5);
     console.log(that.agente.x + " " + fundo.sx);
    }
    this.estados[2].complemento=  function() {
        that.agente.x =Math.min(961 - that.agente.width, that.agente.x+5)
        console.log(that.agente.x + " " + fundo.sx);
    }
    
    this.desenha = function(){
        if ( this.estados[this.corrente].muda()) this.estados[this.corrente].prox();
        this.agente.desenha(this.estados[this.corrente].num);
    }
}

function desenha(){
    acertaJanela();
    fundo.desenha();
    heroi.desenha();
}

function acertaJanela(){
    if (heroi.agente.x-fundo.sx<0){
        fundo.sx = heroi.agente.x; 
    }else if( heroi.agente.x - fundo.sx > 400 - heroi.agente.width){
        fundo.sx += 5;
    }
}

var GameLoop = function(){
    desenha();
    setTimeout(GameLoop, intervalo);
    tempo = tempo+intervalo;
    if (tempo>maxtempo) tempo=0;
}

let ESQ=37;
let BAIXO=40;
let CIMA=38;
let DIR=39;

document.onkeydown = function(e){
    let keycode;
    if (window.event) keycode = window.event.keyCode;
    else if (e) keycode = e.which;
 
    if (keycode===BAIXO) {
        heroi.corrente=0;
    } else if(keycode===ESQ) {
        heroi.corrente=1; 
    } else if(keycode===DIR) {
        heroi.corrente=2; 
    } 
}

GameLoop();
