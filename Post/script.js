// Get references to HTML elements
const nameInput = document.getElementById("name");
const authorInput = document.getElementById("author");
const quantityInput = document.getElementById("quantity");
const submitButton = document.getElementById("submit");
const bookList = document.getElementById("bookList");

// Function to fetch and render data
async function fetchAndRenderData() {
    try {
        const response = await fetch("ngrok-free.app/getbook", {
            // headers: {
            //     "User-Agent": ",
            //     "ngrok-skip-browser-warning": "69420",

            // },
           
        });
        const data = await response.json();

        // Clear previous data
        bookList.innerHTML = "";

        // Render fetched data
        data.forEach((book) => {
            const bookElement = document.createElement("div");
            bookElement.innerHTML = `
                <h3>${book.name}</h3>
                <p>Author: ${book.author}</p>
                <p>Quantity: ${book.quantity}</p>
                <p>ID: ${book.id}</p>
            `;
            bookList.appendChild(bookElement);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Event listener for form submission
submitButton.addEventListener("click", async (event) => {
    event.preventDefault();

    // Get user input values
    const name = nameInput.value;
    const author = authorInput.value;
    const quantity = quantityInput.value;

    // Create a new book object
    const newBook = {
        name,
        author,
        quantity,
    };

    // Make a POST request to add the new book
    try {
        const response = await fetch("ngrok-free.app/createbook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newBook),
        });

        if (response.status === 201) {
            // Success: Refresh and render the updated data
            fetchAndRenderData();
            // Clear form inputs
            nameInput.value = "";
            authorInput.value = "";
            quantityInput.value = "";
        } else {
            console.error("Error adding book:", response.statusText);
        }
    } catch (error) {
        console.error("Error adding book:", error);
    }
});

// Initial data fetch and render
fetchAndRenderData();