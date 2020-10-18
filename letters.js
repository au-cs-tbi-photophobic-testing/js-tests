const PARENT_ID = 'letters';

Qualtrics.SurveyEngine.addOnload(function() {
    // Qualtrics will randomly insert &nbsp; which will mess with p5 button alignment
    document.getElementById(PARENT_ID).innerHTML = '';
});

Qualtrics.SurveyEngine.addOnReady(function() {
    const s = function(p) {
        let timePerCycle = 3;
        let fr = 30;
        let button;
        let posorneg = -1; 
        let BrightDark = -1;
        let Conditions = [];
        let CT = 0;
        let EndFlag = 0;
        let letterArray = [ 'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
        let TestLetters = [];
        
        let H = 800;
        let W = 800;
        let ContrastValue = 1.0;
        
        
        p.setup = function() {
            p.createCanvas(W, H);
            p.frameRate(fr)
            p.rectMode(p.CENTER)
            
            button = p.createButton('Set');
            button.position( W-100,19);
            button.mousePressed(NextFunc);
            
            Conditions[0] = new ConditionClass(128, 0.80, -1, -1);
            Conditions[1] = new ConditionClass(64, 0.80, -1, -1);
            Conditions[2] = new ConditionClass(0, 0.80, -1, -1);
            Conditions[3] = new ConditionClass(128, 0.90, -1, -1);
            Conditions[4] = new ConditionClass(64, 0.90, -1, -1);
            Conditions[5] = new ConditionClass(0, 0.90, -1, -1);
            
            TestLetters = p.shuffle(letterArray);
            
            SetUpButtons();
            ContrastHL(0);
        }
         
        p.draw = function() {
            p.background(120,115,128);
            
            if (EndFlag == 0) {
                p.fill(Conditions[CT].BackColor);
                p.rect(p.width / 2, p.height / 2, p.width, p.height);
            
                p.noStroke();
            
                let L1 = Conditions[CT].BGStep + Conditions[CT].posorneg * ContrastValue * Conditions[CT].BG2;
                let L2 = Conditions[CT].BGStep + Conditions[CT].posorneg * ContrastValue * 0.8 * Conditions[CT].BG2;
                let L3 = Conditions[CT].BGStep + Conditions[CT].posorneg * ContrastValue * 0.6 * Conditions[CT].BG2;
                let L4 = Conditions[CT].BGStep + Conditions[CT].posorneg * ContrastValue * 0.3 * Conditions[CT].BG2;
                let L5 = Conditions[CT].BGStep + Conditions[CT].posorneg * ContrastValue * 0.15 * Conditions[CT].BG2;
                  
                PrintTextonScreen(L1, L2, L3, L4, L5);

                T = p.frameCount % fr * timePerCycle;
                let starttime = Conditions[CT].Time * fr * timePerCycle;
                
                p.textSize(40);
                if (T > starttime) { 
                    p.fill(Conditions[CT].BGStep);
                    p.rect(p.width / 2, p.height / 2, 550, 200);
                    p.fill(L1);
                    p.text(TestLetters[0], p.width / 2 - 150, p.height / 2);
                    p.fill(L2);
                    p.text(TestLetters[1], p.width / 2 - 75, p.height / 2);
                    p.fill(L3);
                    p.text(TestLetters[2], p.width / 2, p.height / 2);
                    p.fill(L4);
                    p.text(TestLetters[3], p.width / 2 + 75, p.height / 2);
                    p.fill(L5);
                    p.text(TestLetters[4], p.width / 2 + 150, p.height / 2);
                }
            } else {
                p.text('End',150,65)	
                p.noLoop();
            }
        }
        
        function NextFunc() {
            Conditions[CT].Resp = ContrastValue;
            CT++;
            TestLetters = p.shuffle(letterArray)
            if (CT < Conditions.length) {
                EndFlag = 0
                ContrastValue = 1.0;
                ContrastHL(0)
            } else {
                EndFlag = 1;
                button.hide();
                PrintResults();
            }
        }
        
        function PrintResults(){
            for (let i = 0; i < Conditions.length; i++) {
                print('flash ' + Conditions[i].BGStep + '\t\t\t' + 'Time ' + Conditions[i].Time + ' Setting ' + Conditions[i].Resp);
            }
        }
        
        function PrintTextonScreen(L1, L2, L3, L4, L5) {            
            p.fill(128)
            p.textSize(12);
            p.text(Conditions[CT].posorneg * ContrastValue, W - 50, 35);
            p.text(Conditions[CT].BGStep, 200, 10);
            p.text(L1.toFixed(1), 250, 10);
            p.text(L2.toFixed(1), 300, 10);
            p.text(L3.toFixed(1), 350, 10);
            p.text(L4.toFixed(1), 400, 10);
            p.text(L5.toFixed(1), 450, 10);
        }
        
        class ConditionClass {
            constructor(BGstep, Time, BRorDA, Polarity) {
                this.BG2 = 128;
                this.Time = Time;   // .8 or .9
                this.Resp = -1;
                this.BrightDark = BRorDA;   // -1 or 1
                this.posorneg = Polarity;   // -1 or 1
                    
                if (this.BrightDark == -1) {
                    this.BGStep = 255 - BGstep;   // BGStep should equal 0, 64, 128
                    this.BackColor = 0;
                } else {
                    this.BGStep = BGstep;
                    this.BackColor = 255;
                }    
            }
        }
        
        let ButtonHeight = 20;
        let ButtonWidth = 50;
        let StepB = ButtonHeight + 5;
        let InitStep = 20;
        
        function SetUpButtons(){
            p.colorMode(p.RGB)
            let col = p.color(180, 180, 250, 120);
           
            Button100 = p.createButton('1.00');
            Button100.style('background-color', col);
            Button100.style('border-color', col);
            Button100.size(ButtonWidth, ButtonHeight);
            Button100.position(20, InitStep + 0 * StepB);
            Button100.mousePressed(Button100func);
        
            Button90 = p.createButton('  .90');
            Button90.position(20, InitStep + 1 * StepB);
            Button90.style('background-color', col);
            Button90.style('border-color', col);
            Button90.size(ButtonWidth, ButtonHeight);
            Button90.mousePressed(Button90func);
            
            Button80 = p.createButton('  .80');
            Button80.position(20, InitStep + 2 * StepB);
            Button80.style('background-color', col);
            Button80.style('border-color', col);
            Button80.size(ButtonWidth, ButtonHeight);
            Button80.mousePressed(Button80func);
            
            Button70 = p.createButton('.70');
            Button70.position(20, InitStep + 3 * StepB);
            Button70.style('background-color', col);
            Button70.style('border-color', col);
            Button70.size(ButtonWidth, ButtonHeight);
            Button70.mousePressed(Button70func);
            
            Button60 = p.createButton('  .60');
            Button60.position(20, InitStep + 4 * StepB);
            Button60.style('background-color', col);
            Button60.style('border-color', col);
            Button60.size(ButtonWidth, ButtonHeight);
            Button60.mousePressed(Button60func);
            
            Button50 = p.createButton(' .50');
            Button50.position(20, InitStep + 5 * StepB);
            Button50.style('background-color', col);
            Button50.style('border-color', col);
            Button50.size(ButtonWidth, ButtonHeight);
            Button50.mousePressed(Button50func);
            
            Button40 = p.createButton('   .40');
            Button40.position(20, InitStep + 6 * StepB);
            Button40.style('background-color', col);
            Button40.style('border-color', col);
            Button40.size(ButtonWidth, ButtonHeight);
            Button40.mousePressed(Button40func);
            
            Button30 = p.createButton('   .30');
            Button30.position(20, InitStep + 7 * StepB);
            Button30.style('background-color', col);
            Button30.style('border-color', col);
            Button30.size(ButtonWidth, ButtonHeight);
            Button30.mousePressed(Button30func);
            
            Button20 = p.createButton('   .20');
            Button20.position(20, InitStep + 8 * StepB);
            Button20.style('background-color', col);
            Button20.style('border-color', col);
            Button20.size(ButtonWidth, ButtonHeight);
            Button20.mousePressed(Button20func);
            
            Button10 = p.createButton('   .10');
            Button10.position(20, InitStep + 9 * StepB);
            Button10.style('background-color', col);
            Button10.style('border-color', col);
            Button10.size(ButtonWidth, ButtonHeight);
            Button10.mousePressed(Button10func);
            
            Button05 = p.createButton('.05');
            Button05.position(20, InitStep + 10 * StepB);
            Button05.style('background-color', col);
            Button05.style('border-color', col);
            Button05.size(ButtonWidth, ButtonHeight);
            Button05.mousePressed(Button05func);
            
            ContrastHL();
        }
       
       
       function Button100func() {
           ContrastValue = 1.00;
           SelectFive(0);
           ContrastHL(0);
        };
       function Button90func() {
           ContrastValue = 0.9;
           SelectFive(1);
           ContrastHL(1);
        };
       function Button80func() {
           ContrastValue = 0.8;
           SelectFive(2);
           ContrastHL(2);
        };
        function Button70func() {
           ContrastValue = 0.7;
           SelectFive(3);
           ContrastHL(3);
        };
        function Button60func() {
            ContrastValue = 0.6;
            SelectFive(4);
            ContrastHL(4);
        };
        function Button50func() {
            ContrastValue = 0.5;
            SelectFive(5);
            ContrastHL(5)
        };
        function Button40func() {
            ContrastValue = 0.4;
            SelectFive(6);
            ContrastHL(6);
        };
        function Button30func() {
            ContrastValue = 0.3;
            SelectFive(7);
            ContrastHL(7);
        };
        function Button20func() {
            ContrastValue = 0.2;
            SelectFive(8);
            ContrastHL(8);
        };
        function Button10func() {
            ContrastValue = 0.1;
            SelectFive(9);
            ContrastHL(9);
        };
        function Button05func() {
            ContrastValue = 0.05;
            SelectFive(10);
            ContrastHL(10);
        };
        
        function SelectFive(a) {
            TestLetters = p.shuffle(letterArray);
        }

        function ContrastHL(ContrastTag) {
            p.colorMode(p.RGB)
            let ColSet = [];
            let col = p.color(180, 180, 250, 120);
            let colHighlight = p.color(100, 100, 130, 200);
        
            for (let i = 0; i < 11; i++) {
                ColSet[i] = col;
            }
            ColSet[ContrastTag] = colHighlight;
        
            Button100.style('border-color', ColSet[0]);
            Button90.style('border-color', ColSet[1]);
            Button80.style('border-color', ColSet[2]);
            Button70.style('border-color', ColSet[3]);
            Button60.style('border-color', ColSet[4]);
            Button50.style('border-color', ColSet[5]);
            Button40.style('border-color', ColSet[6]);
            Button30.style('border-color', ColSet[7]);
            Button20.style('border-color', ColSet[8]);
            Button10.style('border-color', ColSet[9]);
            Button05.style('border-color', ColSet[10]);
        }
    }

    new p5(s, PARENT_ID);
});
