let viniliTotali = []; // Array che contiene tutti i vinili
let viniliVisibili = []; // Array che contiene i vinili visibili dopo il filtro e ordinamento
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
        viniliVisibili = viniliTotali; // Inizialmente tutti i vinili sono visibili
        visualizzaViniliConCopertina(); // Chiama la funzione per visualizzare i vinili

    } catch (error) {
        console.error('Errore nel caricamento dei vinili:', error);
    }
}

// Funzione per visualizzare i vinili nella tabella
function visualizzaViniliConCopertina() {
    const vinili = viniliVisibili;
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = ""; // Pulisce la tabella prima di aggiungere i nuovi dati

    // Calcola gli indici per la paginazione
    const startIndex = (paginaCorrente - 1) * elementiPerPagina;
    const endIndex = startIndex + elementiPerPagina;
    const viniliDaMostrare = vinili.slice(startIndex, endIndex);

    viniliDaMostrare.forEach(vinile => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${vinile.Path || 'images/default-cover.jpg'}" alt="${vinile.Titolo}" class="small-cover"></td>
            <td>${vinile.Codice || ""}</td>
            <td><a href="disco.html?title=${encodeURIComponent(vinile.Titolo)}" class="titolo-disco-link">${vinile.Titolo || ""}</a></td>
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
    mostraPaginazioneConCopertina();
}

// Funzione per mostrare i controlli di paginazione
function mostraPaginazioneConCopertina() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ""; // Pulisce i pulsanti di paginazione

    const totalPages = Math.ceil(viniliVisibili.length / elementiPerPagina);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.classList.add('pagina');
        if (i === paginaCorrente) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', function () {
            paginaCorrente = i;
            visualizzaViniliConCopertina(); // Visualizza i vinili con la copertura
        });
        paginationContainer.appendChild(btn);
    }
}

// Funzione per cercare e filtrare i vinili
function filtraVinili() {
    const searchTerm = document.getElementById('search-placeholder').value.toLowerCase();
    const filtroCategoria = document.getElementById('filter-placeholder').value;

    // Se il termine di ricerca è vuoto, mostra tutti i vinili
    if (!searchTerm) {
        viniliVisibili = viniliTotali;
    } else {
        // Filtra i vinili in base ai criteri di ricerca
        viniliVisibili = viniliTotali.filter(vinile => {
            if (filtroCategoria === 'tutti') {
                return Object.values(vinile).some(val =>
                    val && String(val).toLowerCase().includes(searchTerm)
                );
            }

            let valoreCriterio = "";

            // Determina quale categoria di filtro è stata selezionata e ottieni il valore da confrontare
            switch (filtroCategoria) {
                case 'artista':
                    valoreCriterio = vinile["Artista-Gruppo"] || "";
                    break;
                case 'genere':
                    valoreCriterio = vinile.Genere || "";
                    break;
                case 'anno':
                    valoreCriterio = vinile["Anno di Pubblicazione"] || vinile.Anno || "";
                    break;
                case 'locazione':
                    valoreCriterio = vinile.Locazione || "";
                    break;
                case 'titolo':
                    valoreCriterio = vinile.Titolo || "";
                    break;
                default:
                    valoreCriterio = vinile["Artista-Gruppo"] || "";
                    break;
            }

            return String(valoreCriterio).toLowerCase().includes(searchTerm);
        });
    }

    paginaCorrente = 1; // Torna alla prima pagina dopo ogni filtro
    ordinaVinili(); // Rapplica l'ordinamento dopo il filtro
}

// Funzione per ordinare i vinili
function ordinaVinili() {
    const sortField = document.getElementById('sort-field').value;
    const ordinamento = document.getElementById('sort-placeholder').value;

    viniliVisibili.sort((a, b) => {
        let valA = "";
        let valB = "";

        if (sortField === 'artista') {
            valA = a["Artista-Gruppo"] || "";
            valB = b["Artista-Gruppo"] || "";
        } else if (sortField === 'titolo') {
            valA = a.Titolo || "";
            valB = b.Titolo || "";
        } else if (sortField === 'genere') {
            valA = a.Genere || "";
            valB = b.Genere || "";
        } else if (sortField === 'anno') {
            valA = a["Anno di Pubblicazione"] || a.Anno || "";
            valB = b["Anno di Pubblicazione"] || b.Anno || "";
        } else if (sortField === 'locazione') {
            valA = a.Locazione || "";
            valB = b.Locazione || "";
        }

        // Converti a stringa e minuscolo per sorting robusto
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();

        return ordinamento === 'z-a' ? valB.localeCompare(valA) : valA.localeCompare(valB);
    });

    visualizzaViniliConCopertina();
}

// Funzione per aggiungere gli event listener
function aggiungiEventListener() {
    document.getElementById('apply-filters-btn').addEventListener('click', filtraVinili);

    // Permetti la ricerca anche premendo Invio nel campo di testo
    document.getElementById('search-placeholder').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            filtraVinili();
        }
    });

    document.getElementById('sort-field').addEventListener('change', ordinaVinili);
    document.getElementById('sort-placeholder').addEventListener('change', ordinaVinili);
}

// Carica i dati al caricamento della pagina
window.onload = function () {
    caricaDaJSON(); // Popola la pagina con i dati dal JSON
    aggiungiEventListener(); // Aggiungi gli event listener per ricerca e filtro
};