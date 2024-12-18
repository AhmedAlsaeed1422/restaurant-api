document.addEventListener("DOMContentLoaded", () => {
    // Fetch all items
    const fetchButton = document.getElementById("fetch-items");
    const itemsContainer = document.getElementById("items-container");
    const addButton = document.getElementById("add-item");
  
    // Fetch all items
    fetchButton.addEventListener("click", async () => {
      try {
        const response = await fetch("/items");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  
        const items = await response.json();
        displayItems(items);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    });
  
    // Add a new item
    addButton.addEventListener("click", async () => {
      const name = document.getElementById("item-name").value;
      const description = document.getElementById("item-description").value;
  
      if (!name || !description) {
        alert("Please fill out both fields.");
        return;
      }
  
      try {
        const response = await fetch("/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        });
  
        if (!response.ok) throw new Error("Failed to add item.");
        alert("Item added successfully!");
        fetchButton.click(); // Refresh the list
      } catch (error) {
        console.error("Error adding item:", error);
      }
    });
  
    // Display fetched items
    function displayItems(items) {
      itemsContainer.innerHTML = ""; // Clear previous content
      items.forEach((item) => {
        const div = document.createElement("div");
        div.textContent = `Name: ${item.name}, Description: ${item.description}`;
        itemsContainer.appendChild(div);
      });
    }
  });
  