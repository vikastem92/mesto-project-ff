import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, toggleLike, deleteCard } from './card.js';
import { openPopup, closePopup, setModalWindowEventListeners } from './modal.js';

// DOM: узлы и переменные
const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
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

// функции

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closePopup(popupEdit);
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const name = cardNameInput.value;
  const link = cardLinkInput.value;
  const newCard = createCard({ name, link }, toggleLike, handleImageClick, deleteCard);
  placesList.prepend(newCard);
  closePopup(popupNewCard);
  formNewCard.reset();
}

function handleImageClick(data) {
  popupImageElement.src = data.link;
  popupImageElement.alt = data.name;
  popupCaption.textContent = data.name;
  openPopup(popupImage);
}

// Инициализация обработчиков попапов
document.querySelectorAll('.popup').forEach(setModalWindowEventListeners);

// Обработчики событий

buttonOpenEdit.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(popupEdit);
});

buttonOpenNewCard.addEventListener('click', () => {
  openPopup(popupNewCard);
});

formEditProfile.addEventListener('submit', handleEditProfileSubmit);
formNewCard.addEventListener('submit', handleNewCardSubmit);

// Отображение начальных карточек
initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, toggleLike, handleImageClick, deleteCard);
  placesList.append(cardElement);
});
