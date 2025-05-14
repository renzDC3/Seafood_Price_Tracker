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

function showInfoPanel(product) {
    infoImage.src = product.image;
    infoTagalogName.textContent = product.tagalog_name;
    infoEnglishName.textContent = product.english_name;
    infoScientificName.textContent = product.scientific_name;
    infoDescription.textContent = product.description;
    overlay.classList.remove("hidden");
}

// Close panel on X click
infoClose.addEventListener("click", () => {
    overlay.classList.add("hidden");
});



infoClose.addEventListener('click', () => {
  overlay.classList.add('hidden');
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
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" style="width: 100px; border-radius: 10px;">
      <div class="product-name">${p.name}</div>
      <div class="product-weight">${p.weight}</div>
      <div class="product-price">Now: ₱${parseFloat(p.price).toFixed(2)}</div>
      <div class="product-last-price" style="color: gray; font-size: 0.85em;">Last: ₱${parseFloat(p.last_price).toFixed(2)}</div>
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

    

    