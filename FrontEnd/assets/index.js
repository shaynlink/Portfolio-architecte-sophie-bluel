
// Get gallery div element
const galleryElement = document.getElementById('gallery');

// Generate all works element from window.data.works
function getWorks() {
    // Filter works by window.filtersActive
    const works = window.filtersActive.length > 0
        ? window.data.works
            .filter((work) => window.filtersActive.includes(work.category.id.toString()))
        : window.data.works;

    // Remove all element from gallery element
    galleryElement.innerHTML = '';

    // Generate all works element filtered
    for (const work of works) {
        const figureElement = document.createElement('figure');
        
        const imgElement = document.createElement('img');
        imgElement.src = work.imageUrl;
        imgElement.alt = work.title;

        const figcaptionElement = document.createElement('figcaption');
        figcaptionElement.innerText = work.title;

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);

        galleryElement.appendChild(figureElement);
    }
}

// Get filters Element
const filtersElement = document.getElementById('filters');
// Get filter Select Element
const imageCategory = document.getElementById('image-category');

function getFilters() {
    // Get all filters from api
    const filters = window.data.categories;

    // Remove all filters
    galleryElement.innerHTML = '';

    // Create "tous" element
    const filterAllElement = document.createElement('div');
    filterAllElement.classList.add('filter');
    filterAllElement.dataset.id = 'none';
    
    // if no filters settle automaticaly set "tous" filter to active
    if (window.filtersActive.length == 0) {
        filterAllElement.classList.add('filter-active');
    }

    const pAllElement = document.createElement('p');
    pAllElement.innerText = 'Tous';
    
    filterAllElement.appendChild(pAllElement);

    filtersElement.appendChild(filterAllElement)

    // Generate filter element
    for (const filter of filters) {
        const filterElement = document.createElement('div');
        filterElement.classList.add('filter');
        filterElement.dataset.id = filter.id;
        
        const pElement = document.createElement('p');
        pElement.innerText = filter.name;

        filterElement.appendChild(pElement);

        filtersElement.appendChild(filterElement);

        const optionElement = document.createElement('option');
        optionElement.value = filter.id;
        optionElement.innerText = filter.name;

        imageCategory.appendChild(optionElement);
    }
}

// Get works and categories (filters) from API
async function getData() {
    await fetch(makeUrl('/works'), { method: 'GET' })
        .then(async (res) => await res.json())
        .then((works) => window.data.works = works)
    
    await fetch(makeUrl('/categories'), { method: 'GET'})
        .then(async (res) => await res.json())
        .then((categories) => window.data.categories = categories);
}

// Put filter id to window.filtersActive
// And change type number to string
function setToFilterActive(filterId) {
    const id = typeof filterId === 'number'
        ?  id.toString()
        : filterId;

    window.filtersActive.push(id);
}

// Update filters state
function updateFilterState() {
    // If not filters settled
    if (window.filtersActive.length === 0) {
        // Remove active from all filters expect "tous" filter
        filtersElement.childNodes.forEach((child) => {
            if (child.nodeName == '#text') return;
            if (!child.classList.contains('filter')) return;
            const filterId = child.dataset.id;

            if (filterId === 'none') {
                if (child.classList.contains('filter-active')) return;
                child.classList.add('filter-active');
            } else {
                child.classList.remove('filter-active');
            }
        })
    } else {
        // Update state from all filters
        filtersElement.childNodes.forEach((child) => {
            if (child.nodeName == '#text') return;
            if (!child.classList.contains('filter')) return;
            const filterId = child.dataset.id;
    
            if (filterId === 'none') {
                child.classList.remove('filter-active');
            } else {
                if (!window.filtersActive.includes(filterId)) {
                    child.classList.remove('filter-active');
                    return;
                }
                if (child.classList.contains('filter-active')) return;
                child.classList.add('filter-active');
            }
        })
    }
}

function connectedMode() {
    document.documentElement.style.setProperty('--display-connected', 'block');
    document.documentElement.style.setProperty('--display-connected-flex', 'flex');
    document.documentElement.style.setProperty('--display-unconnected', 'none');
}

function unConnectedMode() {
    document.documentElement.style.setProperty('--display-connected', 'none');
    document.documentElement.style.setProperty('--display-connected-flex', 'none');
    document.documentElement.style.setProperty('--display-unconnected', 'block');
}

const modal = document.getElementById('modal-projects');
const editModal = document.getElementById('edit-modal');
const imagefileInput = document.getElementById('image-file');
const imageInfo = document.getElementById('add-photo-info');
const imagePreview = document.getElementById('add-photo-preview');
const imageTitle = document.getElementById('image-title');

function main() {
    if (window.isConnected) {
        connectedMode();
        
        const btnOpenModal = document.getElementById('btn-open-modal');
        btnOpenModal.onclick = () => {
            editModal.style.display = 'flex';
        };
    }

    const logOut = document.getElementById('log-out');

    logOut.addEventListener('click', () => {
        window.localStorage.removeItem('user');
        unConnectedMode();
    });

    // Get data from api
    getData()
        .then(() => {
            putWorksToModal();
            // Generate filters and works
            getFilters();
            getWorks();
            
            // Filters system
            filtersElement.childNodes.forEach((child) => {
                // skip undesirable child
                if (child.nodeName == '#text') return;

                // Set click event for all filters
                child.addEventListener('click', () => {
                    const filterId = child.dataset.id;

                    // If "tous" filter is clicked
                    // then remove all filters from window.filtersActive
                    if (filterId === 'none') {
                        window.filtersActive = [];
                    } else {
                        // If filter clicked is already active, remove it
                        if (child.classList.contains('filter-active')) {
                            const arr = removeFromArray(window.filtersActive, filterId);
                            window.filtersActive = arr;
                        } else {
                            // Else add it to window.filtersActive
                            setToFilterActive(filterId);
                        }
                    }

                    // Update filters and works in accordance to window.filtersActive
                    updateFilterState();
                    getWorks();
                })
            });
        });

    imagefileInput.addEventListener('change', () => {
        const [file] = imagefileInput.files;

        imagePreview.innerText = '';

        if (file) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.height = '100%';
            imageInfo.style.display = 'none';
            if (imageTitle.value == '') {
                imageTitle.value = file.name?.split('.')[0].replaceAll('-', ' ') ?? '';
            }
            imagePreview.appendChild(img);
        }
    });

    const addProjectbtn = document.getElementById('add-project-btn');

    addProjectbtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        evt.stopPropagation();

        const [file] = imagefileInput.files;
        const {value: title} = imageTitle;
        const {value: categoryId} = imageCategory;

        const formData = new FormData();
        formData.append('image', file, file.name);
        formData.append('title', title);
        formData.append('category', parseInt(categoryId));
        
        fetch(makeUrl('/works'), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getToLocalJSON('user').token}`
            },
            body: formData
        })
        .then(async (res) => {
            if (res.status == 201) {
                return await res.json()
            }
            alert('Unable to save work');
        })
        .then((work) => {
            work.categoryId = parseInt(categoryId);
            work.category = {id: work.categoryId}
            window.data.works.push(work);
            putWorksToModal();
            closeProjectPage();
            window.filtersActive = [];
            updateFilterState();
            getWorks();
        })
        .catch((e) => {
            console.error(e);
            alert('Unable to save work');
        })
    });

    const pageNextBtn = document.getElementById('page-next-btn');

    pageNextBtn.addEventListener('click', () => loadEditProjectPage());

    const pageBackIcon = document.getElementById('page-back-icon');
    pageBackIcon.addEventListener('click', () => loadAddProjectPage());

    const pageCloseIcon = document.getElementById('page-close-icon');
    pageCloseIcon.addEventListener('click', () => closeProjectPage());
}

function loadAddProjectPage() {
    document.getElementById('add-work-page').dataset.state = 'inactive';
    document.getElementById('edit-work-page').dataset.state = 'active';
    document.getElementById('page-back-icon').style.display = 'block';
}

function loadEditProjectPage() {
    // Reset data
    imagefileInput.files = new DataTransfer().files;
    imagePreview.innerText = '';
    imageInfo.style.display = 'flex';
    imageTitle.value = '';

    document.getElementById('page-back-icon').style.display = 'block';
    document.getElementById('edit-work-page').dataset.state = 'inactive';
    document.getElementById('add-work-page').dataset.state = 'active';
}

function closeProjectPage() {
    loadAddProjectPage();
    editModal.style.display = 'none';
}

function putWorksToModal() {
    // Clear all works displayed on modal
    modal.innerHTML = '';

    // Put works to modal
    window.data.works.forEach((work) => {
        const photo = document.createElement('div');
        photo.classList.add('photo');
        
        const btns = document.createElement('div');
        btns.classList.add('btns');

        const btnDelete = document.createElement('div');
        btnDelete.classList.add('btn-box');
        btnDelete.id = `delete-${work.id}`

        const iconDelete = document.createElement('i');
        iconDelete.classList.add('fa-solid', 'fa-trash-can');

        btnDelete.appendChild(iconDelete);
        btns.appendChild(btnDelete);

        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;

        photo.appendChild(btns);
        photo.appendChild(img);
        photo.innerHTML += 'éditer';

        modal.appendChild(photo);

        const btnDeleteDOM = document.getElementById(btnDelete.id);

        btnDeleteDOM.addEventListener('click', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();

            fetch(makeUrl(`/works/${work.id}`), {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToLocalJSON('user').token}`
                },
                redirect: 'error'
            }).then((res) => {
                if (res.status === 204) {
                    window.data.works = removeFromArray(window.data.works, work.id, 'id');
                    putWorksToModal();
                    getWorks();
                } else {
                    console.error('Unable to delete');
                }
            })
            .catch((e) => console.error(e));
        });
    });
}

main();