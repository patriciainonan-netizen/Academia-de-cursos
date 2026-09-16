const formulario = document.getElementById("formularioEstudiante");

const dni = document.getElementById("dni");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const curso = document.getElementById("curso");

const nota1 = document.getElementById("nota1");
const nota2 = document.getElementById("nota2");
const nota3 = document.getElementById("nota3");

const listaEstudiantes = document.getElementById("listaEstudiantes");
const mensajeVacio = document.getElementById("mensajeVacio");
const cantidadEstudiantes = document.getElementById("cantidadEstudiantes");
const limpiar = document.getElementById("limpiar");

let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];

mostrarEstudiantes();

formulario.addEventListener("submit", function(event) {
    event.preventDefault();
    limpiarErrores();

    let formularioValido = true;

    if (dni.value.trim() === "") {
        mostrarError("errorDni", "El DNI es obligatorio.");
        formularioValido = false;
    } else if (!/^[0-9]{8}$/.test(dni.value)) {
        mostrarError("errorDni", "El DNI debe tener 8 números.");
        formularioValido = false;
    } else if (estudiantes.some(function(estudiante) {
        return estudiante.dni === dni.value;
    })) {
        mostrarError("errorDni", "Este DNI ya está registrado.");
        formularioValido = false;
    }

    if (nombre.value.trim() === "") {
        mostrarError("errorNombre", "El nombre es obligatorio.");
        formularioValido = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(nombre.value)) {
        mostrarError("errorNombre", "El nombre solo debe contener letras.");
        formularioValido = false;
    }

    if (apellido.value.trim() === "") {
        mostrarError("errorApellido", "El apellido es obligatorio.");
        formularioValido = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(apellido.value)) {
        mostrarError("errorApellido", "El apellido solo debe contener letras.");
        formularioValido = false;
    }

    if (curso.value.trim() === "") {
        mostrarError("errorCurso", "El curso es obligatorio.");
        formularioValido = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s]+$/.test(curso.value)) {
        mostrarError("errorCurso", "Ingrese un nombre de curso válido.");
        formularioValido = false;
    }

    let valorNota1 = Number(nota1.value);
    let valorNota2 = Number(nota2.value);
    let valorNota3 = Number(nota3.value);

    if (nota1.value === "") {
        mostrarError("errorNota1", "La nota es obligatoria.");
        formularioValido = false;
    } else if (valorNota1 < 0 || valorNota1 > 20) {
        mostrarError("errorNota1", "La nota debe estar entre 0 y 20.");
        formularioValido = false;
    }

    if (nota2.value === "") {
        mostrarError("errorNota2", "La nota es obligatoria.");
        formularioValido = false;
    } else if (valorNota2 < 0 || valorNota2 > 20) {
        mostrarError("errorNota2", "La nota debe estar entre 0 y 20.");
        formularioValido = false;
    }

    if (nota3.value === "") {
        mostrarError("errorNota3", "La nota es obligatoria.");
        formularioValido = false;
    } else if (valorNota3 < 0 || valorNota3 > 20) {
        mostrarError("errorNota3", "La nota debe estar entre 0 y 20.");
        formularioValido = false;
    }

    if (!formularioValido) {
        return;
    }

    let promedio = (valorNota1 + valorNota2 + valorNota3) / 3;
    promedio = promedio.toFixed(2);

    let condicion;

    if (promedio >= 11) {
        condicion = "Aprobado";
    } else {
        condicion = "Desaprobado";
    }

    const estudiante = {
        dni: dni.value,
        nombre: nombre.value.trim(),
        apellido: apellido.value.trim(),
        curso: curso.value.trim(),
        nota1: valorNota1,
        nota2: valorNota2,
        nota3: valorNota3,
        promedio: promedio,
        condicion: condicion
    };

    estudiantes.push(estudiante);

    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));

    mostrarEstudiantes();
    formulario.reset();
});

function mostrarEstudiantes() {
    listaEstudiantes.innerHTML = "";

    if (estudiantes.length === 0) {
        mensajeVacio.style.display = "block";
    } else {
        mensajeVacio.style.display = "none";
    }

    estudiantes.forEach(function(estudiante, indice) {
        const fila = document.createElement("tr");

        let claseCondicion = "";

        if (estudiante.condicion === "Aprobado") {
            claseCondicion = "aprobado";
        } else {
            claseCondicion = "desaprobado";
        }

        fila.innerHTML = `
            <td>${estudiante.dni}</td>
            <td>${estudiante.nombre}</td>
            <td>${estudiante.apellido}</td>
            <td>${estudiante.curso}</td>
            <td>${estudiante.nota1}</td>
            <td>${estudiante.nota2}</td>
            <td>${estudiante.nota3}</td>
            <td>${estudiante.promedio}</td>
            <td class="${claseCondicion}">${estudiante.condicion}</td>
            <td>
                <button class="btn-eliminar" onclick="eliminarEstudiante(${indice})">
                    Eliminar
                </button>
            </td>
        `;

        listaEstudiantes.appendChild(fila);
    });

    cantidadEstudiantes.textContent =
        estudiantes.length + " estudiante(s)";
}

function eliminarEstudiante(indice) {
    const confirmar = confirm("¿Está seguro de eliminar este estudiante?");

    if (confirmar) {
        estudiantes.splice(indice, 1);

        localStorage.setItem(
            "estudiantes",
            JSON.stringify(estudiantes)
        );

        mostrarEstudiantes();
    }
}

function mostrarError(id, mensaje) {
    document.getElementById(id).textContent = mensaje;
}

function limpiarErrores() {
    document.getElementById("errorDni").textContent = "";
    document.getElementById("errorNombre").textContent = "";
    document.getElementById("errorApellido").textContent = "";
    document.getElementById("errorCurso").textContent = "";
    document.getElementById("errorNota1").textContent = "";
    document.getElementById("errorNota2").textContent = "";
    document.getElementById("errorNota3").textContent = "";
}

limpiar.addEventListener("click", function() {
    formulario.reset();
    limpiarErrores();
});
