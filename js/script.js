document.addEventListener("DOMContentLoaded", () => {
    const url = "https://japceibal.github.io/japflix_api/movies-data.json";
    let films = [];

   
    fetch(url)
        .then(response => response.json())
        .then(data => {
            films = data; 
        })
        .catch(error => {
            console.error("Error al cargar los datos: ", error);
        });

    document.getElementById("btnBuscar").addEventListener("click", () => {
        const search = document.getElementById("inputBuscar").value.toLowerCase();
        if (search) {
            const resultados = films.filter(films =>
                films.title.toLowerCase().includes(search) ||
                films.genres.some(genre => genre.name.toLowerCase().includes(search)) ||
                (films.tagline && films.tagline.toLowerCase().includes(search)) ||
                (films.overview && films.overview.toLowerCase().includes(search))
            );
            Showresults(resultados);
        }
    });
});

function generarEstrellas(score) {
    let estrellasHTML = '';
    const estrellasContadas = Math.round(score / 2); 

    for (let i = 1; i <= 5; i++) {
        if (i <= estrellasContadas) {
            estrellasHTML += '<span class="fa fa-star checked"></span>';
        } else {
            estrellasHTML += '<span class="fa fa-star nochecked"></span>';
        }
    }
    return estrellasHTML;
}


function Showresults(resultados) {
    const lista = document.getElementById("lista");
    lista.innerHTML = ""; 

    resultados.forEach(pelicula => {
        const vote = Math.max(0, Math.min(10, pelicula.vote_average));
        const estrellas = generarEstrellas(vote); 
        
        const item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `<div><strong>${pelicula.title}</strong><br>${pelicula.tagline}<br>${estrellas}</div>`;
        
    
        const verMasBtn = document.createElement("button");
        verMasBtn.className = "btn btn-info";
        verMasBtn.innerText = "Ver más";
        verMasBtn.addEventListener("click", (event) => {
            event.stopPropagation(); 
            mostrarDetalles(pelicula);
        });

        item.appendChild(verMasBtn);
        lista.appendChild(item);
    });
}

function mostrarDetalles(pelicula) {
    const overlay = document.getElementById("overlay");
    const detallesContenedor = document.getElementById("detalles");
    const detalleTitulo = document.getElementById("detalleTitulo");
    const detalleOverview = document.getElementById("detalleOverview");
    const detalleGeneros = document.getElementById("detalleGeneros");

   
    detalleTitulo.textContent = '';
    detalleOverview.textContent = '';
    detalleGeneros.innerHTML = '';

    
    detalleTitulo.textContent = pelicula.title;
    detalleOverview.textContent = pelicula.overview;

   
    pelicula.genres.forEach(genre => {
        const li = document.createElement("li");
        li.textContent = genre.name;
        detalleGeneros.appendChild(li);
    });

    
    const btnDetallesAdicionales = document.createElement("button");
    btnDetallesAdicionales.textContent = "Ver más detalles";
    btnDetallesAdicionales.className = "btn btn-secondary mt-2";

    
    const detallesAdicionales = document.createElement("div");
    detallesAdicionales.className = "detalles-adicionales"; 
    detallesAdicionales.style.display = "none"; 
    detallesAdicionales.innerHTML = `
        <p>Año de lanzamiento: ${new Date(pelicula.release_date).getFullYear()}</p>
        <p>Duración: ${pelicula.runtime} minutos</p>
        <p>Presupuesto: $${pelicula.budget.toLocaleString()}</p>
        <p>Ganancias: $${pelicula.revenue.toLocaleString()}</p>
    `;

    btnDetallesAdicionales.addEventListener("click", () => {
        detallesAdicionales.style.display = detallesAdicionales.style.display === "none" ? "block" : "none";
    });

    
    while (detallesContenedor.firstChild) {
        detallesContenedor.removeChild(detallesContenedor.firstChild);
    }

    
    detallesContenedor.appendChild(detalleTitulo);
    detallesContenedor.appendChild(detalleOverview);
    detallesContenedor.appendChild(detalleGeneros);
    detallesContenedor.appendChild(btnDetallesAdicionales);
    detallesContenedor.appendChild(detallesAdicionales);
    
    
    const btnCerrar = document.createElement("button");
    btnCerrar.textContent = "Cerrar";
    btnCerrar.className = "btn btn-secondary mt-2";
    btnCerrar.onclick = () => {
        overlay.style.display = "none";
    };
    detallesContenedor.appendChild(btnCerrar);

    
    overlay.style.display = "flex"; 
}
