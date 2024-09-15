import { petData } from '../data/petData.js';

let modal = null;

export function createModal() {
    if (document.querySelector('.modal')) return;

    modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'none';

    const wrapper = document.createElement('div');
    wrapper.className = 'modal__wrapper';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal__button';
    closeBtn.textContent = '×';

    const content = document.createElement('div');
    content.className = 'modal__content';

    const inner = document.createElement('div');
    inner.className = 'modal__inner';
    const img = document.createElement('img');
    img.className = 'modal__img';

    const textDiv = document.createElement('div');
    textDiv.className = 'modal__text';

    const title = document.createElement('h3');
    title.className = 'modal__title';

    const subtitle = document.createElement('h4');
    subtitle.className = 'modal__subtitle';

    const desc = document.createElement('p');
    desc.className = 'modal__description';

    const ul = document.createElement('ul');
    ul.className = 'modal__list';

    const labels = ['Age', 'Inoculations', 'Diseases', 'Parasites'];
    labels.forEach(label => {
        const li = document.createElement('li');
        li.className = 'modal__item';
        li.innerHTML = `<strong>${label}:</strong> <span class="${label.toLowerCase()}"></span>`;
        ul.appendChild(li);
    });

    textDiv.append(title, subtitle, desc, ul);
    inner.appendChild(img);
    content.append(inner, textDiv);

    wrapper.appendChild(closeBtn);
    wrapper.appendChild(content);

    modal.appendChild(wrapper);
    document.body.appendChild(modal);

    wrapper.addEventListener('click', e => {
        if (e.target === wrapper || e.target === closeBtn) {
            closeModal();
        }
    });
}

export function openModal(index) {
    if (!modal) createModal();

    const pet = petData[index % 8];

    modal.querySelector('.modal__img').src = pet.img;
    modal.querySelector('.modal__title').textContent = pet.name;
    modal.querySelector('.modal__subtitle').innerHTML = `<strong>${pet.type} - </strong> ${pet.breed}`;
    modal.querySelector('.modal__description').textContent = pet.description;
    modal.querySelector('.age').textContent = pet.age;
    modal.querySelector('.inoculations').textContent = Array.isArray(pet.inoculations) ? pet.inoculations.join(', ') : pet.inoculations;
    modal.querySelector('.diseases').textContent = Array.isArray(pet.diseases) ? pet.diseases.join(', ') : pet.diseases;
    modal.querySelector('.parasites').textContent = Array.isArray(pet.parasites) ? pet.parasites.join(', ') : pet.parasites;

    modal.style.display = 'flex';
    document.body.classList.add('no-scroll');
    document.body.style.overflow = 'hidden';
}

export function closeModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
        document.body.style.overflow = '';
    }
}
