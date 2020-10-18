const PARENT_ID = 'mds';

Qualtrics.SurveyEngine.addOnload(function() {
    // Qualtrics will randomly insert &nbsp; which will mess with p5 button alignment
    document.getElementById(PARENT_ID).innerHTML = '';
});

Qualtrics.SurveyEngine.addOnReady(function() {
    const s = function(p) {
        var Rad  = 80;  //length
        var Dist = 1.5*Rad;
        var Counter = 0;
        var Frequency = 1;
        var InitX = 50;
        var MaxAmP = 150;
        var ScreenH = 600;
        var ScreenW = 1200;
        var Yheight = ScreenH/3;
        var steplength = 400;
        
        var RandCondition = 0;
        
        var ContrastValue =1.0;
        var ContrastTag = 0;
        var ContRatioTag = 0;
        var EdgeTag = 0;
        
        var FR = 40;
        var TempVal, TempVal2;
        var Colony = [];
        var TrialPatternArray = [];
        
        var button;
        var SurroundVar = 1;
        
        var EdgeSize = 1;
        
        var NDiamonds = 5;
        
        var ContrastRatioCond = 1;
        
        var Chart  = [];
        var Chart1 =  [];
        var Chart2 =  [];
        var Chart3 =  [];
        var Chart4 =  [];
        var Chart5 =  [];
        
        
        
        SetUpCharts();
        Chart = Chart2;
        
        
        p.setup = function() {
            p.frameRate(FR);
            p.background(100,100,128);
            
            
            SetUpButtons();
            
            p.createCanvas(ScreenW, ScreenH);
            for (var i = 0; i < NDiamonds; i++) {
                Colony[i] = new Diamond(InitX,i,Dist,180,3.5*Rad+i*Rad*2 +i*10,i%2);
            }
            
            Button12p5func();
            ButtonEdge2func();
            ButtonContrast2func();
            ButtonChartRandFunc()
        }
        
        p.draw = function() {
            var TempVal;
            p.background(120,115,128);
            p.textAlign(p.CENTER)
            p.textSize(50);
            
            Counter = (Counter + 1)%1600;
            
            for (var i = 0; i < NDiamonds; i = i+1) {
                Colony[i].display(i,ContrastValue,ContrastRatioCond);
            }
        }
        
        function Diamond(InitX, Num, Dist, Phase,XPOS,Type) {
            this.x = XPOS;
            this.y = Yheight;
            this.speed = 1;
            var EdgesArray = [];
        
            this.display = function(DiamondNumber,Contrast,SurrContCond) {
                //four possible phases
                var Lum_0 = this.SineTime(Counter, FR, 255, Contrast, .5, 2, 0);
                var Lum_180 = this.SineTime(Counter, FR, 255, Contrast, .5, 2, 180);
                var Lum_90 = this.SineTime(Counter, FR, 255, Contrast, .5, 2, 90);
                var Lum_m90 = this.SineTime(Counter, FR, 255, Contrast, .5, 2, -90);
                
                if (SurrContCond ==0) {   //set to maximum contrast modulation for surround
                    var Lum_0_full = this.SineTime(Counter, FR, 255, .45, .5, 2, 0);
                    var Lum_180_full = this.SineTime(Counter, FR, 255, .45, .5, 2, 180);
                    //print("Surr Cont = .45");
                } else{
                    var Lum_0_full = this.SineTime(Counter, FR, 255, Math.min(SurrContCond*Contrast,.5), .5, 2, 0);
                    var Lum_180_full = this.SineTime(Counter, FR, 255,Math.min(SurrContCond*Contrast,.5), .5, 2, 180);
                    //print("min SurrContCond*Contrast = "+min(SurrContCond*Contrast,.5));
                    //print(round(Lum_180_full))
                }
                    
            
                this.SetUpEdeges(Type,TrialPatternArray[DiamondNumber],Lum_m90,Lum_0,Lum_90,Lum_180);
            
                if (Type == 0) {
                    p.fill(Lum_0_full, Lum_0_full, Lum_0_full);
                }
                if (Type == 1) {
                    p.fill(Lum_180_full, Lum_180_full,Lum_180_full);
                }  
                p.noStroke();
                p.ellipse(this.x, this.y, 2*Rad, 2*Rad);
                p.fill(128, 128, 128);
                p.noStroke();
                p.push();
                    p.translate(this.x, this.y-Rad*Math.sqrt(2)/2);
                    p.rotate(Math.PI*.25);
                    p.rect(0, 0, Rad, Rad);
                    p.rotate(-Math.PI*.25);
                p.pop();
                    p.strokeWeight(EdgeSize)
                p.push();
                    p.translate(this.x, this.y-Rad*Math.sqrt(2)/2);
                    p.rotate(Math.PI*.25);
                    p.stroke(EdgesArray[1],EdgesArray[1],EdgesArray[1]);            //Top left
                    p.line(0, 0, 0, Rad);
                    p.stroke(EdgesArray[0],EdgesArray[0],EdgesArray[0]);          //Top right
                    p. line(0, 0, Rad, 0)
                    p.rotate(-Math.PI*.25);
                p.pop();
        
                p.push();
                    p.translate(this.x, this.y+Rad*Math.sqrt(2)/2);
                    p.rotate(Math.PI*.25);   
                    p.stroke(EdgesArray[3],EdgesArray[3],EdgesArray[3]);          //bottom right
                    p.line(0, 0, 0, -Rad);
                    p.stroke(EdgesArray[2],EdgesArray[2],EdgesArray[2]);        //bottom left
                    p.line(0, 0, -Rad, 0);
                    p.rotate(-Math.PI*.25);
                p.pop();
            };
            
            this.SinePosition = function(Count, Steps, Scale, Amp, Mean, Freq, Phase) {
                var V;
                V = Scale*(Amp*Math.sin(Freq*2*3.14159*Count/Steps - Phase*3.1415/180) + Mean);
                return V;
            } 
            
            this.SineTime  = function(Count, Steps, Scale, Amp, Mean, Freq, Phase) {
                var V;
                V = Scale*(Amp*Math.sin(Freq*2*3.14159*Count/Steps - Phase*3.1415/180) + Mean);
                return V;
            }
            
            this.SetUpEdeges  = function(SurroundPhase, DirectionValue,Lum_m90,Lum_0,Lum_90,Lum_180) {
                if (SurroundPhase == 0) {
                    if (DirectionValue == 0) {  //up
                        EdgesArray[0] = Lum_m90;
                        EdgesArray[1] = Lum_m90;
                        EdgesArray[2] = Lum_90;
                        EdgesArray[3] = Lum_90;
                    }
                    if (DirectionValue == 1) {  //down
                        EdgesArray[0] = Lum_90;
                        EdgesArray[1] = Lum_90;
                        EdgesArray[2] = Lum_m90;
                        EdgesArray[3] = Lum_m90;
                    }
                    if (DirectionValue == 2) {  //Left
                        EdgesArray[0] = Lum_90;
                        EdgesArray[1] = Lum_m90;
                        EdgesArray[2] = Lum_m90;
                        EdgesArray[3] = Lum_90;
                    }
                    if (DirectionValue == 3) {  //Right
                        EdgesArray[0] = Lum_m90;
                        EdgesArray[1] = Lum_90;
                        EdgesArray[2] = Lum_90;
                        EdgesArray[3] = Lum_m90;
                    }
                    if (DirectionValue == 4) {  //Out
                        EdgesArray[0] = Lum_m90;
                        EdgesArray[1] = Lum_m90;
                        EdgesArray[2] = Lum_m90;
                        EdgesArray[3] = Lum_m90;
                    }
                    if (DirectionValue == 5) {  //In
                        EdgesArray[0] = Lum_90;
                        EdgesArray[1] = Lum_90;
                        EdgesArray[2] = Lum_90;
                        EdgesArray[3] = Lum_90;
                    }
                
                }
                if (SurroundPhase == 1) {
                    if (DirectionValue == 1) {  //Down
                        EdgesArray[0] = Lum_m90;
                        EdgesArray[1] = Lum_m90;
                        EdgesArray[2] = Lum_90;
                        EdgesArray[3] = Lum_90;
                    }
                    if (DirectionValue == 0) {  //Up
                        EdgesArray[0] = Lum_90;
                        EdgesArray[1] = Lum_90;
                        EdgesArray[2] = Lum_m90;
                        EdgesArray[3] = Lum_m90;
                    }
                    if (DirectionValue == 3) {  //Right
                        EdgesArray[0] = Lum_90;
                        EdgesArray[1] = Lum_m90;
                        EdgesArray[2] = Lum_m90;
                        EdgesArray[3] = Lum_90;
                    }
                    if (DirectionValue == 2) {  //Left
                        EdgesArray[0] = Lum_m90;
                        EdgesArray[1] = Lum_90;
                        EdgesArray[2] = Lum_90;
                        EdgesArray[3] = Lum_m90;
                    }
                    if (TrialPatternArray[0] == 5) {  //In
                        EdgesArray[0] = Lum_m90;
                        EdgesArray[1] = Lum_m90;
                        EdgesArray[2] = Lum_m90;
                        EdgesArray[3] = Lum_m90;
                    }
                    if (DirectionValue == 4) {  //Out
                        EdgesArray[0] = Lum_90;
                        EdgesArray[1] = Lum_90;
                        EdgesArray[2] = Lum_90;
                        EdgesArray[3] = Lum_90;
                    }
                }  //Type =1
            }   //this.SetUpEdeges
        };
        
        function ClearSurround(){
            if (SurroundVar ==1) {
                SurroundVar = 0;
            } else {
                SurroundVar = 1;
            }
            console.log(SurroundVar);
        }
        
        function RunTrial(){
            SelectFive(1);
        }
        
        function SelectFive(ContCondition){
        
            if (RandCondition == 1) {
                for (var i = 0; i <NDiamonds; i++) {
                TrialPatternArray[i] = Math.round(Math.random(5));
                }
            } else {
                for (var iii = 0; iii <NDiamonds; iii++) {
                //print("i ContCondition Chart[ContCondition][i] "+iii+"  "+ContCondition+"  "+Chart[ContCondition][iii])
                TrialPatternArray[iii] = Chart[ContCondition][iii];
                }
            }
            console.log("hello "+TrialPatternArray[0]+" "+TrialPatternArray[1]+" "+TrialPatternArray[2]+" "+TrialPatternArray[3]+" "+TrialPatternArray[4])
        
        }
        
        function Delay(MSec){
            var B;
            var A = millis();
            console.log(Counter)
            do {
                B = millis();
            } while ((B-A) < MSec); 
            //print(B-A+" "+Counter);
        }
        
        function SetUpButtons(){
            var ButtonHeight = 20;
            var ButtonWidth = 50;
            var StepB = ButtonHeight+5;
            var InitStep = 20;
            var InitEdgeStep = 400;
            
            var col = p.color(125,125,125,100);
            
            Button100= p.createButton('100%');
            Button100.style("background-color",col);
            Button100.style("border-color",col);
            Button100.size(ButtonWidth,ButtonHeight);
            Button100.position(20,InitStep + 0*StepB);
            Button100.mousePressed(Button100func);
            
            Button50= p.createButton('  50%');
            Button50.position(20,InitStep + 1*StepB);
            Button50.style("background-color",col);
            Button50.style("border-color",col);
            Button50.size(ButtonWidth,ButtonHeight);
            Button50.mousePressed(Button50func);
            
            Button25= p.createButton('  25%');
            Button25.position(20,InitStep + 2*StepB);
            Button25.style("background-color",col);
            Button25.style("border-color",col);
            Button25.size(ButtonWidth,ButtonHeight);
            Button25.mousePressed(Button25func);
            
            Button12p5= p.createButton('12.5%');
            Button12p5.position(20,InitStep + 3*StepB);
            Button12p5.style("background-color",col);
            Button12p5.style("border-color",col);
            Button12p5.size(ButtonWidth,ButtonHeight);
            Button12p5.mousePressed(Button12p5func);
            
            Button6= p.createButton('     6%');
            Button6.position(20,InitStep + 4*StepB);
            Button6.style("background-color",col);
            Button6.style("border-color",col);
            Button6.size(ButtonWidth,ButtonHeight);
            Button6.mousePressed(Button6func);
            
            Button3= p.createButton('   3%');
            Button3.position(20,InitStep + 5*StepB);
            Button3.style("background-color",col);
            Button3.style("border-color",col);
            Button3.size(ButtonWidth,ButtonHeight);
            Button3.mousePressed(Button3func);
            
            Button1p5= p.createButton('   1.5%');
            Button1p5.position(20,InitStep + 6*StepB);
            Button1p5.style("background-color",col);
            Button1p5.style("border-color",col);
            Button1p5.size(ButtonWidth,ButtonHeight);
            Button1p5.mousePressed(Button1p5func);
            
            Button075= p.createButton('   .075%');
            Button075.position(20,InitStep + 7*StepB);
            Button075.style("background-color",col);
            Button075.style("border-color",col);
            Button075.size(ButtonWidth,ButtonHeight);
            Button075.mousePressed(Button075func);
            
            Button0325= p.createButton('   .0325%');
            Button0325.position(20,InitStep + 8*StepB);
            Button0325.style("background-color",col);
            Button0325.style("border-color",col);
            Button0325.size(ButtonWidth,ButtonHeight);
            Button0325.mousePressed(Button0325func);
            
            Button015= p.createButton('   .015%');
            Button015.position(20,InitStep + 9*StepB);
            Button015.style("background-color",col);
            Button015.style("border-color",col);
            Button015.size(ButtonWidth,ButtonHeight);
            Button015.mousePressed(Button015func);
            
            Button007= p.createButton('   .007%');
            Button007.position(20,InitStep + 10*StepB);
            Button007.style("background-color",col);
            Button007.style("border-color",col);
            Button007.size(ButtonWidth,ButtonHeight);
            Button007.mousePressed(Button007func);
            
            
            var EdgeButtonXpos = 110;
            var ContrastRatioXpos = 175;
            var ChartXpos = 20;
            
            
            
            ButtonContrast0= p.createButton('C Max');
            ButtonContrast0.position(ContrastRatioXpos,InitEdgeStep + 0*StepB);
            ButtonContrast0.style("background-color",col);
            ButtonContrast0.style("border-color",col);
            ButtonContrast0.size(ButtonWidth+10,ButtonHeight);
            ButtonContrast0.mousePressed(ButtonContrast0func);
            
            ButtonContrast1= p.createButton('C =1x');
            ButtonContrast1.position(ContrastRatioXpos,InitEdgeStep + 4*StepB);
            ButtonContrast1.style("background-color",col);
            ButtonContrast1.style("border-color",col);
            ButtonContrast1.size(ButtonWidth+10,ButtonHeight);
            ButtonContrast1.mousePressed(ButtonContrast1func);
            
            
            ButtonContrast2= p.createButton('C=2x');
            ButtonContrast2.position(ContrastRatioXpos,InitEdgeStep + 3*StepB);
            ButtonContrast2.style("background-color",col);
            ButtonContrast2.style("border-color",col);
            ButtonContrast2.size(ButtonWidth+10,ButtonHeight);
            ButtonContrast2.mousePressed(ButtonContrast2func);
            
            
            ButtonContrast4= p.createButton('C=4x');
            ButtonContrast4.position(ContrastRatioXpos,InitEdgeStep + 2*StepB);
            ButtonContrast4.style("background-color",col);
            ButtonContrast4.style("border-color",col);
            ButtonContrast4.size(ButtonWidth+10,ButtonHeight);
            ButtonContrast4.mousePressed(ButtonContrast4func);
            
            ButtonContrast8= p.createButton('C=8x');
            ButtonContrast8.position(ContrastRatioXpos,InitEdgeStep + 1*StepB);
            ButtonContrast8.style("background-color",col);
            ButtonContrast8.style("border-color",col);
            ButtonContrast8.size(ButtonWidth+10,ButtonHeight);
            ButtonContrast8.mousePressed(ButtonContrast8func);
            
            
            //Edge width Buttons
            ButtonEdge1= p.createButton('E = 1');
            ButtonEdge1.position(EdgeButtonXpos,InitEdgeStep + 0*StepB);
            ButtonEdge1.style("background-color",col);
            ButtonEdge1.style("border-color",col);
            ButtonEdge1.size(ButtonWidth,ButtonHeight);
            ButtonEdge1.mousePressed(ButtonEdge1func);
            
            ButtonEdge2= p.createButton('E = 2');
            ButtonEdge2.position(EdgeButtonXpos,InitEdgeStep + 1*StepB);
            ButtonEdge2.style("background-color",col);
            ButtonEdge2.style("border-color",col);
            ButtonEdge2.size(ButtonWidth,ButtonHeight);
            ButtonEdge2.mousePressed(ButtonEdge2func);
            
            ButtonEdge4= p.createButton('E = 4');
            ButtonEdge4.position(EdgeButtonXpos,InitEdgeStep + 2*StepB);
            ButtonEdge4.style("background-color",col);
            ButtonEdge4.style("border-color",col);
            ButtonEdge4.size(ButtonWidth,ButtonHeight);
            ButtonEdge4.mousePressed(ButtonEdge4func);
            
            ButtonEdge8= p.createButton('E = 8');
            ButtonEdge8.position(EdgeButtonXpos,InitEdgeStep + 3*StepB);
            ButtonEdge8.style("background-color",col);
            ButtonEdge8.style("border-color",col);
            ButtonEdge8.size(ButtonWidth,ButtonHeight);
            ButtonEdge8.mousePressed(ButtonEdge8func);
            
            ButtonEdge16= p.createButton('E = 16');
            ButtonEdge16.position(EdgeButtonXpos,InitEdgeStep + 4*StepB);
            ButtonEdge16.style("background-color",col);
            ButtonEdge16.style("border-color",col);
            ButtonEdge16.size(ButtonWidth,ButtonHeight);
            ButtonEdge16.mousePressed(ButtonEdge16func);
            
            var ChartHeight = ButtonHeight;
            ButtonChartRandom= p.createButton('Random Chart');
            ButtonChartRandom.position(ChartXpos,InitEdgeStep + 5*StepB);
            ButtonChartRandom.style("background-color",col);
            ButtonChartRandom.style("border-color",col);
            ButtonChartRandom.size(ButtonWidth*1.5,ButtonHeight);
            ButtonChartRandom.mousePressed(ButtonChartRandFunc);
            
            ButtonChart1= p.createButton('Chart 1');
            ButtonChart1.position(ChartXpos,InitEdgeStep + 0*StepB);
            ButtonChart1.style("background-color",col);
            ButtonChart1.style("border-color",col);
            ButtonChart1.size(ButtonWidth*1.5,ButtonHeight);
            ButtonChart1.mousePressed(ButtonChart1Func);
            
            ButtonChart2= p.createButton('Chart 2');
            ButtonChart2.position(ChartXpos,InitEdgeStep + 1*StepB);
            ButtonChart2.style("background-color",col);
            ButtonChart2.style("border-color",col);
            ButtonChart2.size(ButtonWidth*1.5,ButtonHeight);
            ButtonChart2.mousePressed(ButtonChart2Func);
            
            ButtonChart3= p.createButton('Chart 3');
            ButtonChart3.position(ChartXpos,InitEdgeStep + 2*StepB);
            ButtonChart3.style("background-color",col);
            ButtonChart3.style("border-color",col);
            ButtonChart3.size(ButtonWidth*1.5,ButtonHeight);
            ButtonChart3.mousePressed(ButtonChart3Func);
            
            ButtonChart4= p.createButton('Chart 4');
            ButtonChart4.position(ChartXpos,InitEdgeStep + 3*StepB);
            ButtonChart4.style("background-color",col);
            ButtonChart4.style("border-color",col);
            ButtonChart4.size(ButtonWidth*1.5,ButtonHeight);
            ButtonChart4.mousePressed(ButtonChart4Func);
            
            ButtonChart5= p.createButton('Chart 5');
            ButtonChart5.position(ChartXpos,InitEdgeStep + 4*StepB);
            ButtonChart5.style("background-color",col);
            ButtonChart5.style("border-color",col);
            ButtonChart5.size(ButtonWidth*1.5,ButtonHeight);
            ButtonChart5.mousePressed(ButtonChart5Func);
        }
        
        
        //***Contrast Buttons  
        function Button100func(){   ContrastValue =.45;   SelectFive(0);  ContrastTag = 0; ContrastHL();};
        function Button50func(){    ContrastValue =.297;  SelectFive(1);  ContrastTag = 1; ContrastHL();};
        function Button25func(){    ContrastValue =.196;  SelectFive(2);  ContrastTag = 2; ContrastHL();};
        function Button12p5func(){  ContrastValue =.129;  SelectFive(3);  ContrastTag = 3; ContrastHL();};
        function Button6func(){     ContrastValue =.085;  SelectFive(4);  ContrastTag = 4; ContrastHL();};
        function Button3func(){     ContrastValue =.056;  SelectFive(5);  ContrastTag = 5; ContrastHL();};
        function Button1p5func(){   ContrastValue =.037;  SelectFive(6);  ContrastTag = 6; ContrastHL();};
        function Button075func(){   ContrastValue =.024;  SelectFive(7);  ContrastTag = 7; ContrastHL();};
        function Button0325func(){  ContrastValue =.016;  SelectFive(8);  ContrastTag = 8; ContrastHL();};
        function Button015func(){   ContrastValue =0.011; SelectFive(9);  ContrastTag = 9; ContrastHL();};
        function Button007func(){   ContrastValue =0.007; SelectFive(10); ContrastTag = 10;ContrastHL();};
        
        function ButtonEdge1func(){  EdgeSize = 1; EdgeTag =0; EdgeHL();};
        function ButtonEdge2func(){  EdgeSize = 2; EdgeTag =1; EdgeHL();};
        function ButtonEdge4func(){  EdgeSize = 4; EdgeTag =2; EdgeHL();};
        function ButtonEdge8func(){  EdgeSize = 8; EdgeTag =3; EdgeHL();};
        function ButtonEdge16func(){ EdgeSize = 16;EdgeTag =4; EdgeHL();};
        
        function ButtonContrast0func(){ ContrastRatioCond = 0; ContRatioTag =0;ContRatioHL()};
        function ButtonContrast1func(){ ContrastRatioCond = 1; ContRatioTag =1;ContRatioHL()};
        function ButtonContrast2func(){ ContrastRatioCond = 2; ContRatioTag =2;ContRatioHL()};
        function ButtonContrast4func(){ ContrastRatioCond = 4; ContRatioTag =3;ContRatioHL()};
        function ButtonContrast8func(){ ContrastRatioCond = 8; ContRatioTag =4;ContRatioHL()};
        
        function ButtonChartRandFunc(){console.log("random");RandCondition = 1; ChartTag = 0; SelectFive(ContrastTag);ChartHL();} 
        function ButtonChart1Func(){console.log("CH1");RandCondition = 0; ChartTag = 1; Chart = Chart1; SelectFive(ContrastTag);ChartHL();} 
        function ButtonChart2Func(){RandCondition = 0; ChartTag = 2; Chart = Chart2; SelectFive(ContrastTag);ChartHL();} 
        function ButtonChart3Func(){RandCondition = 0; ChartTag = 3; Chart = Chart3; SelectFive(ContrastTag);ChartHL();} 
        function ButtonChart4Func(){RandCondition = 0; ChartTag = 4; Chart = Chart4; SelectFive(ContrastTag); ChartHL();} 
        function ButtonChart5Func(){RandCondition = 0; ChartTag = 5; Chart = Chart5; SelectFive(ContrastTag); ChartHL(); } 
        
        
        function ChartHL(){
        var ColSet = [];
            var col = p.color(125,125,125,100);
            var colHighlight = p.color(125,255,125,100);
            
            for (var i=0; i<6; i++) {
                ColSet[i] = col;
            }
            ColSet[ChartTag] =  colHighlight;
            
            ButtonChartRandom.style("border-color",ColSet[0]);
            ButtonChart1.style("border-color",ColSet[1]);
            ButtonChart2.style("border-color",ColSet[2]);
            ButtonChart3.style("border-color",ColSet[3]);
            ButtonChart4.style("border-color",ColSet[4]);
            ButtonChart5.style("border-color",ColSet[5]);
        }
        
        
        function ContRatioHL(){
            var ColSet = [];
            var col = p.color(125,125,125,100);
            var colHighlight = p.color(125,255,125,100);
            
            for (var i=0; i<5; i++) {
                ColSet[i] = col;
            }
            ColSet[ContRatioTag] =  colHighlight;
            
            ButtonContrast0.style("border-color",ColSet[0]);
            ButtonContrast1.style("border-color",ColSet[1]);
            ButtonContrast2.style("border-color",ColSet[2]);
            ButtonContrast4.style("border-color",ColSet[3]);
            ButtonContrast8.style("border-color",ColSet[4]);
        }
        
        function EdgeHL(){
            var ColSet = [];
            var col = p.color(125,125,125,100);
            var colHighlight = p.color(125,255,125,100);
            
            for (var i=0; i<5; i++) {
                ColSet[i] = col;
            }
            ColSet[EdgeTag] =  colHighlight;
            
            ButtonEdge1.style("border-color",ColSet[0]);
            ButtonEdge2.style("border-color",ColSet[1]);
            ButtonEdge4.style("border-color",ColSet[2]);
            ButtonEdge8.style("border-color",ColSet[3]);
            ButtonEdge16.style("border-color",ColSet[4]);
        }
        
        
        function ContrastHL(){
            var ColSet = [];
            var col = p.color(125,125,125,100);
            var colHighlight = p.color(125,255,125,100);
            
            for (var i=0; i<11; i++) {
                ColSet[i] = col;
            }
            ColSet[ContrastTag] =  colHighlight;
            
            Button100.style("border-color",ColSet[0]);
            Button50.style("border-color",ColSet[1]);
            Button25.style("border-color",ColSet[2]);
            Button12p5.style("border-color",ColSet[3]);
            Button6.style("border-color",ColSet[4]);
            Button3.style("border-color",ColSet[5]);
            Button1p5.style("border-color",ColSet[6]);
            Button075.style("border-color",ColSet[7]);
            Button0325.style("border-color",ColSet[8]);
            Button015.style("border-color",ColSet[9]);
            Button007.style("border-color",ColSet[10]);
        }
            
            
        function SetUpCharts() 
        {
            Chart1 =  [[5,    4,  2,  1,  3],
            [4, 2,  2,  2,  1],
            [5, 0,  3,  0,  5],
            [0, 3,  2,  1,  2],
            [4, 5,  5,  5,  1],
            [1, 2,  5,  1,  5],
            [3, 3,  2,  4,  0],
            [4, 1,  3,  0,  5],
            [5, 1,  5,  5,  2],
            [2, 1,  4,  1,  3],
            [4, 3,  1,  2,  3]];
            
            Chart2 =  [[4,  3,  2,  4,  3],
            [1, 1,  1,  0,  1],
            [4, 0,  2,  0,  2],
            [0, 3,  2,  1,  2],
            [0, 2,  1,  0,  2],
            [3, 2,  1,  0,  0],
            [0, 0,  4,  0,  2],
            [3, 3,  2,  1,  0],
            [1, 1,  3,  0,  3],
            [1, 0,  1,  0,  0],
            [1, 1,  0,  0,  3]];
            
            
            Chart3 =  [[5,  4,  2,  2,  3],
            [2, 1,  0,  0,  0],
            [4, 0,  0,  0,  0],
            [0, 2,  2,  0,  0],
            [0, 0,  4,  1,  1],
            [0, 1,  3,  1,  2],
            [0, 1,  2,  0,  0],
            [2, 1,  0,  0,  3],
            [3, 0,  3,  0,  0],
            [1, 1,  0,  0,  0],
            [1, 0,  0,  0,  1]];
            
            
            Chart4 =  [[3,  3,  4,  5,  1],
            [1, 1,  2,  1,  1],
            [4, 5,  3,  2,  1],
            [0, 0,  1,  3,  1],
            [1, 4,  4,  4,  2],
            [5, 1,  5,  0,  2],
            [0, 2,  5,  1,  2],
            [2, 1,  1,  2,  3],
            [2, 1,  2,  3,  3],
            [2, 0,  3,  5,  3],
            [1, 1,  4,  4,  4]];
            
            
            Chart5 =  [[1,  3,  5,  0,  2],
            [2, 4,  0,  1,  3],
            [1, 1,  1,  2,  1],
            [3, 4,  5,  0,  1],
            [2, 3,  3,  4,  4],
            [3, 3,  3,  3,  3],
            [0, 1,  2,  3,  4],
            [5, 4,  3,  2,  2],
            [2, 4,  3,  1,  5],
            [2, 2,  1,  1,  1],
            [3, 3,  5,  5,  2]];
        }
    }

    new p5(s, PARENT_ID);
});
