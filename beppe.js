let viniliTotali = []; // Array che contiene tutti i vinili
let viniliVisibili = []; // Array che contiene i vinili visibili dopo il filtro e ordinamento
let elementiPerPagina = 50; // Numero di elementi per pagina
let paginaCorrente = 1; // Pagina attualmente visualizzata

// Funzione per caricare i dati dal file CSV
async function caricaDaCSVBeppe() {
    try {
        const response = await fetch('vinili_beppe.csv'); // Assicurati che il file CSV sia nel giusto percorso
        if (!response.ok) throw new Error('Errore nel caricamento dei vinili.');
        const text = await response.text();

        // Parse CSV e separa le righe
        const rows = text.split("\n").map(row => row.split(","));

        // Crea un array per i vinili
        viniliTotali = rows.map(row => ({
            "Artista-Gruppo": row[0],
            "Titolo": row[1],
            "Genere": row[2],
            "Stato": row[3],
            "Casa Discografica": row[4],
            "Formato-RPM": row[5],
            "Locazione": row[6],
            "Valore": row[7],
            "Anno": row[8]
        }));

        // Ordina i vinili in ordine alfabetico per 'Artista-Gruppo'
        viniliTotali.sort((a, b) => a["Artista-Gruppo"].localeCompare(b["Artista-Gruppo"]));

        // Inizialmente mostra tutti i vinili
        viniliVisibili = [...viniliTotali];

        visualizzaViniliBeppe();
        mostraPaginazione();
    } catch (error) {
        console.error(error.message);
    }
}

// Funzione per visualizzare i vinili nella tabella
function visualizzaViniliBeppe() {
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = ""; // Pulisce la tabella prima di aggiungere i nuovi dati

    // Calcola gli indici per la paginazione
    const startIndex = (paginaCorrente - 1) * elementiPerPagina;
    const endIndex = startIndex + elementiPerPagina;
    const viniliDaMostrare = viniliVisibili.slice(startIndex, endIndex);

    viniliDaMostrare.forEach(vinile => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${vinile["Artista-Gruppo"] || ""}</td>
            <td>${vinile.Titolo || ""}</a></td>
            <td>${vinile.Genere || ""}</td>
            <td>${vinile.Stato || ""}</td>
            <td>${vinile["Casa Discografica"] || ""}</td>
            <td>${vinile["Formato-RPM"] || ""}</td>
            <td>${vinile.Locazione || ""}</td>
            <td>${vinile.Valore || ""}</td>
            <td>${vinile.Anno || ""}</td>
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
            visualizzaViniliBeppe();
        });
        paginationContainer.appendChild(btn);
    }
}

// Funzione per cercare e filtrare i vinili
function filtraVinili() {
    const searchTerm = document.getElementById('search-placeholder').value.toLowerCase();
    const filtroCategoria = document.getElementById('filter-placeholder').value;

    // Filtra i vinili in base ai criteri di ricerca
    const viniliFiltrati = viniliTotali.filter(vinile => {
        let valoreCriterio = "";

        // Determina quale categoria di filtro è stata selezionata e ottieni il valore da confrontare
        switch(filtroCategoria) {
            case 'artista':
                valoreCriterio = vinile["Artista-Gruppo"];
                break;
            case 'genere':
                valoreCriterio = vinile.Genere;
                break;
            case 'anno':
                valoreCriterio = vinile.Anno;
                break;
            case 'locazione':
                valoreCriterio = vinile.Locazione;
                break;
            default:
                valoreCriterio = vinile["Artista-Gruppo"];
                break;
        }

        return valoreCriterio.toLowerCase().includes(searchTerm);
    });

    viniliVisibili = viniliFiltrati;
    paginaCorrente = 1; // Torna alla prima pagina dopo ogni filtro
    ordinaVinili(); // Rapplica l'ordinamento dopo il filtro
}

// Funzione per ordinare i vinili
function ordinaVinili() {
    const ordinamento = document.getElementById('sort-placeholder').value;

    // Applica ordinamento solo sui vinili visibili
    if (ordinamento === 'a-z') {
        viniliVisibili.sort((a, b) => a["Artista-Gruppo"].localeCompare(b["Artista-Gruppo"]));
    } else if (ordinamento === 'z-a') {
        viniliVisibili.sort((a, b) => b["Artista-Gruppo"].localeCompare(a["Artista-Gruppo"]));
    }

    visualizzaViniliBeppe();
}

// Aggiungi gli event listener per il filtro e l'ordinamento
function aggiungiEventListener() {
    document.getElementById('search-placeholder').addEventListener('input', filtraVinili);
    document.getElementById('filter-placeholder').addEventListener('change', filtraVinili);
    document.getElementById('sort-placeholder').addEventListener('change', ordinaVinili);
}

// Carica i dati al caricamento della pagina
window.onload = function() {
    caricaDaCSVBeppe(); // Popola la pagina con i dati dal CSV di Beppe
    aggiungiEventListener(); // Aggiungi gli event listener per ricerca e filtro
};