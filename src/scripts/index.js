import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard } from './card.js';
import { openPopup, closePopup, setModalWindowEventListeners } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { getUserInfo, getInitialCards, updateUserInfo, addCard, deleteCardFromServer } from './api.js';
import { updateAvatar } from './api.js';


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

const popupAvatar = document.querySelector('.popup_type_avatar');
const formAvatar = popupAvatar.querySelector('form[name="edit-avatar"]');
const avatarInput = formAvatar.querySelector('.popup__input_type_avatar-url');


let currentUserId = null;

// временное хранилище карточки для удаления
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

function renderLoading(isLoading, buttonElement, defaultText = 'Сохранить') {
  buttonElement.textContent = isLoading ? 'Сохранение...' : defaultText;
}


// Обработчики

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const button = formEditProfile.querySelector('.popup__button');
  renderLoading(true, button);

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
    })
    .finally(() => {
      renderLoading(false, button);
    });
}


function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const button = evt.submitter;
  renderLoading(true, button);

  const name = cardNameInput.value;
  const link = cardLinkInput.value;

  addCard({ name, link })
    .then(cardData => {
      const newCard = createCard(cardData, handleImageClick, handleDeleteCard, currentUserId);
      placesList.prepend(newCard);
      closePopup(popupNewCard);
      formNewCard.reset();
      clearValidation(formNewCard, validationConfig);
    })
    .catch(err => {
      console.error('Ошибка добавления карточки:', err);
    })
    .finally(() => {
      renderLoading(false, button);
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

// Клик по аватару — открыть форму
profileAvatar.addEventListener('click', () => {
  formAvatar.reset();
  clearValidation(formAvatar, validationConfig);
  openPopup(popupAvatar);
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

// Отправка формы обновления аватара
formAvatar.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const button = formAvatar.querySelector('.popup__button');
  renderLoading(true, button);

  const avatarUrl = avatarInput.value;

  updateAvatar(avatarUrl)
    .then(userData => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closePopup(popupAvatar);
    })
    .catch(err => {
      console.error('Ошибка обновления аватара:', err);
    })
    .finally(() => {
      renderLoading(false, button);
    });
});


Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.reverse().forEach(cardData => {
      console.log(cardData);
      const cardElement = createCard(cardData, handleImageClick, handleDeleteCard, currentUserId);
      placesList.append(cardElement);
    });
  })
  .catch(err => {
    console.error('Ошибка загрузки данных:', err);
  });

