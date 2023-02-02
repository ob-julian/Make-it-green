const max = 100;
const min = 1;
let difficultySlider;
let heightInput;
let widthInput;
let startButton;
let errorText;
let height, width, difficulty, arena, size;
let green;
let playable = false;

window.onload = function (){
    difficultySlider = document.getElementById('difficulty');
    heightInput = document.getElementById('height');
    widthInput = document.getElementById('width');
    startButton = document.getElementById('start')
    errorText = document.getElementById('error');
}

function start(){
    //resting old stuf;
    document.getElementById('win-container').style.display = 'none';
    errorText.innerText = '';
    playable = false;

    //getting Values
    height = heightInput.value;
    width = widthInput.value;
    difficulty = difficultySlider.value;

    //checking values
    if(height == null || height === '')
        errorText.innerText += 'Missing height value\n';
    else if(height < min)
        errorText.innerText += 'Height must greater than ' + min + '\n';
    else if(height > max)
        errorText.innerText += 'Height must be less than ' + max + '\n';

    if(width == null || width === '')
        errorText.innerText += 'Missing width value\n';
    else if(width < min)
        errorText.innerText += 'Width must greater than ' + min + '\n';
    else if(width > max)
        errorText.innerText += 'Width must be less than ' + max + '\n';
    if(errorText.innerText !== '')
        return;
    size = width * height;
    green = size;

    //preparing playing-field-representation
    arena = new Array(width);
    for (let i = 0; i < width; i++) {
        arena[i] = new Array(height);
        for (let j = 0; j < height; j++) {
            arena[i][j] = true;
        }
    } //I hate JS for this

    //scrambling arena
    let turns;
    switch (difficulty){
        case 'easy':
            turns = Math.ceil(0.2 * size);
            break;
        case 'moderate':
            turns = Math.ceil(0.6 * size);
            break;
        case 'hard':
            turns = Math.ceil(1.5 * size);
            break;
    }
    for (;turns >= 0;turns--){
        playHidden(getRandomInt(size));
    }
    if(green === size)
        playHidden(getRandomInt(size)); //to make sure you don't win by default

    //preparing playing field
    document.getElementById('main').innerHTML = '<div id="field" style="display: flex;  flex-wrap: wrap; height: calc( 100vmin - 16px ); width: calc( 100vmin - 16px)"></div>';
    let generatedField = '';
    for (let i = 0; i < size; i++) {
        generatedField += `<div style='width: calc( ( 100% / ${width}) * 0.8 - 4px); height: calc( ( 100% / ${height}) * 0.8 - 4px) ; margin: calc(( 100% / ${height}) * 0.1) calc(( 100% / ${width}) * 0.1 ); background-color: ${getColor(i)}; border: 2px solid black; cursor: pointer' id="field${i}" onclick="play(${i})"></div>`;
    }
    document.getElementById('field').innerHTML = generatedField;
    playable = true;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function play(point){
    if(!playable)
        return;
    playable = false;
    let localWidth = point % width;
    let localHeight =  Math.floor(point / height);
    chanceValue(localWidth, localHeight);
    chanceField(localWidth, localHeight);
    let chancedValue = localWidth - 1;
    if(chancedValue >= 0){
        chanceValue(chancedValue, localHeight);
        chanceField(chancedValue, localHeight);
    }
    chancedValue = localWidth + 1;
    if(chancedValue < width){
        chanceValue(chancedValue, localHeight);
        chanceField(chancedValue, localHeight);
    }
    chancedValue = localHeight - 1;
    if(chancedValue >= 0){
        chanceValue(localWidth, chancedValue);
        chanceField(localWidth, chancedValue);
    }
    chancedValue = localHeight + 1;
    if(chancedValue < height){
        chanceValue(localWidth, chancedValue);
        chanceField(localWidth, chancedValue);
    }
    if(green === size)
        document.getElementById('win-container').style.display = "block";
    else
        playable = true;
}

function playHidden(point){
    let localWidth = point % width;
    let localHeight =  Math.floor(point / height);
    chanceValue(localWidth, localHeight);
    let chancedValue = localWidth - 1;
    if(chancedValue >= 0){
        chanceValue(chancedValue, localHeight);
    }
    chancedValue = localWidth + 1;
    if(chancedValue < width){
        chanceValue(chancedValue, localHeight);
    }
    chancedValue = localHeight - 1;
    if(chancedValue >= 0){
        chanceValue(localWidth, chancedValue);
    }
    chancedValue = localHeight + 1;
    if(chancedValue < height){
        chanceValue(localWidth, chancedValue);
    }

}

function getColor(point){
    let localWidth = point % width;
    let localHeight =  Math.floor(point / height);
    let bol = arena[localWidth][localHeight];
    if(bol)
        return "green";
    return "red";
}

function chanceField(localWidth, localHeight){
    let point = (localHeight * height + localWidth);
    document.getElementById('field' + point).style.backgroundColor = getColor(point);
}

function chanceValue(localWidth, localHeight){
    arena[localWidth][localHeight] = !arena[localWidth][localHeight];
    if(arena[localWidth][localHeight])
        green++;
    else
        green--;
}