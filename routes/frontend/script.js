const menuDiv = document.getElementById('menu');
const addDishForm = document.getElementById('addDishForm');

// Fetch all dishes
async function fetchDishes() {
    try {
        const response = await fetch('http://localhost:3000/dishes');
        const dishes = await response.json();
        menuDiv.innerHTML = ''; // Clear previous content

        dishes.forEach(dish => {
            const dishDiv = document.createElement('div');
            dishDiv.classList.add('dish');
            dishDiv.innerHTML = `
                <h3>${dish.name}</h3>
                <p>Price: $${dish.price}</p>
                <p>Category: ${dish.category}</p>
                <p>${dish.description}</p>
                <button onclick="deleteDish(${dish.id})">Delete</button>
            `;
            menuDiv.appendChild(dishDiv);
        });
    } catch (err) {
        console.error('Error fetching dishes:', err);
    }
}

// Add a new dish
addDishForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch('http://localhost:3000/dishes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, category, description })
        });
        const result = await response.json();
        console.log(result);
        fetchDishes(); // Reload the dishes list
        addDishForm.reset();
    } catch (err) {
        console.error('Error adding dish:', err);
    }
});

// Delete a dish
async function deleteDish(id) {
    try {
        const response = await fetch(`http://localhost:3000/dishes/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        console.log(result);
        fetchDishes(); // Reload the dishes list
    } catch (err) {
        console.error('Error deleting dish:', err);
    }
}
