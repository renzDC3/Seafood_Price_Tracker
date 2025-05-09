 const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sortToggle = document.getElementById('sort-toggle');
    const sortPanel = document.getElementById('sort-panel');
    const sortButtons = document.querySelectorAll('.sort-btn');

    let products = [];
    let currentSort = 'az';

  
    fetch('https://renzdc3.github.io/fishh/data.json')
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
      <div class="product-price">₱${parseFloat(p.price).toFixed(2)}</div>
    `;
    productList.appendChild(div);
  });
}


    function applyFilters() {
      let filtered = [...products];

      const searchTerm = searchInput.value.toLowerCase();
      if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
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

    searchBtn.addEventListener('click', applyFilters);
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