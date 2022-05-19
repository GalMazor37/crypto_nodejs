const backdrop = document.querySelector('.backdrop');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
  backdrop.style.display = 'none';
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);
