import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard } from './card.js';
import { openPopup, closePopup, setModalWindowEventListeners } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { getUserInfo, getInitialCards, updateUserInfo, addCard, deleteCardFromServer } from './api.js';
import { likeCard, unlikeCard } from './api.js';


// DOM: элементы
const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupConfirm = document.querySelector('.popup_type_confirm');
const confirmForm = popupConfirm.querySelector('form[name="confirm-delete"]');
const popupImage = document.querySelector('.popup_type_image');
const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');

const buttonOpenEdit = document.querySelector('.profile__edit-button');
const buttonOpenNewCard = document.querySelector('.profile__add-button');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const formEditProfile = document.querySelector('form[name="edit-profile"]');
const nameInput = formEditProfile.querySelector('.popup__input_type_name');
const jobInput = formEditProfile.querySelector('.popup__input_type_description');

const formNewCard = document.querySelector('form[name="new-place"]');
const cardNameInput = formNewCard.querySelector('.popup__input_type_card-name');
const cardLinkInput = formNewCard.querySelector('.popup__input_type_url');

const profileAvatar = document.querySelector('.profile__image');

let currentUserId = null;

// ✅ временное хранилище карточки для удаления
let cardToDelete = null;
let cardIdToDelete = null;

// Конфигурация для валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Включение валидации всех форм
enableValidation(validationConfig);

// Обработчики

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const name = nameInput.value;
  const about = jobInput.value;

  updateUserInfo({ name, about })
    .then(user => {
      profileTitle.textContent = user.name;
      profileDescription.textContent = user.about;
      closePopup(popupEdit);
    })
    .catch(err => {
      console.error(err);
    });
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();

  const name = cardNameInput.value;
  const link = cardLinkInput.value;

  addCard({ name, link })
    .then(cardData => {
      const newCard = createCard(cardData, toggleLike, handleImageClick, handleDeleteCard, currentUserId);
      placesList.prepend(newCard);
      closePopup(popupNewCard);
      formNewCard.reset();
      clearValidation(formNewCard, validationConfig);
    })
    .catch(err => {
      console.error('Ошибка добавления карточки:', err);
    });
}

function handleImageClick(data) {
  popupImageElement.src = data.link;
  popupImageElement.alt = data.name;
  popupCaption.textContent = data.name;
  openPopup(popupImage);
}

function handleDeleteCard(cardElement, cardId) {
  cardToDelete = cardElement;
  cardIdToDelete = cardId;
  openPopup(popupConfirm);
}

function toggleLike(button, cardId, likeCounter) {
  const isLiked = button.classList.contains('card__like-button_is-active');
  const request = isLiked ? unlikeCard(cardId) : likeCard(cardId);

  request
    .then(updatedCard => {
      button.classList.toggle('card__like-button_is-active');
      likeCounter.textContent = updatedCard.likes.length;
    })
    .catch(err => {
      console.error('Ошибка при изменении лайка:', err);
    });
}


// Удаление после подтверждения
confirmForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  deleteCardFromServer(cardIdToDelete)
    .then(() => {
      if (cardToDelete) {
        cardToDelete.remove();
      }
      closePopup(popupConfirm);
    })
    .catch(err => {
      console.error('Ошибка при удалении карточки:', err);
    });
});

// Установка обработчиков для всех попапов
document.querySelectorAll('.popup').forEach(setModalWindowEventListeners);

// Кнопка редактирования профиля
buttonOpenEdit.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(formEditProfile, validationConfig);
  openPopup(popupEdit);
});

// Кнопка добавления новой карточки
buttonOpenNewCard.addEventListener('click', () => {
  formNewCard.reset();
  clearValidation(formNewCard, validationConfig);
  openPopup(popupNewCard);
});

// Обработчики отправки форм
formEditProfile.addEventListener('submit', handleEditProfileSubmit);
formNewCard.addEventListener('submit', handleNewCardSubmit);

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.reverse().forEach(cardData => {
      const cardElement = createCard(cardData, toggleLike, handleImageClick, handleDeleteCard, currentUserId);
      placesList.append(cardElement);
    });
  })
  .catch(err => {
    console.error('Ошибка загрузки данных:', err);
  });
