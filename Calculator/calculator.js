let currentValue = []
let prepareOp = {
    first: '',
    operand: ''
}
let tinyScreen = []
const digits = document.querySelectorAll('.digit')
digits.forEach((digit) => {
    console.log(digit);
    if (digit.id == "digit-back") {
        digit.addEventListener('click', ()=>{
            if (currentValue.length == 1) {
                currentValue = []
                onScreen('0')
            }else if (currentValue.length > 1) {
                currentValue.pop()
                onScreen(currentValue.join(''))
            }
        })
    }else if (digit.id == "digit-point") {
        digit.addEventListener('click', ()=>{
            if (!hasDecimal()){
                if (currentValue.length == 0) {
                    currentValue = ["0", "."]
                }else {   
                    currentValue.push(digit.textContent)
                }
                onScreen(currentValue.join(''))
            }
        })
    }else {
        digit.addEventListener('click', digitReaction)
    }
    digit.addEventListener('mousedown',toggleClicked)
    digit.addEventListener('mouseup', toggleClicked)
});
 
const opperands = document.querySelectorAll('.opperand')
opperands.forEach((opperand) => {
    opperand.addEventListener('click', operationReaction)
    opperand.addEventListener('mousedown',toggleClicked)
    opperand.addEventListener('mouseup', toggleClicked)
});

const acts = document.querySelectorAll('.act')
acts.forEach((act) => {
    if (act.id =='clear') {
        act.addEventListener('click', () =>{
            currentValue = []
            tinyScreen =[]
            for (const key in prepareOp) {
                if (Object.hasOwnProperty.call(prepareOp, key)) {
                    prepareOp[key] = '';
                    
                }
            }
            onScreen("0")
            onOpScreen("")
            onHistoryScreen("")
        })
    }
    if(act.id == "equal") {
        act.addEventListener('click', () =>{
            if (currentValue.length > 0){
                if (prepareOp.operand != ''){
                    if (prepareOp.first != ''){
                        getResult()
                    }
                } else{
                    const aString = currentValue.join('')
                    prepareOp.first = aString
                    //tinyScreen.push(aString)
                }
            }else{
                if (prepareOp.first != '' && prepareOp.operand != '') {
                    currentValue[0] = prepareOp.first
                    getResult()
                }
            }
        })
    }
    act.addEventListener('mousedown',toggleClicked)
    act.addEventListener('mouseup', toggleClicked)
});
function operationReaction(e) {
    const operation = e.target.textContent
    if (prepareOp.first === ''){ 
        if (currentValue.length > 0){ 
            const aString = currentValue.join('')
            prepareOp.first = aString
            tinyScreen.push(aString)
            prepareOp.operand = operation
            tinyScreen.push(operation)
            currentValue = []
            onOpScreen(operation)
            onHistoryScreen(tinyScreen.join(''))
        }
    }else {
        if (currentValue.length == 0) {
            prepareOp.operand = operation
            onOpScreen(operation)
            tinyScreen.pop()
            tinyScreen.push(operation)
            onHistoryScreen(tinyScreen.join(''))
        }else {
            getResult(operation)
        }
        
    }  

}
function getResult(operation = '') {
    const aString = currentValue.join('')
    tinyScreen.push(aString)
    const second = Number(aString)
    let result = ''
    console.log(arguments)
    const {operand} = prepareOp
    const first = Number(prepareOp.first)
    if (typeof first === "number" && typeof second === "number"){
        switch (operand) {
            case "+":
                result = sum(first, second)
                break;
            case "-":
                result = difference(first, second)
                break;
            case "*":
                result = multiply(first, second)
                break;
            case "/":
                result = division(first, second)
                break;
            default:
                result = ""
                break;
        }
    }

    let onScreenString = result
    let onOpScreenString = operation

    if (result == '') {
        onScreenString = '0'
        onOpScreenString = 'e'
        prepareOp.first = ''
        prepareOp.operand = ''
    }else {
        result = Math.round(result*100)/100
        prepareOp.first = result
        prepareOp.operand = operation;
        onScreenString = result
        onOpScreenString = operation
    }
    onHistoryScreen(tinyScreen.join(''))
    if (operation != '') {
        tinyScreen.push(operation)
        onHistoryScreen(tinyScreen.join(''))
    }else{
        tinyScreen = []
        tinyScreen.push(result)
        tinyScreen.push(operation)
    }
    currentValue = []
    onScreen(onScreenString)
    onOpScreen(onOpScreenString)

}
function digitReaction(e) {
    console.log(e);
    const digit = e.target.textContent
    console.log(digit)

    if (currentValue.length == 1 && currentValue[0] == "0") {
        currentValue.pop()
    }  
    currentValue.push(digit)
    console.log(currentValue);
    onScreen(currentValue.length > 0 ? currentValue.join('') : "0")
}
function hasDecimal() {
    return currentValue.find((elem) => elem ==".")
}
function toggleClicked(e){
    e.target.classList.toggle('clicked')
}
function division(a, b) {
    if (b == 0) { return ''}
    return a/b
}
function multiply(a, b) {
    return a*b
}
function sum(a, b) {
    return a+b
}
function difference(a, b) {
    return a-b
}
function onScreen(string ='0'){
    let content = document.querySelector('#inOutScreen')
    content.textContent = string
}
function onOpScreen(string){
    console.log(string);    
    let content = document.querySelector('#opScreen')
    content.textContent = string
}
function onHistoryScreen(string) {
    let content = document.querySelector('#historyScreen')
    content.textContent = string
}
onScreen(string = '0')
onOpScreen(string = '')
onHistoryScreen(string ='0')