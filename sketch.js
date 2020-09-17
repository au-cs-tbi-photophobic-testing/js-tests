var ImX = 800; 
let X = [5];
let Y = [5];


function preload() {
  img = loadImage('Wheelbarrow_No_dots.jpg');
    img2 = loadImage('KIngs.jpg');
}

function setup() {
    createCanvas(900, 900);
    background(100);
    img.resize(ImX,0)
    img2.resize(ImX,0)
    
    button = createButton('Wheelbarrow');
  button.position(10,10);
  button.mousePressed(BarrowFunc)
    
    button2 = createButton('Kings');
  button2.position(120,10);
  button2.mousePressed(KingsFunc)
    
    
     buttonY = createButton('yes');
     buttonY.size(90,50)
     buttonY.position(625,125)
     buttonY.style('font-size', '30px', 'color', '#d4af37');
     buttonY.mousePressed(acceptFunction);
     buttonY.hide();
    
     buttonN = createButton('no');
     buttonN.size(90,50)
     buttonN.position(725,125)
     buttonN.style('font-size', '30px', 'color', '#d4af37');
     buttonN.mousePressed(resetFunction);
     buttonN.hide();
}


function mousePressed(){    
    let mX = mouseX;
    let mY = mouseY;
    
    DotImage.CheckClick(mX,mY)
    
  if (DotImage.EndFlag == 1){
         textAlign(LEFT);
         text("Finished: are you satisfied with this order?",50,160)
         buttonY.show();
       buttonN.show();
         DotImage.EndFlag=0;
    }
    
}

function acceptFunction(){
        background(100);
        buttonY.hide();
        buttonN.hide();
        background(100);
      DotImage.PrintArray();
      DotImage.LoadXY(X,Y);
      DotImage.ClearDataArray()
      DotImage.ShowXY(140);
    
}

function resetFunction(){
    DotImage.LoadXY(X,Y);
    DotImage.ClearDataArray()
  background(100);
    buttonY.hide();
    buttonN.hide();
    background(100);
    DotImage.ShowXY(140);
}

function BarrowFunc(){
    background(100);
    DotImage = new ImageClass(img,5,50,200);

    X[0] = 120;
    Y[0] = 100
    
    X[1] = 50;
    Y[1] = 450;
    
    X[2] = 300;
    Y[2] = 330
    
    X[3] = 400;
    Y[3] = 450
    
    X[4] = 700;
    Y[4] = 50;
    
    DotImage.LoadXY(X,Y);
    DotImage.ClearDataArray()
    DotImage.ShowXY(140);
    
}

function KingsFunc(){
    background(100);
    DotImage = new ImageClass(img2,5,50,200);

    X[0] = 290;
    Y[0] = 60
    
    X[1] = 270;
    Y[1] = 500;
    
    X[2] = 500;
    Y[2] = 430
    
    X[3] = 650;
    Y[3] = 170
    
    X[4] = 700;
    Y[4] = 550;
    
    DotImage.LoadXY(X,Y);
    DotImage.ClearDataArray()
    DotImage.ShowXY(140);
    
}


        
        
        
        
        
        
        
        
        
        
        

class ImageClass {
    constructor(Img,NDots,X0,Y0) {
        this.I = Img;
        this.X0 = X0;
        this.Y0 = Y0;
        this.X = [NDots];
    this.Y = [NDots];
        this.NDots = NDots;
        this.NClick = 0
        this.DataArray = [NDots];
        this.EndFlag = 0;
        this.DotSize = 30;
    }
    
    //******
    LoadXY(X,Y){
        for (let i =0; i < this.NDots; i++) {
                this.X[i] =X[i]
                this.Y[i] =Y[i]
        }
    }
    
    //******
    ShowXY(Col){
        image(this.I, this.X0, this.Y0);
      rectMode(CENTER)
        for (let i = 0; i < this.NDots; i++){
            fill(Col)
            noStroke();
            ellipseMode(CENTER)
          ellipse(this.X0+this.X[i],this.Y0+this.Y[i],this.DotSize,this.DotSize)
        }        
    }
    
    //******
    ClearDataArray(){
        for (let i = 0; i < this.NDots; i++){
                this.DataArray[i] = 0;
      }    
        this.NClick =0;
        this.EndFlag = 0;
    }

    //******
    CheckClick(mx,my){
      for (let i = 0; i < this.NDots; i++){
            if (dist(mx,my,this.X[i]+this.X0,this.Y[i]+this.Y0) < this.DotSize) {
                 if (this.DataArray[i] === 0) {
                    this.NClick++;
                    this.DataArray[i] = this.NClick;

                    fill('gold')
                    textAlign(CENTER); 
                    textSize(30)
                    text(this.NClick,this.X[i]+this.X0,this.Y[i]+this.Y0+10)
                }
            }
        }  
    
        if (this.NClick == this.NDots){
            this.EndFlag = 1;
        }
   }
    //******


    PrintArray() {
      console.log(this.DataArray);
    }
}
