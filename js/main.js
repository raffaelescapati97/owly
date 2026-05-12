document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const categoryInput = document.getElementById('categoryInput');
    const bookList = document.getElementById('bookList');
    const bookDetails = document.getElementById('bookDetails');

    searchButton.addEventListener('click', () => {
        const category = categoryInput.value.trim();
        if (category) {
            searchBooks(category);
        }
    });

    async function searchBooks(category) {
        bookList.innerHTML = '<p>Caricamento...</p>';
        bookDetails.style.display = 'none';
        try {
            const response = await fetch(`https://openlibrary.org/subjects/${encodeURIComponent(category)}.json`);
            if (!response.ok) {
                throw new Error('Errore nella ricerca');
            }
            const data = await response.json();
            displayBooks(data.works);
        } catch (error) {
            console.error(error);
            bookList.innerHTML = '<p>Errore nella ricerca. Riprova.</p>';
        }
    }

    function displayBooks(works) {
        bookList.innerHTML = '';
        bookDetails.style.display = 'none';
        works.forEach(work => {
            const bookDiv = document.createElement('div');
            bookDiv.className = 'book-item';
            bookDiv.innerHTML = `
                <div class="book-title">${work.title}</div>
                <div class="book-authors">Autori: ${work.authors ? work.authors.map(author => author.name).join(', ') : 'Sconosciuto'}</div>
            `;
            bookDiv.addEventListener('click', () => showBookDetails(work.key));
            bookList.appendChild(bookDiv);
        });
    }

    async function showBookDetails(workKey) {
        bookDetails.innerHTML = '<p>Caricamento dettagli...</p>';
        bookDetails.style.display = 'block';
        try {
            const response = await fetch(`https://openlibrary.org${workKey}.json`);
            if (!response.ok) {
                throw new Error('Errore nel caricamento dei dettagli');
            }
            const data = await response.json();
            const description = data.description;
            let descText = '';
            if (typeof description === 'string') {
                descText = description;
            } else if (description && description.value) {
                descText = description.value;
            } else {
                descText = 'Descrizione non disponibile.';
            }
            bookDetails.innerHTML = `<h3>${data.title}</h3><p>${descText}</p>`;
        } catch (error) {
            console.error(error);
            bookDetails.innerHTML = '<p>Errore nel caricamento dei dettagli.</p>';
        }
    }
});