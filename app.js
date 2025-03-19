let viniliTotali = []; // Array che contiene tutti i vinili
let elementiPerPagina = 15; // Numero di elementi per pagina
let paginaCorrente = 1; // Pagina attualmente visualizzata

// Funzione per caricare i dati dal file JSON
async function caricaDaJSON() {
    try {
        const response = await fetch('vinili_fede.json');
        if (!response.ok) throw new Error('Errore nel caricamento dei vinili.');
        let vinili = await response.json();

        // Carica i vinili dal Local Storage
        const viniliLocal = JSON.parse(localStorage.getItem('vinili')) || [];
        vinili = vinili.concat(viniliLocal);

        // Ordina i vinili in ordine alfabetico per 'Artista-Gruppo'
        vinili.sort((a, b) => a["Artista-Gruppo"].localeCompare(b["Artista-Gruppo"]));

        viniliTotali = vinili; // Salva i vinili totali
        visualizzaVinili(); // Chiama visualizzaVinili senza parametri
        caricaCarosello();
    } catch (error) {
       // alert(error.message);
    }
}

// Funzione per visualizzare i vinili nella tabella
function visualizzaVinili() {
    const vinili = viniliTotali;
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = ""; // Pulisce la tabella prima di aggiungere i nuovi dati

    // Calcola gli indici per la paginazione
    const startIndex = (paginaCorrente - 1) * elementiPerPagina;
    const endIndex = startIndex + elementiPerPagina;
    const viniliDaMostrare = vinili.slice(startIndex, endIndex);

    viniliDaMostrare.forEach(vinile => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${vinile.Codice || ""}</td>
            <td>${vinile.Titolo || ""}</a></td>
            <td>${vinile["Artista-Gruppo"] || ""}</td>
            <td>${vinile["Anno di Pubblicazione"] || ""}</td>
            <td>${vinile.Genere || ""}</td>
            <td>${vinile.Pollici || ""}</td>
            <td>${vinile.RPM || ""}</td>
            <td>${vinile.Paese || ""}</td>
            <td>${vinile["Casa Discografica"] || ""}</td>
            <td>${vinile.Prezzo || ""}</td>
        `;
        tableBody.appendChild(row);
    });

    // Aggiorna i controlli di paginazione
    mostraPaginazione();
}



// Funzione per mostrare i controlli di paginazione
function mostraPaginazione() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ""; // Pulisce i pulsanti di paginazione

    const totalPages = Math.ceil(viniliTotali.length / elementiPerPagina);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.classList.add('pagina');
        if (i === paginaCorrente) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', function () {
            paginaCorrente = i;
            visualizzaVinili();
        });
        paginationContainer.appendChild(btn);
    }
}







// Carica i dati al caricamento della pagina
window.onload = caricaDaJSON();
