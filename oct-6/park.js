const PARENT_ID = 'park';

const EMBEDDED_DATA = 'park-data';

const INSTRUCTIONS = 'Click the dots in order from darkest to lightest';

const IMAGE = 'https://american.co1.qualtrics.com/WRQualtricsControlPanel/File.php?F=F_brSLpoOFNET1Ltb';

const c1 =  [50, 300];
const c2 = [108, 530];
const c3 =[550,107];
const c4 = [450,300];
const c5 = [75,1000];

const LOCATIONS = [
  c1,c2,c3,c4,c5
];


DOT_SIZE = 30;

TEXT_SIZE = 30;

const BACKGROUND_COLOR = 100;

const DOT_COLOR = 140;

const TEXT_COLOR = '#D4AF37';

Qualtrics.SurveyEngine.addOnload(function() {
    // Qualtrics will randomly insert &nbsp; which will mess with p5 button alignment
    document.getElementById(PARENT_ID).innerHTML = '';
});

Qualtrics.SurveyEngine.addOnReady(function() {
    const s = function(p) {
        let img = null;
        let dotImage = null;
        let buttonY = null;
        let buttonN = null;

        p.preload = function() {
            img = p.loadImage(IMAGE);
        }

        p.setup = function() {
            p.createCanvas(900,1200);
            p.background(BACKGROUND_COLOR);
            img.resize(800, 0);

            
            dotImage = new Image(img,50,100);
			instructions();
            dotImage.showXY(DOT_COLOR);

            buttonY = p.createButton('yes');
            buttonY.size(80, 40);
            buttonY.position(625, 55);
            buttonY.parent(PARENT_ID);
            buttonY.style('font-size', '30px', 'color', TEXT_COLOR);
            buttonY.mousePressed(accept);
            buttonY.hide();

            buttonN = p.createButton('no');
            buttonN.size(80, 40);
            buttonN.position(725, 55);
            buttonN.parent(PARENT_ID);
            buttonN.style('font-size', '30px', 'color', TEXT_COLOR);
            buttonN.mousePressed(reset);
            buttonN.hide();
        }

        p.mousePressed = function() {
            let mx = p.mouseX;
            let my = p.mouseY;

            if (dotImage !== null) {
                dotImage.checkClick(mx, my);
                if (dotImage.end === true) {
                    p.textAlign(p.LEFT);
                    p.text("Finished: are you satisfied with this order?", 50, 90);
                    buttonY.show();
                    buttonN.show();
                    dotImage.end = false;
                }
            }
        }

        const instructions = function() {
            p.fill(TEXT_COLOR);
            p.textAlign(p.LEFT);
            p.textSize(TEXT_SIZE);
            p.text(INSTRUCTIONS, 50, 50);
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

        const reset = function() {
            p.background(BACKGROUND_COLOR);
            dotImage.reset();
            buttonY.hide();
            buttonN.hide();
            instructions();
            dotImage.showXY(DOT_COLOR);
        }

        class Image {
            constructor(img, imgX, imgY) {
                this.img = img;
                this.imgX = imgX;
                this.imgY = imgY;
                this.nDots = LOCATIONS.length;
                this.dotSize = DOT_SIZE;
                this.reset();
            }

            showXY(color) {
                p.image(this.img, this.imgX, this.imgY);
                p.ellipseMode(p.CENTER);
                p.fill(color);
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

            print() {
                console.log(this.data);
                Qualtrics.SurveyEngine.setEmbeddedData(EMBEDDED_DATA, this.data.toString());
            }
        }
    }

    new p5(s, PARENT_ID);
});
