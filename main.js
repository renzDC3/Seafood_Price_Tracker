 const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sortToggle = document.getElementById('sort-toggle');
    const sortPanel = document.getElementById('sort-panel');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const categorySelect = document.getElementById('category-select');

const overlay = document.getElementById('info-overlay'); 
const infoImage = document.getElementById('info-image'); 
const infoTagalogName = document.getElementById('info-tagalog-name'); 
const infoEnglishName = document.getElementById('info-english-name'); 
const infoScientificName = document.getElementById('info-scientific-name'); 
const infoDescription = document.getElementById('info-description'); 
const infoClose = document.getElementById('info-close');
const scrollTopBtn = document.getElementById("scrollTopBtn");



window.onscroll = () => {
  scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
};
scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });


function showInfoPanel(product) {
    infoImage.src = product.image;
    infoTagalogName.textContent = product.tagalog_name;
    infoEnglishName.textContent = product.english_name;
    infoScientificName.textContent = product.scientific_name;
    infoDescription.textContent = product.description;
    
    overlay.classList.add("active"); // Add fade-in effect
}

// Close panel on X click
infoClose.addEventListener("click", () => {
    overlay.classList.remove("active"); // Add fade-out effect
});

// Close panel when clicking outside
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    overlay.classList.remove('active');
  }
});


overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    overlay.classList.add('hidden');
  }
});


    let products = [];
    let currentSort = 'az';

  
    fetch('https://renzdc3.github.io/seafoodAPI/data.json')
      .then(res => res.json())
      .then(data => {
        products = data;
        displayProducts(products);
        
      });
      

      function displayProducts(items) {
  productList.innerHTML = '';
  items.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product-card';
    const priceChange = p.price - p.last_price;
let changeIndicator = '';
if (priceChange < 0) {
  changeIndicator = `<div style="color: #0f0;">↓ ₱${Math.abs(priceChange).toFixed(2)}</div>`;
} else if (priceChange > 0) {
  changeIndicator = `<div style="color: red;">↑ ₱${priceChange.toFixed(2)}</div>`;
}
    
    div.innerHTML = `
  <img src="${p.image}" alt="${p.name}" style="width: 100px; border-radius: 10px; width:150px;">
  <div class="product-name" style="margin-bottom:15px;">${p.name}</div>

  <div class="product-price" style="background-color:black; padding:5px; border-radius:17px; border:1px #242424 solid; margin-bottom:9px;">₱${parseFloat(p.price).toFixed(2)}  <div class="product-weight">${p.weight}</div></div>
  <div class="product-last-price" style="color: gray; font-size: 0.85em;">Last price: ₱${parseFloat(p.last_price).toFixed(2)}</div>
  ${changeIndicator}
`;


    // Attach the click event to show info panel
    div.addEventListener('click', () => showInfoPanel(p));

    productList.appendChild(div);
  });
}



    function applyFilters() {
  let filtered = [...products];

  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value;

  if (searchTerm) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
  }

  if (selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }

  switch (currentSort) {
    case 'az':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'za':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'low':
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case 'high':
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
  }

  displayProducts(filtered);
}

    categorySelect.addEventListener('change', applyFilters);
    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    applyFilters(); 
  }
});
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      applyFilters();
    });

    sortToggle.addEventListener('click', () => {
      sortPanel.classList.toggle('hidden');
    });

    sortButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        currentSort = btn.dataset.sort;
        sortToggle.textContent = `${btn.textContent} `;
        sortPanel.classList.add('hidden');
        applyFilters();
      });
    });

    document.addEventListener('click', (e) => {
      if (!sortToggle.contains(e.target) && !sortPanel.contains(e.target)) {
        sortPanel.classList.add('hidden');
      }
    });

    

    