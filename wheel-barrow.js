const PARENT_ID = 'wheelbarrow';

const filter_applied = 90;

const EMBEDDED_DATA = 'wheel-data';

const INSTRUCTIONS = 'Click the dots in order from darkest to lightest';

const IMAGE = 'https://american.co1.qualtrics.com/WRQualtricsControlPanel/File.php?F=F_3WLViHzNu60vthr';

// dot coords in order from darkest to brightest
const c1 = [300,330]
const c2 = [700,50]
const c3 = [120,100]
const c4 = [95,450]
const c5 = [400,450]

const LOCATIONS = [
    c1,c2,c3,c4,c5
];

DOT_SIZE = 30;
 
TEXT_SIZE = 30;

const BACKGROUND_COLOR = 85;

const DOT_COLOR = 160;

const TEXT_COLOR = '#D4AF37';

Qualtrics.SurveyEngine.addOnload(function() {
    // Qualtrics will randomly insert &nbsp; which will mess with p5 button alignment
    document.getElementById(PARENT_ID).innerHTML = '';
});

Qualtrics.SurveyEngine.addOnReady(function() {
    document.getElementById('NextButton').disabled = true;
	
	const s = function(p) {
        let img = null;
        let dotImage = null;
        let buttonY = null;
        let buttonN = null;
		let buttonH = null;

        p.preload = function() {
            img = p.loadImage(IMAGE);
        }

        p.setup = function() {
            p.createCanvas(900, 900);
            p.background(BACKGROUND_COLOR);
            img.resize(800, 0);

            instructions();
            dotImage = new Image(img, 50, 200);
            dotImage.showXY(DOT_COLOR);

            buttonY = p.createButton('yes');
            buttonY.size(90, 50);
            buttonY.position(625, 125);
            buttonY.parent(PARENT_ID);
            buttonY.style('font-size', '30px', 'color', TEXT_COLOR);
            buttonY.mousePressed(accept);
            buttonY.hide();

            buttonN = p.createButton('no');
            buttonN.size(90, 50);
            buttonN.position(725, 125);
            buttonN.parent(PARENT_ID);
            buttonN.style('font-size', '30px', 'color', TEXT_COLOR);
       		buttonN.mousePressed(reset);
            buttonN.hide();
		
			buttonH = p.createButton("Can't find a dot?");
            buttonH.size(300, 50);
            buttonH.position(100, 125);
            buttonH.parent(PARENT_ID);
            buttonH.style('font-size', '30px', 'color', TEXT_COLOR);
		//	buttonH.mousePressed(highlight);
		
			           		
			
        }
		
		p.draw = function(){
			buttonH.mousePressed(highlight);
			buttonH.mouseReleased(unhighlight);
			
		}

        p.mousePressed = function() {
            let mx = p.mouseX;
            let my = p.mouseY;

            if (dotImage !== null) {
                dotImage.checkClick(mx, my);
                if (dotImage.end === true) {
                    p.textAlign(p.LEFT);
                    p.text("Finished: are you satisfied with this order?", 50, 160);
                    buttonY.show();
                    buttonN.show();
					buttonH.hide();
                    dotImage.end = false;
                }
            }
        }

        const instructions = function() {
            p.fill(TEXT_COLOR);
            p.textAlign(p.LEFT);
            p.textSize(TEXT_SIZE);
            p.text(INSTRUCTIONS, 50, 100);
        }

        const accept = function() {
            p.background(255);
            buttonY.hide();
            buttonN.hide();
            dotImage.print();
            dotImage.reset();

            p.resizeCanvas(900, 200);
            p.textSize(20);
            p.textAlign(p.LEFT);
            p.text('Response logged. Please click button on the bottom right to continue.', 0, 100);
        }
		
		const highlight = function(){
			dotImage.highlight();
			
		}
		const unhighlight = function(){
			dotImage.unhighlight();
			
		}

        const reset = function() {
            p.background(BACKGROUND_COLOR);
            dotImage.reset();
            buttonY.hide();
            buttonN.hide();
			buttonH.show();
            instructions();
            dotImage.showXY(DOT_COLOR);
        }
		
		
		function draw(){
				if (keyIsPressed === true) {
				highlight;
				
				}

			
		}
	
		

						  

        class Image {
            constructor(img, imgX, imgY) {
                this.img = img;
                this.imgX = imgX;
                this.imgY = imgY;
                this.nDots = LOCATIONS.length;
                this.dotSize = DOT_SIZE;
                this.reset();
				this.highlight();
            }

            showXY(color) {
                p.image(this.img, this.imgX, this.imgY);
            	p.fill(color);   
				p.ellipseMode(p.CENTER);
                p.noStroke();
                for (let i = 0; i < this.nDots; i++) {
                    p.ellipse(LOCATIONS[i][0] + this.imgX, LOCATIONS[i][1] + this.imgY, this.dotSize, this.dotSize);
                }
            }

            reset() {
                this.data = [];
                for (let i = 0; i < this.nDots; i++) {
                    this.data[i] = 0;
                }
                this.nClick = 0;
                this.end = false;
            }

            checkClick(mx, my) {
                for (let i = 0; i < this.nDots; i++) {
                    if (p.dist(mx, my, LOCATIONS[i][0] + this.imgX, LOCATIONS[i][1] + this.imgY) < this.dotSize) {
                        if (this.data[i] === 0) {
                            this.nClick++;
                            this.data[i] = this.nClick;
                        }

                        p.fill(TEXT_COLOR);
                        p.textAlign(p.CENTER);
                        p.textSize(TEXT_SIZE);
                        p.text(this.nClick, LOCATIONS[i][0] + this.imgX, LOCATIONS[i][1] + this.imgY + 10);
                    }
                }

                if (this.nClick === this.nDots) {
                    this.end = true;
                }
            }
	
			highlight(){
				p.fill(255, 239, 0,72);
				for(var i = 0; i < 5; i++){
					if(this.data[i] == 0){
						p.ellipse(LOCATIONS[i][0]+ this.imgX, LOCATIONS[i][1] + this.imgY, this.dotSize , this.dotSize );				
				}
			}
					
				p.fill(160);
				
		}
	unhighlight(){
		p.fill(160);
		for(var i = 0; i < 5; i++){
					if(this.data[i] == 0){
						p.ellipse(LOCATIONS[i][0]+ this.imgX, LOCATIONS[i][1] + this.imgY, this.dotSize , this.dotSize );				
				}
		
	}
	}

	

            print() {
                console.log(this.data);
                Qualtrics.SurveyEngine.setEmbeddedData(EMBEDDED_DATA, this.data.toString());
                document.getElementById('NextButton').disabled = false;
            }
        }
    }

    new p5(s, PARENT_ID);
});
