const s = (p) => {
    let ImX = 800;
    let X = [5];
    let Y = [5];
    let DotImage = null;

    p.preload = function() {
        img = p.loadImage('Wheelbarrow_No_dots.jpg');
        img2 = p.loadImage('KIngs.jpg');
        // img = p.loadImage('https://american.co1.qualtrics.com/WRQualtricsControlPanel/File.php?F=F_3WLViHzNu60vthr');
        // img2 = p.loadImage('https://american.co1.qualtrics.com/WRQualtricsControlPanel/File.php?F=F_6LiALruzvScIvrf');
    }

    p.setup = function() {
        p.createCanvas(900, 900);
        p.background(100);
        img.resize(ImX, 0);
        img2.resize(ImX, 0);

        button = p.createButton('Wheelbarrow');
        button.position(10, 10);
        button.mousePressed(BarrowFunc);

        button2 = p.createButton('Kings');
        button2.position(120, 10);
        button2.mousePressed(KingsFunc);

        buttonY = p.createButton('yes');
        buttonY.size(90, 50);
        buttonY.position(625, 125);
        buttonY.style('font-size', '30px', 'color', '#d4af37');
        buttonY.mousePressed(acceptFunction);
        buttonY.hide();

        buttonN = p.createButton('no');
        buttonN.size(90, 50);
        buttonN.position(725, 125);
        buttonN.style('font-size', '30px', 'color', '#d4af37');
        buttonN.mousePressed(resetFunction);
        buttonN.hide();
    }

    p.mousePressed = function() {
        let mX = p.mouseX;
        let mY = p.mouseY;

        if (DotImage !== null) {
            DotImage.CheckClick(mX, mY);
            if (DotImage.EndFlag == 1) {
                p.textAlign(p.LEFT);
                p.text("Finished: are you satisfied with this order?", 50, 160);
                buttonY.show();
                buttonN.show();
                DotImage.EndFlag = 0;
            }
        }
    }

    let acceptFunction = function() {
        p.background(100);
        buttonY.hide();
        buttonN.hide();
        p.background(100);

        DotImage.PrintArray();
        DotImage.LoadXY(X, Y);
        DotImage.ClearDataArray();
        DotImage.ShowXY(140);
    }

    let resetFunction = function() {
        DotImage.LoadXY(X,Y);
        DotImage.ClearDataArray()
        p.background(100);
        buttonY.hide();
        buttonN.hide();
        p.background(100);
        DotImage.ShowXY(140);
    }

    let BarrowFunc = function() {
        p.background(100);
        DotImage = new ImageClass(img, 5, 50, 200);

        X[0] = 120;
        Y[0] = 100;

        X[1] = 50;
        Y[1] = 450;

        X[2] = 300;
        Y[2] = 330;

        X[3] = 400;
        Y[3] = 450;

        X[4] = 700;
        Y[4] = 50;

        DotImage.LoadXY(X, Y);
        DotImage.ClearDataArray();
        DotImage.ShowXY(140);
    }

    let KingsFunc = function() {
        p.background(100);
        DotImage = new ImageClass(img2, 5, 50, 200);

        X[0] = 290;
        Y[0] = 60;

        X[1] = 270;
        Y[1] = 500;

        X[2] = 500;
        Y[2] = 430;

        X[3] = 650;
        Y[3] = 170;

        X[4] = 700;
        Y[4] = 550;

        DotImage.LoadXY(X, Y);
        DotImage.ClearDataArray();
        DotImage.ShowXY(140);
    }

    class ImageClass {
        constructor(Img, NDots, X0, Y0) {
            this.I = Img;
            this.X0 = X0;
            this.Y0 = Y0;
            this.X = [NDots];
            this.Y = [NDots];
            this.NDots = NDots;
            this.NClick = 0;
            this.DataArray = [NDots];
            this.EndFlag = 0;
            this.DotSize = 30;
        }

        LoadXY(X, Y) {
            for (let i = 0; i < this.NDots; i++) {
                this.X[i] = X[i];
                this.Y[i] = Y[i];
            }
        }

        ShowXY(Col) {
            p.image(this.I, this.X0, this.Y0);
            p.rectMode(p.CENTER);
            for (let i = 0; i < this.NDots; i++) {
                p.fill(Col);
                p.noStroke();
                p.ellipseMode(p.CENTER);
                p.ellipse(this.X0 + this.X[i], this.Y0 + this.Y[i], this.DotSize, this.DotSize);
            }
        }

        ClearDataArray() {
            for (let i = 0; i < this.NDots; i++) {
                this.DataArray[i] = 0;
            }
            this.NClick = 0;
            this.EndFlag = 0;
        }

        CheckClick(mx, my) {
            for (let i = 0; i < this.NDots; i++) {
                if (p.dist(mx, my, this.X[i] + this.X0, this.Y[i] + this.Y0) < this.DotSize) {
                    if (this.DataArray[i] === 0) {
                        this.NClick++;
                        this.DataArray[i] = this.NClick;

                        p.fill('gold');
                        p.textAlign(p.CENTER);
                        p.textSize(30);
                        p.text(this.NClick, this.X[i] + this.X0, this.Y[i] + this.Y0 + 10);
                    }
                }
            }

            if (this.NClick == this.NDots) {
                this.EndFlag = 1;
            }
        }

        PrintArray() {
            console.log(this.DataArray);
        }
    }
}

new p5(s);