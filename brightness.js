const PARENT_ID = 'brightness';

Qualtrics.SurveyEngine.addOnload(function()
{
    // Qualtrics will randomly insert &nbsp; which will mess with p5 button alignment
    document.getElementById(PARENT_ID).innerHTML = '';
});

Qualtrics.SurveyEngine.addOnReady(function()
{
    const s = function(p) {
        const backcolor = 255;
        let MLDSstim = null;

        p.setup = function() {
            p.createCanvas(600, 600);
            p.background(100);
            p.fill(255);
            p.rect(0, 0, p.width, p.height);

            const StimArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

            MLDSstim = new MLDS_present(StimArray);
            MLDSstim.PrintPerumtationsArray();
            MLDSstim.presentBright(backcolor);

            const Lbutton = p.createButton('Center is more similar to Left');
            Lbutton.position(0.15 * p.width, 0.75 * p.height);
            Lbutton.mousePressed(LeftPress);

            const Rbutton = p.createButton('Center is more similar to Right');
            Rbutton.position(0.65 * p.widith, 0.75 * p.height);
            Rbutton.mousePressed(RightPress);
        }

        const LeftPress = function() {
            MLDSstim.recordResponse(0);
        }

        const RightPress = function() {
            MLDSstim.recordResponse(1);
        }

        class MLDS_present {
            constructor(StimulusArray) {
                this.StimulusArray = StimulusArray;
                this.PermutationArray = [];
                this.PresentationOrder = [];
                this.PresentNumber = 0;
                this.Response = [];

                this.createPermutationArray();
                this.createPresentationOrder();
            }

            presentBright(Back) {
                p.background(128);
                p.fill(Back);
                p.rect(0, 0, p.width, p.height);
                p.noStroke();

                let Position = this.PresentationOrder[this.PresentNumber];

                let A = this.PermutationArray[Position][0] - 1;
                let B = this.PermutationArray[Position][2] - 1;
                let Compare = this.PermutationArray[Position][1] - 1;

                p.fill(255 * this.StimulusArray[A]);
                p.ellipse(0.5 * p.width - 0.25 * p.width, 0.25 * p.height, 60);
                p.fill(255 * this.StimulusArray[B]);
                p.ellipse(0.5 * p.width + 0.25 * p.width, 0.25 * p.height, 60);
                p.fill(255 * this.StimulusArray[Compare]);
                p.ellipse(0.5 * p.width, 0.5 * p.height, 60);

                p.textSize(12);

                let tot = this.PermutationArray.length;
                let trial = this.PresentNumber;

                let stringA = trial + ' of ' + tot + ' stim=+' + Position + ' ; ' + this.PermutationArray[Position];
                p.text(stringA, 10, p.height - 30);
            }

            EndPresentation() {
                p.background(128);
                p.fill(0);
                p.rect(0, 0, p.width, p.height);

                p.fill(200);
                p.textSize(30);
                p.text('Done. Thank You', p.width / 2, -40, p.height / 2);

                this.PrintResults();
            }

            PrintResults() {
                console.log('****');
                console.log('---');
                for (let i = 0; i < this.PermutationArray.length; i++) {
                    console.log(this.Response[i] + ' ' + this.PermutationArray[i][0] + ' ' + this.PermutationArray[i][1] + ' ' + this.PermutationArray[i][2]);
                }
            }

            recordResponse(Answer) {
                this.Response[this.PresentationOrder[this.PResentNumber]] = Answer;
                this.PresentNumber++;

                if (this.PresentNumber < this.PermutationArray.length) {
                    this.presentBright(backcolor);
                } else {
                    this.EndPresentation();
                }
            }

            createPermutationArray() {
                this.PermutationArray = this.combinations(this.StimulusArray.length, 3);

                let flip = 0;
                for (let i = 0; i < this.PermutationArray.length; i++) {
                    flip = Math.round(p.random(1));
                    if (flip === 0) {
                        this.PermutationArray[i] = [this.PermutationArray[i][2], this.PermutationArray[i][1], this.PermutationArray[i][0]];
                    }
                }

                for (let i = 0; i < this.PermutationArray.length; i++) {
                    this.Response[i] = -9;
                }
            }

            PrintPerumtationsArray() {
                for (let i = 0; i < this.PermutationArray.length; i++){
                    console.log(this.PermutationArray[i])
                }
            }

            createPresentationOrder() {
                for (let i = 0; i < this.PermutationArray.length; i++) {
                    this.PresentationOrder[i] = i;
                }
                this.PresentationOrder = p.shuffle(this.PresentationOrder);
            }

            combinations(n, k) {
                let result = [];
                let stack = [];

                function combine(currentNumber) {
                    if (stack.length === k) {
                        let newCombo = stack.slice();
                        result.push(newCombo);
                        return;
                    }
                    if (currentNumber > n) {
                        return;
                    }
                    stack.push(currentNumber);
                    combine(currentNumber + 1);
                    stack.pop();
                    combine(currentNumber + 1);
                }

                combine(1);
                return result;
            }
        }
    }

    new p5(s, PARENT_ID);
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/
});