function openPopup(popup) {
  popup.classList.add('popup_opened');
  document.addEventListener('keydown', handleEscClose);
}

function closePopup(popup) {
  popup.classList.remove('popup_opened');
  document.removeEventListener('keydown', handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_opened');
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}

export { openPopup, closePopup };
