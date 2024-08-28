let currentSection = 0;
const sections = document.querySelectorAll('.section');
let isThrottled = false;
let touchStartY = 0;
let touchEndY = 0;
const nav = document.querySelector('nav');

function scrollToSection(index) {
    if (index >= 0 && index < sections.length) {
        currentSection = index;
        sections[currentSection].scrollIntoView({ behavior: 'smooth' });
    }
}

function handleScroll(event) {
    if (isThrottled) return;
    isThrottled = true;

    if (event.deltaY > 0) {
        scrollToSection(currentSection + 1);
    } else if (event.deltaY < 0) {
        scrollToSection(currentSection - 1);
    }

    setTimeout(() => {
        isThrottled = false;
    }, 1000);
}

function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    touchEndY = event.touches[0].clientY;
}

function handleTouchEnd() {
    if (isThrottled) return;
    isThrottled = true;

    if (touchStartY > touchEndY + 50) {
        scrollToSection(currentSection + 1);
    } else if (touchStartY < touchEndY - 50) {
        scrollToSection(currentSection - 1);
    }

    setTimeout(() => {
        isThrottled = false;
    }, 1000);
}

let lastScrollTop = 0;
window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        nav.style.top = '-60px'; // Oculta el menú al desplazarse hacia abajo
    } else {
        nav.style.top = '0'; // Muestra el menú al desplazarse hacia arriba
    }
    lastScrollTop = scrollTop;
});

window.addEventListener('wheel', handleScroll);
window.addEventListener('touchstart', handleTouchStart);
window.addEventListener('touchmove', handleTouchMove);
window.addEventListener('touchend', handleTouchEnd);

// Manejo informacion JSON

const jsondata = "datos.json";

fetch(jsondata)
    .then(response => response.json())
    .then(data => {
        const nameShort = data["name-short"];
        const area = data["area"];
        let description = data["description"];
        let aboutme = data["aboutme"];
        let characteristics = data["characteristics"];
        let extra = data["extra"];
        const technologies = data["technologies"];
        const projects = data["projects"];

        description = description.replace(/\n/g, '<br>');
        aboutme = aboutme.replace(/\n/g, '<br>');
        characteristics = characteristics.replace(/\n/g, '<br>');
        extra = extra.replace(/\n/g, '<br>');

        document.getElementById("name-short").innerHTML = nameShort;
        document.getElementById("area").innerHTML = area;
        document.getElementById("description").innerHTML = description;
        document.getElementById("about-me").innerHTML = aboutme;
        document.getElementById("characteristics").innerHTML = characteristics;
        document.getElementById("extra").innerHTML = extra;

        for (let i = 0; i < technologies.length; i++) {
            document.getElementById("technologies").innerHTML += "<div class=card>" + "<div><img src=./img/" + technologies[i].name + ".png /><div>" +technologies[i].name + " - " + technologies[i].level + "</div>";
        }
        
        for (let i = 0; i < projects.length; i++) {
            let projectHTML = `
                <div class="card-proj">
                    <div>
                        <img src="./img/${projects[i].name}.png" />
                        <div>
                            <h4>${projects[i].name}</h4>
                            <h5>${projects[i].description}</h5>
                            Tecnologías utilizadas: <br><br>
                            <ul class="tec-use">
            `;
            for (let j = 0; j < projects[i].technologies.length; j++) {
                projectHTML += `<li>${projects[i].technologies[j]}</li>`;
            }
        
            projectHTML += `
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById("projects").innerHTML += projectHTML;
        }
        
        const style = document.createElement('style');
        style.textContent = `
            .tec-use {
                display: flex;
                flex-wrap: wrap;
                padding: 0;
                margin: 0px 0px 0px 25px;
            }
            .tec-use li {
                width: 50%;
                box-sizing: border-box;
            }
        `;
        document.head.appendChild(style);
        
    })
    .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);
    });

