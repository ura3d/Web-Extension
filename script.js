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
      name: 'UAH',
      val: 1,
      flag: 'res/countries/ua.png',
      blockId: 1
    },
    {
      id: 1,
      name: 'USD',
      val: USD,
      flag: 'res/countries/us.png',
      blockId: 2
    },
    {
      id: 2,
      name: 'EUR',
      val: EUR,
      flag: 'res/countries/eu.png',
      blockId: 3
    }
  ]

  const blocks = [
    {
      id: 1,
      block: document.getElementById('b1'),
      del: document.getElementById('d1'),
      input: document.getElementById('i1')
    },
    {
      id: 2,
      block: document.getElementById('b2'),
      del: document.getElementById('d2'),
      input: document.getElementById('i2')
    },
    {
      id: 3,
      block: document.getElementById('b3'),
      del: document.getElementById('d3'),
      input: document.getElementById('i3')
    }
]

  const i1 = blocks[0].input;
  const i2 = blocks[1].input;
  const i3 = blocks[2].input;

  //i2.placeholder = (UAH).toFixed(2);
  //i1.placeholder = (UAH*USD).toFixed(2);
  //i3.placeholder = (UAH*USD/EUR).toFixed(2);

  function placeholder(blockId, curId){
    var holderValue;
    if(curId === 0){
      holderValue = (UAH*USD).toFixed(2);
    }
    else if(curId === 1){
      holderValue = (UAH).toFixed(2);
    }
    else if(curId === 2){
      holderValue = (UAH*USD/EUR).toFixed(2);
    }
    blocks[blockId].input.placeholder = holderValue
  }

  placeholder(0, 0);
  placeholder(1, 1);
  placeholder(2, 2);



  function UAHxUSD(data){
    const xUSD = (parseInt(data)/USD).toFixed(2);
    i2.value = xUSD;
    return(xUSD);
  }

  function UAHxEUR(data){
    const xEUR = (parseInt(data)/EUR).toFixed(2);
    i3.value = xEUR;
    return(xEUR);
  }

  function USDxUAH(data){
    const xUAH = (parseInt(data)*USD).toFixed(2);
    i1.value = xUAH;
    return(xUAH);
  }

  function EURxUAH(data){
    const xUAH = (parseInt(data)*EUR).toFixed(2);
    i1.value = xUAH;
    return(xUAH);
  }




  function UAHx(){
    const data = i1.value;
    UAHxUSD(data);
    UAHxEUR(data);
  }
  i1.addEventListener('input', UAHx);

  function USDx(){
    const data = i2.value;
    USDxUAH(data);
    const mainData = i1.value;
    UAHxEUR(mainData);
  }
  i2.addEventListener('input', USDx);

  function EURx(){
    const data = i3.value;
    EURxUAH(data);
    const mainData = i1.value;
    UAHxUSD(mainData);
  }
  i3.addEventListener('input', EURx);

  function setBlock(blockId, curId){
    return(0);
    placeholder(blockId)
  }

function hide(id){
  blocks.forEach(b => {if(b.id === id){b.block.style.display = 'none'}})
}

blocks.forEach(b => b.del.addEventListener('click', () => hide(b.id)))


}).catch(error => {
  console.error('Problem: ', error)
})
