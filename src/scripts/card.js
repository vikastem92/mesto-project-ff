import { likeCard, unlikeCard } from './api.js';

function deleteCard(cardElement, cardId) {
  cardElement.remove();
}

function toggleLike(button, cardId, likeCounter, currentUserId) {
  const isLiked = button.classList.contains('card__like-button_is-active');
  const request = isLiked ? unlikeCard(cardId) : likeCard(cardId);

  request
    .then(updatedCard => {
      const isNowLiked = updatedCard.likes.some(user => user._id === currentUserId);

      button.classList.toggle('card__like-button_is-active', isNowLiked);
      likeCounter.textContent = updatedCard.likes.length;
    })
    .catch(err => {
      console.error('Ошибка при изменении лайка:', err);
    });
}

function createCard(data, handleImageClick, handleDelete, currentUserId) {
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

  const isLikedByCurrentUser = data.likes.some(user => user._id === currentUserId);
  if (isLikedByCurrentUser) {
    likeButton.classList.add('card__like-button_is-active');
  }

  if (data.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => handleDelete(cardElement, data._id));
  }

  likeButton.addEventListener('click', () => toggleLike(likeButton, data._id, likeCount, currentUserId));
  cardImage.addEventListener('click', () => handleImageClick(data));

  return cardElement;
}

export { createCard, deleteCard };

