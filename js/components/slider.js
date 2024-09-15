import { petData } from '../data/petData.js';
import { createPetCard } from './card.js';
import { openModal } from './modal.js';

export function initPetsSlider() {
    const slider = document.querySelector(".pets__slider");
    let leftCards = document.querySelector(".left__cards");
    let rightCards = document.querySelector(".right__cards");
    let activeCards = document.querySelector(".active__cards");

    const prevBtn = document.querySelector(".slider__btn--left");
    const nextBtn = document.querySelector(".slider__btn--right");

    let currentCardCount;
    let prevCardsCount = null;

    let backHistory = [];
    let forwardHistory = [];

    let callCount = 0;
    let initialized = false;

    const shuffledArr = shuffle([...petData]);

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function clearCardContainer(container) {
        container.innerHTML = '';
    }

    function updateCardCount() {
        const screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            currentCardCount = 1;
        } else if (screenWidth >= 768 && screenWidth <= 1279) {
            currentCardCount = 2;
        } else {
            currentCardCount = 3;
        }
    }

    function addUniqueCards(container, count) {
        callCount++;
        const usedIndices = new Set();

        const activeCardItems = activeCards.querySelectorAll(".slider__card");
        const activeCardsIndexes = Array.from(activeCardItems).map(
            (item) => item.getAttribute("data-modal-btn")
        );

        while (usedIndices.size < count) {
            let index = Math.floor(Math.random() * shuffledArr.length);
            const existingIndexes = Array.from(container.querySelectorAll(".slider__card")).map(
                (item) => item.getAttribute("data-modal-btn")
            );

            if (
                !usedIndices.has(index) &&
                !activeCardsIndexes.includes(index.toString()) &&
                !existingIndexes.includes(index.toString())
            ) {
                usedIndices.add(index);
                const newCard = createPetCard(index);
                container.appendChild(newCard);
            }
        }
    }

    function renderCards() {
        clearCardContainer(activeCards);
        clearCardContainer(leftCards);
        clearCardContainer(rightCards);

        addUniqueCards(activeCards, currentCardCount);
        addUniqueCards(leftCards, currentCardCount);
        addUniqueCards(rightCards, currentCardCount);

        if (!initialized) {
            backHistory.push(activeCards.cloneNode(true));
            initialized = true;
        }
    }

    function initFirstCards() {
        updateCardCount();
        renderCards();
    }

    function runTransition(className) {
        slider.classList.add(className);

        prevBtn.removeEventListener('click', moveLeft);
        nextBtn.removeEventListener('click', moveRight);
    }

    let lastClickedButton = null;
    let newCardsNeeded = false;

    const moveLeft = () => {
        if (lastClickedButton === "left") {
            newCardsNeeded = true;
        } else {
            newCardsNeeded = false;
        }
        lastClickedButton = "left";

        if (backHistory.length > 0 && !newCardsNeeded) {
            saveCurrentTo(forwardHistory);
            const prevState = backHistory.pop();
            clearCardContainer(leftCards);
            leftCards.innerHTML = prevState.innerHTML;
            runTransition("transition-left");
            return;
        }

        saveCurrentTo(forwardHistory);

        if (newCardsNeeded) {
            clearCardContainer(leftCards);
            addUniqueCards(leftCards, currentCardCount);
            saveCurrentTo(backHistory);
        }

        runTransition("transition-left");
    };

    const moveRight = () => {
        if (lastClickedButton === "right") {
            newCardsNeeded = true;
        } else {
            newCardsNeeded = false;
        }
        lastClickedButton = "right";

        if (forwardHistory.length > 0 && !newCardsNeeded) {
            saveCurrentTo(backHistory);
            const nextState = forwardHistory.pop();
            clearCardContainer(rightCards);
            rightCards.innerHTML = nextState.innerHTML;
            runTransition("transition-right");
            return;
        }

        saveCurrentTo(backHistory);

        if (newCardsNeeded) {
            clearCardContainer(rightCards);
            addUniqueCards(rightCards, currentCardCount);
            forwardHistory = [];
        }

        runTransition("transition-right");
    };

    function saveCurrentTo(historyArray) {
        historyArray.push(activeCards.cloneNode(true));
    }

    prevBtn.addEventListener('click', moveLeft);
    nextBtn.addEventListener('click', moveRight);

    slider.addEventListener("animationend", (animationEvent) => {
        updateCardCount();

        if (animationEvent.animationName === "move-left") {
            slider.classList.remove("transition-left");
            activeCards.innerHTML = leftCards.innerHTML;
            clearCardContainer(leftCards);
            addUniqueCards(leftCards, currentCardCount);
        } else {
            slider.classList.remove("transition-right");
            activeCards.innerHTML = rightCards.innerHTML;
            clearCardContainer(rightCards);
            addUniqueCards(rightCards, currentCardCount);
        }

        prevBtn.addEventListener('click', moveLeft);
        nextBtn.addEventListener('click', moveRight);
    });

    function updateCardDisplay() {
        updateCardCount();

        if (currentCardCount === prevCardsCount) return;
        prevCardsCount = currentCardCount;

        renderCards();
    }

    function handleMediaQueryChange() {
        updateCardDisplay();
    }

    window.addEventListener('resize', handleMediaQueryChange);

    window.addEventListener('load', () => {
        initFirstCards();
        handleMediaQueryChange();
    });


    document.addEventListener('click', e => {
        const btn = e.target.closest('[data-modal-btn]');
        if (btn) openModal(+btn.dataset.modalBtn);
    });

    initFirstCards();
}
