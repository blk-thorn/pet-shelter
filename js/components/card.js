import { petData } from '../data/petData.js';

export function createPetCard(index) {
    const pet = petData[index];

    const li = document.createElement('li');
    li.className = 'slider__card cards__item';
    li.dataset.modalBtn = index;

    const img = document.createElement('img');
    img.src = pet.img;
    img.alt = pet.name;
    img.className = 'cards__img';

    const h3 = document.createElement('h3');
    h3.className = 'slider__card-title cards__item-title';
    h3.textContent = pet.name;

    const button = document.createElement('button');
    button.className = 'card__btn cards__btn';
    button.textContent = 'Learn more';

    li.appendChild(img);
    li.appendChild(h3);
    li.appendChild(button);

    return li;
}
