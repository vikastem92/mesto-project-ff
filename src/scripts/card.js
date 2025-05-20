function toggleLike(button) {
  button.classList.toggle('card__like-button_is-active');
}

function deleteCard(card) {
  card.remove();
}

function createCard(data, handleLike, handleImageClick, handleDelete) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  deleteButton.addEventListener('click', () => handleDelete(cardElement));
  likeButton.addEventListener('click', () => handleLike(likeButton));
  cardImage.addEventListener('click', () => handleImageClick(data));

  return cardElement;
}

export { createCard, toggleLike, deleteCard };