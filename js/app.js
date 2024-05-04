// Selecciona los elementos del DOM necesarios para la funcionalidad de la aplicación
const addBox = document.querySelector('.add-box'),
    popupBox = document.querySelector('.popup-box'),
    closeIcon = popupBox.querySelector('header i'),
    addButton = popupBox.querySelector('button'),
    title = document.querySelector('input'),
    description = document.querySelector('textarea'),
    popupTitle = popupBox.querySelector('header p');

// Define un arreglo con los nombres de los meses en español
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Recupera las notas almacenadas en el localStorage o inicializa un arreglo vacío si no hay ninguna
const notes = JSON.parse(localStorage.getItem('notes') || ['']);

// Define variables para controlar si se está actualizando una nota y cuál es el ID de la nota a actualizar
let isUpdate = false, updateID;

// Agrega un evento de click al botón para agregar notas que muestra el formulario para agregar una nota
addBox.addEventListener('click', () => {
    title.focus();
    popupBox.classList.add('show');
});

// Agrega un evento de click al icono de cierre que oculta el formulario para agregar una nota
closeIcon.addEventListener('click', () => {

    // Resetea los campos del formulario y el estado de actualización
    isUpdate = false;
    title.value = '';
    description.value = '';

    // Cambia el texto del botón y del título del formulario
    addButton.textContent = 'Agregar Nota';
    popupTitle.textContent = 'Agregar Nota'

    // Oculta el formulario
    popupBox.classList.remove('show');
});

// Define una función para mostrar las notas existentes
const showNotes = () => {
    // Elimina todas las notas existentes
    [...document.querySelectorAll('.note')].map(note => note.remove());
    // Renderiza todas las notas almacenadas
    notes.map((note, index) => render(note, index));
};

// Agrega un evento de click al botón para agregar o actualizar una nota
addButton.addEventListener('click', (e) => {
    e.preventDefault();

    // Obtiene el título y la descripción de la nota del formulario
    let noteTitle = title.value,
        noteDesc = description.value;

    // Si el título o la descripción no están vacíos, crea una nueva nota o actualiza una existente
    if (noteTitle || noteDesc) {

        // Crea un nuevo objeto de fecha y obtiene el mes, el día y el año
        let newObj = new Date,
            month = months[newObj.getMonth()],
            day = newObj.getDay(),
            year = newObj.getFullYear();

        // Crea un objeto con la información de la nota
        let infoNote = {

            title: noteTitle,
            description: noteDesc,
            date: `${month} ${day} ${year}`

        };

        // Si no se está actualizando una nota, agrega la nueva nota al arreglo de notas
        // Si se está actualizando una nota, reemplaza la nota existente con la nueva información
        if (!isUpdate) {
            notes.push(infoNote);
        } else {
            isUpdate = false;
            notes[updateID] = infoNote;
        };

        // Almacena las notas en el localStorage
        localStorage.setItem('notes', JSON.stringify(notes));

        // Cierra el formulario
        closeIcon.click();

        // Muestra las notas
        showNotes();
    };
});

// Define una función para renderizar una nota
const render = ({ title, description, date }, index) => {
    // Crea el elemento HTML para la nota
    let liTag = `<li class="note">
            <div class="details">
                <p>${title}</p>
                <span>${description}</span>
            </div>
            <div class="button-content">
                <span>${date}</span>
                <div class="settings">
                    <i id="subMenu" class="ri-more-fill"></i>
                    <ul class="menu">
                        <li 
                        id="update" 
                        data-id="${index}" 
                        data-titl="${title}"
                        data-desc="${description}"
                        >
                            <i class="ri-edit-2-fill"></i>
                            Editar
                        </li>
                        <li id="eliminar" data-id="${index}">
                            <i class="ri-delete-bin-2-line"></i>
                            Eliminar
                        </li>
                    </ul>
                </div>
            </div>
        </li>`;

    // Inserta la nota después del botón para agregar notas
    addBox.insertAdjacentHTML('afterend', liTag);

    // Agrega eventos de click a los botones del menú de la nota
    document.getElementById('subMenu').addEventListener('click', e => showMenu(e));
    document.getElementById('eliminar').addEventListener('click', e => eliminarNote(e));
    document.getElementById('update').addEventListener('click', e => updateNote(e))
};

// Muestra las notas al cargar la página
showNotes();

// Define una función para mostrar el menú de una nota
const showMenu = ({ target }) => {
    // Muestra el menú de la nota
    target.parentElement.classList.add('show');

    // Agrega un evento de click al documento que oculta el menú si se hace click fuera de él
    document.addEventListener('click', e => {

        if (e.target.tagName != 'I' || e.target != target) {
            target.parentElement.classList.remove('show');
        };
    });
};

// Define una función para eliminar una nota
const eliminarNote = ({ target }) => {
    // Obtiene el ID de la nota a eliminar
    const notesId = target.dataset.id;
    // Pide confirmación para eliminar la nota
    let confirmDel = confirm('Estas Seguro de Eliminar la Nota');
    // Si el usuario confirma, elimina la nota y actualiza el localStorage
    if (!confirmDel) return;
    notes.splice(notesId, 1);
    localStorage.setItem('notes', JSON.stringify(notes));

    // Muestra las notas
    showNotes();
};

// Define una función para actualizar una nota
const updateNote = ({ target }) => {
    // Obtiene el ID, el título y la descripción de la nota a actualizar
    const { id, titl, desc } = target.dataset;

    // Establece el estado de actualización y el ID de la nota a actualizar
    isUpdate = true;
    updateID = id;
    // Rellena el formulario con la información de la nota a actualizar
    title.value = titl;
    description.value = desc;

    // Muestra el formulario
    addBox.click();

    // Cambia el texto del botón y del título del formulario
    addButton.textContent = 'Actualizar Nota';
    popupTitle.textContent = 'Actualizar Nota'
    console.log({ id, titl, desc });
};
