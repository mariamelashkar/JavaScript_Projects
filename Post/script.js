// Get references to HTML elements
const nameInput = document.getElementById("name");
const authorInput = document.getElementById("author");
const quantityInput = document.getElementById("quantity");
const submitButton = document.getElementById("submit");
const bookList = document.getElementById("bookList");
const viewAllBooksButton = document.getElementById("viewAllBooks");

// Initialize current ID variable
let currentId = 1;

// Function to fetch and render data
async function fetchAndRenderData() {
    try {
        const response = await fetch("https://1d69-156-192-19-180.ngrok-free.app/getbook", {
            headers: {
                "ngrok-skip-browser-warning": "69420"
            }
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
                <button onclick="checkInBook('${book.name}')">+</button>
                <button onclick="checkOutBook('${book.name}')">-</button>
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
    const quantity = parseInt(quantityInput.value, 10);  // Convert the string input to an integer

    // Create a new book object with ID
    const newBook = {
        id: currentId.toString(),  // ID is still a string as per previous example
        name,
        author,
        quantity,
    };

    // Make a POST request to add the new book
    try {
        const response = await fetch("https://1d69-156-192-19-180.ngrok-free.app/createbook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newBook),
        });

        if (response.status === 201) {
            // Clear form inputs
            nameInput.value = "";
            authorInput.value = "";
            quantityInput.value = "";
            // Increment the ID for the next request
            currentId++;
        } else {
            console.error("Error adding book:", response.statusText);
        }
    } catch (error) {
        console.error("Error adding book:", error);
    }
});

async function checkInBook(bookName) {
    try {
        const response = await fetch(`https://1d69-156-192-19-180.ngrok-free.app/getbookcheckin/${bookName}`, {
            method: "PATCH"
        });

        if (response.ok) {
            fetchAndRenderData();
        } else {
            console.error("Error checking in book:", response.statusText);
        }
    } catch (error) {
        console.error("Error checking in book:", error);
    }
}

async function checkOutBook(bookName) {
    try {
        const response = await fetch(`https://1d69-156-192-19-180.ngrok-free.app/getbookcheckout/${bookName}`, {
            method: "PATCH"
        });

        if (response.ok) {
            fetchAndRenderData();
        } else {
            console.error("Error checking out book:", response.statusText);
        }
    } catch (error) {
        console.error("Error checking out book:", error);
    }
}

// Event listener for "View All Books" button
viewAllBooksButton.addEventListener("click", fetchAndRenderData);