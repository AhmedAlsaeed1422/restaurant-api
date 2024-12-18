const fetchDishes = async () => {
    try {
      const response = await fetch('/dishes');
      const dishes = await response.json();
      const menu = document.getElementById('menu');
      menu.innerHTML = '';
  
      dishes.forEach(dish => {
        const div = document.createElement('div');
        div.textContent = `${dish.name} - $${dish.price} - ${dish.category} - ${dish.description}`;
        menu.appendChild(div);
      });
    } catch (error) {
      console.error('Failed to fetch dishes:', error);
    }
  };
  
  document.getElementById('addDishForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
  
    try {
      const response = await fetch('/dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, category, description })
      });
  
      const result = await response.json();
      console.log(result.message);
      fetchDishes(); // Refresh the dishes
    } catch (error) {
      console.error('Failed to add dish:', error);
    }
  });
  