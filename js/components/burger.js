export function initBurgerMenu() {
    const menu = document.querySelector('.menu__list');
    const burger = document.querySelector('.burger');
    const body = document.body;

    if (!menu || !burger) return;

    const toggle = () => {
        menu.classList.toggle('menu__list--active');
        burger.classList.toggle('burger--active');
        body.classList.toggle('no-scroll');
    };

    burger.addEventListener('click', toggle);
    menu.addEventListener('click', e => {
        if (e.target.classList.contains('menu__item-link')) toggle();
    });

    document.body.addEventListener('click', e => {
        if (e.target.closest('.burger') || e.target.closest('.menu__list')) return;
        menu.classList.remove('menu__list--active');
        burger.classList.remove('burger--active');
        body.classList.remove('no-scroll');
    });
}
