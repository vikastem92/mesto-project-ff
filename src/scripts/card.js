function deleteCard(cardElement, cardId) {
  cardElement.remove();
}

function createCard(data, handleLike, handleImageClick, handleDelete, currentUserId) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  likeCount.textContent = data.likes.length;

  if (data.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => handleDelete(cardElement, data._id));
  }

  likeButton.addEventListener('click', () => handleLike(likeButton, data._id, likeCount));
  cardImage.addEventListener('click', () => handleImageClick(data));

  return cardElement;
}

export { createCard, deleteCard };
