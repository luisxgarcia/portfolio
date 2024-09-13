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



let lastScrollTop = 0;
window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        nav.style.top = '-50px'; // Oculta el menú al desplazarse hacia abajo
    } else {
        nav.style.top = '0'; // Muestra el menú al desplazarse hacia arriba
    }
    lastScrollTop = scrollTop;
});

window.addEventListener('wheel', handleScroll);

// Manejo informacion JSON

const jsondata = "datos.json";

fetch(jsondata)
    .then(response => response.json())
    .then(data => {
        const nameShort = data["name-short"];
        const area = data["area"];
        let description = data["description"];
        let aboutme = data["aboutme"];
        let school = data["school"];
        let jobs = data["jobs"];
        let characteristics = data["characteristics"];
        let cursos = data["cursos"];
        let extra = data["extra"];
        const technologies = data["technologies"];
        const projects = data["projects"];
        const contact = data["contact"];

        description = description.replace(/\n/g, '<br>');
        aboutme = aboutme.replace(/\n/g, '<br>');
        characteristics = characteristics.replace(/<br>/g, '<li>');
        extra = extra.replace(/\n/g, '<br>');

        document.getElementById("name-short").innerHTML = nameShort;
        document.getElementById("area").innerHTML = area;
        document.getElementById("description").innerHTML = description;
        document.getElementById("characteristics").innerHTML = "<h3>Características</h3>" + characteristics;
        document.getElementById("extra").innerHTML = "<h3>Algo mas...</h3>" + extra;

        for (let i = 0; i < school.length; i++) {
            document.getElementById("school").innerHTML += "<i class='bi bi-backpack-fill'></i> <b>" + school[i] + "</b><br><br>";
        }
        for (let i = 0; i < jobs.length; i++) {
            document.getElementById("jobs").innerHTML += "<b> <i class='bi bi-person-gear'></i> " + jobs[i]+ "</b><br><br>";
        }
        for (let i = 0; i < cursos.length; i++) {
            document.getElementById("courses").innerHTML += "<i class='bi bi-file-text-fill'></i> <b>" + cursos[i].name + "</b> " + " <br>" + cursos[i].description + "<br> <br>";
        }

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
                        <br>
                    </div>
                    <div class="buttons">
                            <a href="${projects[i].url}" target= _blank><button><i class="bi bi-play-fill">Demo</i></button></a>
                            <a href="${projects[i].github}" target= _blank><button><i class="bi bi-github">Código</i></button></a>
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

    //Manejo de popup
    const close = document.getElementById("close");
    const contact = jsondata["contact"];
    fetch(jsondata)
    .then(response => response.json())
    .then(data => {
        const contact = data["contact"];
        const trigger = document.getElementById("trigger");
        const overlay = document.getElementById("overlay");
        
        const text = document.getElementById("text");
        const github = document.getElementById("github");
        const linkedin = document.getElementById("linkedin");
        const email = document.getElementById("mail");

        github.addEventListener("click", () => {
            for(let i = 0; i < contact.length; i++){
                if(contact[i].type == "github-personal"){
                    text.innerHTML += "<a href='" + contact[i].value + "'>" + "<h3>GitHub Personal</h3>"+ "</a><br>";
                }
                else if(contact[i].type == "github-edu"){
                    text.innerHTML += "<a href='" + contact[i].value + "'>" + "<h3>GitHub Escolar</h3>"+ "</a>";
                }
            }
            overlay.style.display = (overlay.style.display === 'none' || overlay.style.display === '') ? 'block' : 'none';
            trigger.style.display = 'none';
        })
        email.addEventListener("click", () => {
            for(let i = 0; i < contact.length; i++){
                if(contact[i].type == "email"){
                    text.innerHTML += "<h3>Correo</h3><br>"+ "<p>" + contact[i].value + "</p>"; 
                }
            }
            overlay.style.display = (overlay.style.display === 'none' || overlay.style.display === '') ? 'block' : 'none';
            trigger.style.display = 'none';
        })
        linkedin.addEventListener("click", () => {
            for(let i = 0; i < contact.length; i++){
                if(contact[i].type == "linkedin"){
                    text.innerHTML += "<a href='" + contact[i].value + "'>" + "<br><br><h3>LinkedIn</h3>"+ "</a>";
                }
            }
            overlay.style.display = (overlay.style.display === 'none' || overlay.style.display === '') ? 'block' : 'none';
            trigger.style.display = 'none';
        })
        
    })
    close.addEventListener("click", () => {
        overlay.style.display = 'none';
        trigger.style.display = 'block';
        text.innerHTML = "";
    }
    )
    
    