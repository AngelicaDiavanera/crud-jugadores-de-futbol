let players = [];
const playerApi = usePlayerApi();
const playerForm = document.getElementById('player-form');
const fields = document.querySelectorAll('#player-form .form-field');
const playerTbody = document.getElementById('player-table');
const contentButtons = document.getElementById('content-buttons');
const addButton = document.getElementById('add-player');
addButton.addEventListener('click', playerFormAction);

const loader = document.getElementById('loader');

const handleLoader = (status) => {
  switch (status) {
    case 'show':
      loader.style.display = 'flex';
      break;
    case 'hide':
      loader.style.display = 'none';
      break;
    default:
      break;
  }
};

let playerFormMode = 'create';
let playerId = undefined;

let currentPlayer = {
  name: '',
  age: '',
  team: '',
  shirtColor: '',
  birthDate: '',
};

function validate(event) {
  const { name, value } = event.target;
  currentPlayer[name] = value;
}

fields.forEach((field) => {
  field.addEventListener('input', validate);
});

function playerFormAction() {
  switch (playerFormMode) {
    case 'create':
      createPlayer();
      break;
    case 'update':
      updatePlayer();
      break;
    default:
      break;
  }
}

function changeActionPlayerButton() {
  switch (playerFormMode) {
    case 'create':
      addButton.innerText = 'Agregar';
      addButton.className = 'btn btn-primary';
      break;
    case 'update':
      addButton.innerText = 'Actualizar';
      addButton.className = 'btn btn-info text-white';
      break;
    default:
      break;
  }
}

function cancelPlayerActionButton() {
  switch (playerFormMode) {
    case 'create':
      document.getElementById('cancel-button').remove();
      break;
    case 'update':
      if (document.getElementById('cancel-button') !== null) {
        return;
      } else {
        const cancelButton = document.createElement('button');
        cancelButton.id = 'cancel-button';
        cancelButton.className = 'btn btn-secondary';
        cancelButton.innerText = 'Cancelar';
        cancelButton.type = 'button';
        cancelButton.addEventListener('click', () => {
          cancelButton.remove();
          playerFormMode = 'create';
          playerForm.reset();
          changeActionPlayerButton();
        });
        contentButtons.appendChild(cancelButton);
      }

      break;
    default:
      break;
  }
}

async function createPlayer() {
  handleLoader('show');
  const player = await playerApi.create(currentPlayer);
  players.push({ ...player });
  listPlayers();
  playerForm.reset();
  handleLoader('hide');
}

async function updatePlayer() {
  handleLoader('show');
  const player = await playerApi.update(playerId, currentPlayer);
  players = players.map((item) => {
    if (item.id === playerId) {
      return { ...player };
    }

    return item;
  });
  listPlayers();
  playerForm.reset();
  playerFormMode = 'create';
  changeActionPlayerButton();
  cancelPlayerActionButton();
  handleLoader('hide');
}

async function deletePlayer(id) {
  handleLoader('show');
  await playerApi.remove(id);
  players = players.filter((player) => {
    return player.id !== id;
  });
  listPlayers();
  handleLoader('hide');
}

function loadPlayerInForm(id) {
  playerFormMode = 'update';
  playerId = id;
  currentPlayer = players.find((player) => player.id === id);

  fields.forEach((field) => {
    field.value = currentplayer[field.name];
  });
  changeActionPlayerButton();
  cancelPlayerActionButton();
}

const modalHtmlElement = document.getElementById('view-player');
const boostrapModal = new bootstrap.Modal(modalHtmlElement);

async function showplayer(id) {
  handleLoader('show');
  const player = await playerApi.read(id);
  //Llamar el api para mostrar el player
  const modalTitle = document.querySelector('#view-player .modal-title');
  const modalBody = document.querySelector('#view-player .modal-body');
  boostrapModal.show();
  modalBody.innerHTML = `
      <ul>
        <li><b>Nombre:</b> ${player.name}</li>
        <li><b>Edad:</b> ${player.age}</li>
        <li><b>player:</b> ${player.team}</li>
        <li><b>Especie:</b> ${player.shirtColor}</li>
        <li><b>Fecha de nacimiento:</b> ${player.birthDate}</li>
        <li><b>Descripción:</b><p>${player.description}</p></li>
    </ul>
      `;
  modalTitle.innerText = player.name;
  handleLoader('hide');
}

async function listPlayers(firstLoad) {
  handleLoader('show');
  playerTbody.innerHTML = '';
  if (firstLoad) players = await playerApi.list();
  players.forEach((player) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <th scope="row">${player.id}</th>
            <td>${player.name}</td>
            <td>${player.age}</td>
            <td>${player.team}</td>
            <td>${player.shirtColor}</td>
            <td>${player.birthDate}</td>
            <td>
                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="loadplayerInForm(${player.id})">
                    Editar
                    </button>
                <button
                    type="button"
                    class="btn btn-info text-white"
                    onclick="showplayer(${player.id})">
                    Ver registro
                    </button>
                <button
                    type="button"
                    class="btn btn-danger"
                    onclick="deleteplayer(${player.id})">
                    Eliminar
                    </button>
            </td>
        `;
    playerTbody.appendChild(row);
  });
  handleLoader('hide');
}
listPlayers(true);
