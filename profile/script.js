const wikiContent = document.getElementById('wikiContent');
const searchInput = document.getElementById('searchInput');
const categories = document.querySelectorAll('.sidebar li');

let wikiData = {};

// Load all JSON data dynamically
async function loadData(){
  const categoriesList = ['players','engines','tournaments','openings','computers','games'];
  for(const cat of categoriesList){
    try{
      const res = await fetch(`data/${cat}.json`);
      wikiData[cat] = await res.json();
    }catch(e){console.error(`Failed to load ${cat}.json`,e);}
  }
}
loadData();

// Render articles
function renderArticles(category){
  wikiContent.innerHTML='';
  if(!wikiData[category] || wikiData[category].length===0){
    wikiContent.innerHTML='<p>No articles found.</p>';
    return;
  }
  wikiData[category].forEach(item=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML=`
      ${item.image?`<img src="${item.image}" alt="${item.title}">`:''}
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    `;
    wikiContent.appendChild(card);
  });
}

// Sidebar click
categories.forEach(li=>{
  li.addEventListener('click',()=>renderArticles(li.dataset.category));
});

// Search
searchInput.addEventListener('input',(e)=>{
  const term = e.target.value.toLowerCase();
  let results=[];
  Object.values(wikiData).forEach(arr=>{
    arr.forEach(item=>{
      if(item.title.toLowerCase().includes(term) || item.description.toLowerCase().includes(term)){
        results.push(item);
      }
    });
  });
  wikiContent.innerHTML='';
  results.forEach(item=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML=`
      ${item.image?`<img src="${item.image}" alt="${item.title}">`:''}
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    `;
    wikiContent.appendChild(card);
  });
});
