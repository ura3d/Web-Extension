url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

fetch(url).then(response => {
  if(!response.ok){
    throw new Error('Network was not ok' + response.statusText);
  }
  return response.json();
}).then(data => {
  APIxUSD = JSON.stringify(data.find(item => item.cc === 'USD').rate);
  APIxEUR = JSON.stringify(data.find(item => item.cc === 'EUR').rate);


  const UAH = 1;
  const USD = APIxUSD;
  const EUR = APIxEUR;

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
      val: USD,
      flag: 'res/countries/us.png',
      func: (blockId)=> USDx(blockId),
    },
    {
      id: 2,
      isActive: false,
      name: 'EUR',
      val: EUR,
      flag: 'res/countries/eu.png',
      func: (blockId)=> EURx(blockId),
    }
  ]

  const blocks = [
    {
      id: 0,
      curId: null,
      block: document.getElementById('b0'),
      del: document.getElementById('d0'),
      input: document.getElementById('i0'),
      select: document.getElementById('s0'),
      img: document.getElementById('img0')
    }
]


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
    blocks[blockId].input.placeholder = holderValue
  }

  function flag(blockId, curId){
    blocks[blockId].img.src = currency[curId].flag;
  }

  function inpt(blockId, curId){
    blocks[blockId].input.addEventListener('input', () => currency[curId].func(blockId));
  }



  function UAHxUSD(data){
    const xUSD = (parseInt(data)/USD).toFixed(2);
    blocks.forEach(item => {
      if(item.curId === 1){
        item.input.value = xUSD;
      }
    });

    //i2.value = xUSD;
    return(xUSD);
  }

  function UAHxEUR(data){
    const xEUR = (parseInt(data)/EUR).toFixed(2);
    blocks.forEach(item => {
      if(item.curId === 2){
        item.input.value = xEUR;
      }
    });
    //i3.value = xEUR;
    return(xEUR);
  }

  function USDxUAH(data){
    const xUAH = (parseInt(data)*USD).toFixed(2);
    blocks.forEach(item => {
      if(item.curId === 0){
        item.input.value = xUAH;
      }
    });
    //i1.value = xUAH;
    return(xUAH);
  }

  function EURxUAH(data){
    const xUAH = (parseInt(data)*EUR).toFixed(2);
    blocks.forEach(item => {
      if(item.curId === 0){
        item.input.value = xUAH;
      }
    });
    //i1.value = xUAH;
    return(xUAH);
  }




  function UAHx(blockId){
    const data = blocks[blockId].input.value;
    UAHxUSD(data);
    UAHxEUR(data);
  }

  function USDx(blockId){
    const data = blocks[blockId].input.value;
    mainData = USDxUAH(data);
    UAHxEUR(mainData);
  }

  function EURx(blockId){
    const data = blocks[blockId].input.value;
    const mainData = EURxUAH(data);
    //const mainData = i1.value;
    UAHxUSD(mainData);
  }



  function addBlock(){

    const parent = document.getElementById('workSpace');
    const newId = blocks.length


    const newDiv = document.createElement("div");
    newDiv.classList.add("block");
    newDiv.setAttribute('id', 'b' + newId);


    const newImg = document.createElement("img");
    newImg.classList.add("img");
    newDiv.setAttribute('id', 'img' + newId);
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
      block: newDiv,
      del: newDel,
      input: newInput,
      select: newSelect,
      img: newImg
    });
  }

  function setBlock(blockId, curId){
    curId = parseInt(curId, 10);
    blockId = parseInt(blockId, 10);

    blocks[blockId].curId = curId;
    blocks[blockId].input.disabled = false;
    blocks[blockId].select.disabled = true;
    blocks[blockId].select.firstChild.innerHTML = currency[curId].name;
    blocks[blockId].select.classList.add('unactive');

    flag(blockId, curId)
    placeholder(blockId, curId);
    inpt(blockId, curId);

    return(0);
  }


  addBlock();
  setBlock(1, 1);

  const addButton = document.getElementById('add');
  addButton.addEventListener('click', () => addBlock());

function hide(id){
  blocks.forEach(b => {if(b.id === id){b.block.remove(); b.curId = null}})
}

blocks.forEach(b => b.del.addEventListener('click', () => hide(b.id)))


}).catch(error => {
  console.error('Problem: ', error)
})
