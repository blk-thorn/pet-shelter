import { petData } from '../data/petData.js';
import { createPetCard } from './card.js';
import { openModal, closeModal } from './modal.js';

export function initPagination() {
    const petsArr = (() => {
        const copies = [];
        for (let i = 0; i < 6; i++) {
            const shuffled = [...petData]
                .map(pet => ({ pet, rand: Math.random() }))
                .sort((a, b) => a.rand - b.rand)
                .map(({ pet }) => pet);
            copies.push(...shuffled);
        }
        return copies;
    })();

    let currentPage = 1;

    const container = document.querySelector('.cards__container');
    const pageNumEl = document.querySelector('.pagenav__active');
    const btnPrev = document.querySelector('.pagenav__button--prev');
    const btnNext = document.querySelector('.pagenav__button--next');
    const btnFirst = document.querySelector('.pagenav__button--first');
    const btnLast = document.querySelector('.pagenav__button--last');

    function getCardsPerPage() {
        const width = window.innerWidth;
        if (width <= 320) return 3;
        if (width <= 768) return 6;
        return 8;
    }

    function render() {
        const perPage = getCardsPerPage();
        const start = (currentPage - 1) * perPage;
        const pagePets = petsArr.slice(start, start + perPage);

        container.innerHTML = '';

        pagePets.forEach(pet => {
            const originalIndex = petData.indexOf(pet);
            const card = createPetCard(originalIndex);
            container.appendChild(card);
        });

        pageNumEl.textContent = currentPage;
        const totalPages = Math.ceil(petsArr.length / perPage);

        const isFirst = currentPage === 1;
        const isLast = currentPage === totalPages;

        btnPrev.disabled = isFirst;
        btnNext.disabled = isLast;
        btnFirst.disabled = isFirst;
        btnLast.disabled = isLast;

        [btnPrev, btnNext, btnFirst, btnLast].forEach(btn =>
            btn.classList.toggle('disabled', btn.disabled)
        );
    }


    btnNext.onclick = () => {
        const totalPages = Math.ceil(petsArr.length / getCardsPerPage());
        if (currentPage < totalPages) currentPage++;
        render();
    };

    btnPrev.onclick = () => {
        if (currentPage > 1) currentPage--;
        render();
    };

    btnLast.onclick = () => {
        currentPage = Math.ceil(petsArr.length / getCardsPerPage());
        render();
    };

    btnFirst.onclick = () => {
        currentPage = 1;
        render();
    };


    container.addEventListener('click', e => {
        const btn = e.target.closest('[data-modal-btn]');
        if (btn) {
            openModal(btn.dataset.modalBtn);
        }
    });


    window.addEventListener('click', e => {
        if (
            e.target.classList.contains('modal__wrapper') ||
            e.target.classList.contains('modal__button') ||
            e.target.hasAttribute('data-modal-window')
        ) {
            closeModal();
        }
    });

    window.addEventListener('resize', () => {
        render();
    });

    render();
}
