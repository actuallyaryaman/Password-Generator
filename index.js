// Fetching cutom attributes made in html file

const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSLider();
// set strengthColor attribute to grey


// set passwordLEngth
function handleSLider(){
    inputSlider.value = passwordLength; //initialising it to 10
    lengthDisplay.innerText = passwordLength;  
}

// set color of strength
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow - HW
}


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }
}

    //   to show copied text

    async function copyContent() { //for error handeling as await(promse is used)
        try {
            await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
        }
        
    
        catch(e){
            copyMsg.innerText = "Failed";
        }
        
        
        //to make copy wala span visible
        copyMsg.classList.add("active");

        setTimeout(() => {
        copyMsg.classList.remove("active");
        },2000);

    }

// to add event listener in all checkboxes
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
            checkCount++;
    }); // to count how many checkboxes are ticked

    //special condition
     if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSLider();
     }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


// to copy input slider length to password length

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSLider();
});

copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
        copyContent();
});

// To generate password

generateBtn.addEventListener('click',() =>{
    // if no boxes checked
    if(checkCount ==0)
        return;

    if(passwordLength < checkCount){ //for special condition
        passwordLength = checkCount;
        handleSLider();
    }

    console.log("Start");

    // removing old passsword for new genration
    password = "";

    let funArr = [];

    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }

    if(numbersCheck.checked){
        funArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
        funArr.push(generateSymbol);
    }

    // cumpulsory addition
    for(let i=0; i<funArr.length;i++){
        password +=funArr[i]();
    }
    console.log("Complusory Addition Done");

    // remainig addition
    for(let i=0;i<passwordLength-funArr.length;i++){
        let randIndex = getRndInteger(0,funArr.length);
        console.log("randIndex"+ randIndex);
        password += funArr[randIndex]();

    }
    console.log("Remaining addition done");

    // shuffling the recieved password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    // show in UI
    passwordDisplay.value = password;
    console.log("UI addition done");
    
    // calculate strength
    calcStrength();
})


 

 

