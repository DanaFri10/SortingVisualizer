const n=40;
const array=[];
const maxSpeed = 10;
const minSpeed = 400;

let audioCtx=null;
let speed = 5 * (minSpeed - maxSpeed)/10;
let animationTimeout;

init();

function init(){
    clearTimeout(animationTimeout);
    for(let i=0;i<n;i++){
        array[i]=Math.random();
    }
    showBars();
}

function playBubbleSort(){
    const swaps = bubbleSort([...array]);
    animate(swaps);
}

function playSelectionSort(){
    const swaps = selectionSort([...array]);
    animate(swaps);
}

function animate(swaps){
    if(swaps.length==0){
        showBars();
        sorting = false;
        return;
    }
    const [i,j]=swaps.shift(0);
    [array[i],array[j]]=[array[j],array[i]];
    showBars([i,j]);
    playNote(200+array[i]*500);
    playNote(200+array[j]*500);

    animationTimeout = setTimeout(function(){
        animate(swaps);
    }, speed);
}

function bubbleSort(array){
    const swaps=[];
    do{
        var swapped=false;
        for(let i=1;i<array.length;i++){
            if(array[i-1]>array[i]){
                swaps.push([i-1,i]);
                swapped=true;
                [array[i-1],array[i]]=[array[i],array[i-1]];
            }
        }
    } while(swapped);
    return swaps;
}

function selectionSort(array) {
    const swaps=[];
    for(let i=0;i<array.length - 1;i++) {
        let currMin = i;
        for(let j=i+1;j<array.length;j++) {
            if(array[j] < array[currMin]){
                currMin = j;
            }   
        }
        swaps.push([i,currMin]);
        [array[i],array[currMin]]=[array[currMin],array[i]];
    }
    return swaps;
}

function showBars(indices){
    container.innerHTML="";
    for(let i=0;i<array.length;i++){
        const bar=document.createElement("div");
        bar.style.height=array[i]*100+"%";
        bar.classList.add("bar");
        if(indices && indices.includes(i)){
            bar.style.backgroundColor="red";
        }
        container.appendChild(bar);
    }   
}

function playNote(freq){
    if(audioCtx==null){
        audioCtx=new(
            AudioContext || 
            webkitAudioContext || 
            window.webkitAudioContext
        )();
    }
    const dur=0.1;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    const node=audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime+dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function changeSpeed() {
    let speedSlider = document.getElementById("speed");
    speed = minSpeed - speedSlider.value * (minSpeed - maxSpeed) / 10;
}