url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

let UAH = 1;
let USD = localStorage.getItem('USD');
let EUR = localStorage.getItem('EUR');
let CZK = localStorage.getItem('CZK');
let HUF = localStorage.getItem('HUF');
let CAD = localStorage.getItem('CAD');
let DKK = localStorage.getItem('DKK');



function setLog(logType='info', message="Made by Sweet"){
  const log = document.getElementById('log');
  let color;

  if (log.animationInterval) {
    clearInterval(log.animationInterval);
    log.animationInterval = null;
  }

  function startLoadingAnimation(log) {
    const dots = ['', '.', '..', '...'];
    let index = 0;

    log.style.color = 'black'; // Цвет текста анимации

    // Обновление текста с анимацией
    log.animationInterval = setInterval(() => {
      log.innerHTML = `Loading${dots[index]}`;
      index = (index + 1) % dots.length;
    }, 500); // Интервал обновления текста
  }

  switch(logType){
    case 'info': color = '#009cef'; break;
    case 'warning': color = '#ffc310'; break;
    case 'error': color = '#f44'; break;
    case 'load': startLoadingAnimation(log); log.style.background = '#61ed5b'; return;
  }

  log.style.background = color;
  log.innerHTML = message;
}

setLog(logType='load');

fetch(url).then(response => {
  if(!response.ok){
    throw new Error('Network was not ok' + response.statusText);
  }
  return response.json();
}).then(data => {
  APIxUSD = JSON.stringify(data.find(item => item.cc === 'USD').rate);
  APIxEUR = JSON.stringify(data.find(item => item.cc === 'EUR').rate);
  APIxCZK = JSON.stringify(data.find(item => item.cc === 'CZK').rate);
  APIxHUF = JSON.stringify(data.find(item => item.cc === 'HUF').rate);
  APIxCAD = JSON.stringify(data.find(item => item.cc === 'CAD').rate);
  APIxDKK = JSON.stringify(data.find(item => item.cc === 'DKK').rate);


  let UAH = 1;
  let USD = APIxUSD; localStorage.setItem('USD', USD);
  let EUR = APIxEUR; localStorage.setItem('EUR', EUR);
  let CZK = APIxCZK; localStorage.setItem('CZK', CZK);
  let HUF = APIxHUF; localStorage.setItem('HUF', HUF);
  let CAD = APIxCAD; localStorage.setItem('CAD', CAD);
  let DKK = APIxDKK; localStorage.setItem('DKK', DKK);
  setLog();
}).catch(error => {
  setLog(logType='warning', message='No Internet connection');
})

const currency = [
    {
      id: 0,
      isActive: false,
      name: 'UAH',
      val: 1,
      flag: 'res/countries/ua.png',
      func: (blockId)=> UAHx(blockId),
    },
    {
      id: 1,
      isActive: false,
      name: 'USD',
      val: localStorage.getItem('USD'),
      flag: 'res/countries/us.png',
      func: (blockId)=> CurX(blockId, 1),
    },
    {
      id: 2,
      isActive: false,
      name: 'EUR',
      val: localStorage.getItem('EUR'),
      flag: 'res/countries/eu.png',
      func: (blockId)=> CurX(blockId, 2),
    },
    {
      id: 3,
      isActive: false,
      name: 'CZK',
      val: localStorage.getItem('CZK'),
      flag: 'res/countries/czk.png',
      func: (blockId)=> CurX(blockId, 3),
    },
    {
      id: 4,
      isActive: false,
      name: 'HUF',
      val: localStorage.getItem('HUF'),
      flag: 'res/countries/huf.png',
      func: (blockId)=> CurX(blockId, 4),
    },
    {
      id: 5,
      isActive: false,
      name: 'CAD',
      val: localStorage.getItem('CAD'),
      flag: 'res/countries/cad.png',
      func: (blockId)=> CurX(blockId, 5),
    },
    {
      id: 6,
      isActive: false,
      name: 'DKK',
      val: localStorage.getItem('DKK'),
      flag: 'res/countries/dkk.png',
      func: (blockId)=> CurX(blockId, 6),
    }
  ]

let blocks = []


function placeholder(blockId, curId){
  var holderValue;
    if(curId == 0){
      holderValue = (UAH*USD).toFixed(2);
    }
    else if(curId == 1){
      holderValue = (UAH).toFixed(2);
    }
    else if(curId == 2){
      holderValue = (UAH*USD/EUR).toFixed(2);
    }
    else{
      holderValue = (UAH*USD/currency[curId].val).toFixed(2);
    }
    blocks[blockId].input.placeholder = holderValue
}

function flag(blockId, curId){
  blocks[blockId].img.src = currency[curId].flag;
}

function inpt(blockId, curId){
  blocks[blockId].input.addEventListener('input', () => currency[curId].func(blockId));
}



function UAHxCur(data, curId){
  const xVal = (parseInt(data)/currency[curId].val).toFixed(2);
  blocks.forEach(item => {
    if(item.curId === curId){
        item.input.value = xVal;
    }
  });
  return(xVal);
}

function CurxUAH(data, curId){
  const xUAH = (parseInt(data)*currency[curId].val).toFixed(2);
  blocks.forEach(item => {
    if(item.curId === 0){
      item.input.value = xUAH;
    }
  });
  return(xUAH);
}


function UAHx(blockId, CurxId = 0, data = null){
  if (data === null) {
    data = blocks[blockId].input.value;
  }
  currency.forEach(item => {
    if(item.id != CurxId && item.id != 0){
      UAHxCur(data, item.id);
    }
  });
}

function CurX(blockId, curId){
  const data = blocks[blockId].input.value;
  mainData = CurxUAH(data, curId);
  UAHx(blockId, curId, mainData)
}



function addBlock(){
  if (blocks.length > 0 && blocks[blocks.length - 1].curId === null) {
    setLog(logType='warning', 'Fill empty block');
    return;
  }
  console.log('Add Block')
    const parent = document.getElementById('workSpace');
    let newId = 0;
    blocks.forEach(item => {
      if (item.id >= newId) {
        newId = item.id + 1;
      }
    });


    const newDiv = document.createElement("div");
    newDiv.classList.add("block");
    newDiv.setAttribute('id', 'b' + newId);


    const newImg = document.createElement("img");
    newImg.classList.add("img");
    newImg.setAttribute('id', 'img' + newId);
    newDiv.appendChild(newImg);


    const newSelect = document.createElement("select");
    newSelect.classList.add("currency");
    newSelect.setAttribute('id', 's' + newId);

    const newOption1 = document.createElement('option');
    newOption1.disabled = true;
    newOption1.selected = true;
    newOption1.innerHTML = '...';
    newSelect.appendChild(newOption1);

    currency.forEach(item => {
      var isOk = true;
      blocks.forEach(block => {
        if(block.curId === item.id){isOk=false}
      });

      if(isOk){
        const newOption = document.createElement('option');
        newOption.value = item.id;
        newOption.innerHTML = item.name;
        newSelect.appendChild(newOption);
      }
    });
    newDiv.appendChild(newSelect);
    newSelect.addEventListener('change', () => setBlock(newId, newSelect.value));


    const newInput = document.createElement('input');
    newInput.type = 'number';
    newInput.classList.add('input');
    newInput.value = "";
    newInput.disabled = true;
    newInput.setAttribute('id', 'i' + newId);
    newDiv.appendChild(newInput);


    const newDel = document.createElement('div');
    newDel.classList.add("delete");
    newDel.setAttribute('id', 'd' + newId);
    newDiv.appendChild(newDel);
    newDel.addEventListener('click', () => hide(newId));


    parent.appendChild(newDiv);

    blocks.push({
      id: newId,
      curId: null,
      block: newDiv,
      del: newDel,
      input: newInput,
      select: newSelect,
      img: newImg
    });
  }

function setBlock(blockId, curId, firstLoad = false){
  console.log('Set Block')
  console.log('blockId: ' + blockId + ' curId: ' + curId);
  console.log(blocks);
  if(curId === null){
    return(0);
  }
  curId = parseInt(curId, 10);
  blockId = parseInt(blockId, 10);

  const id = blocks.find(b => b.id === blockId);
  console.log(id);
  blocks[blocks.length - 1].curId = curId;
  blocks[blocks.length - 1].input.disabled = false;
  blocks[blocks.length - 1].select.disabled = true;
  blocks[blocks.length - 1].select.firstChild.innerHTML = currency[curId].name;
  blocks[blocks.length - 1].select.classList.add('unactive');

  flag(blocks.length - 1, curId)
  placeholder(blocks.length - 1, curId);
  inpt(blocks.length - 1, curId);

  if(!firstLoad){
      saveBlockState(blocks);
  }
  setLog();
  return(0);
}

const addButton = document.getElementById('add');
addButton.addEventListener('click', () => addBlock());

function hide(id){
  blocks.forEach(b => {
    if(b.id === id){
      b.block.remove();
    }
  })
  blocks = blocks.filter(item => item.id !== id);
  saveBlockState(blocks);
  setLog();
}


function saveBlockState(blocks){
  console.log("Save: ");
  console.log(blocks);
  const blockState = blocks.map(b =>({
    id: b.id,
    curId: b.curId
  }));
  localStorage.setItem('blocks', JSON.stringify(blockState));
}

function loadBlockState(){
  const storedBlocksString = localStorage.getItem('blocks');
  console.log('Load: ');
  console.log(storedBlocksString);
  if(storedBlocksString){
    const storedBlocks = JSON.parse(storedBlocksString);
    storedBlocks.forEach(b => {
      if(b.currId !== null){
        addBlock(firstLoad=true);
        setBlock(b.id, b.curId);
      }
      else{
        console.log('hi')
      }
    });
  }
  else{
    addBlock();
    setBlock(0, 1);
  }
}

loadBlockState();
//addBlock();
//setBlock(1, 1);
