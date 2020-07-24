import * as firebase from 'firebase/app';
import 'firebase/firestore';

export const crudDataUser: CrudDataUser = async (user, operation, data) => {
  const userRef = firebase.database().ref(`users/${user}`);

  let userData: StatesUser;

  switch (operation) {
    case 'create':
      await userRef.set(data).catch(err => console.error(err));
      break;

    case 'read':
      userData = await userRef
        .once('value')
        .then(snapshot => snapshot.val())
        .catch(err => console.error(err));

      return userData;

    case 'update':
      await userRef.update(data).catch(err => console.error(err));
      break;

    case 'delete':
      await userRef.remove().catch(err => console.error(err));
      break;
  }
};

export const crudDataUserGame: CrudDataUserGame = async (
  user,
  game,
  operation,
  data
) => {
  let gameRef: firebase.database.Reference;

  let gameData: GameData | GamesData;

  if (game === 'all') {
    gameRef = firebase.database().ref(`users/${user}/games`);
  } else {
    gameRef = firebase.database().ref(`users/${user}/games/${game}`);
  }

  switch (operation) {
    case 'create':
      break;

    case 'read':
      gameData = await gameRef
        .once('value')
        .then(snapshot => snapshot.val())
        .catch(err => console.error(err));

      return gameData;

    case 'update':
      await gameRef.update(data).catch(err => console.error(err));
      break;

    case 'delete':
      break;
  }
};

export const crudDataGame: CrudDataGame = async (game, operation, data) => {
  let gameRef: firebase.database.Reference;

  let gameData: GameDataSets;

  if (operation === 'delete') {
    gameRef = firebase.database().ref(`games/${game}`);
  } else {
    gameRef = firebase.database().ref(`games/${game}/game`);
  }

  switch (operation) {
    case 'create':
      await gameRef.set(data).catch(err => console.error(err));
      break;

    case 'read':
      gameData = await gameRef
        .once('value')
        .then(snapshot => snapshot.val())
        .catch(err => console.error(err));

      return gameData;

    case 'update':
      await gameRef.update(data).catch(err => console.error(err));
      break;

    case 'delete':
      await gameRef.remove().catch(err => console.error(err));
      break;
  }
};

export const crudDataGamePlayer: CrudDataGamePlayer = async (
  game,
  player,
  operation,
  data
) => {
  const playerRef = firebase.database().ref(`games/${game}/players/${player}`);

  let playerData: PlayerData;

  switch (operation) {
    case 'create':
      await playerRef.set(data).catch(err => console.error(err));
      break;

    case 'read':
      playerData = await playerRef
        .once('value')
        .then(snapshot => snapshot.val())
        .catch(err => console.error(err));

      return playerData;

    case 'update':
      await playerRef.update(data).catch(err => console.error(err));
      break;

    case 'delete':
      await playerRef.remove().catch(err => console.error(err));
      break;
  }
};

export const initUserDB: InitUserDB = async (user, handleData) => {
  const { uid } = user;

  const userRef = firebase.database().ref(`users/${uid}`);

  const userExists = await userRef
    .once('value')
    .then(data => data.exists())
    .catch(err => console.error(err));

  if (!userExists) {
    const userData = initUserDefaults(user);

    crudDataUser(uid, 'create', userData);
  }

  userRef.on('value', data => {
    handleData(data.val());
  });
};

export const initGameDB: InitGameDB = async (game, user, handleData) => {
  const player = user.uid;

  const gameRef = firebase.database().ref(`games/${game}`);
  const playerRef = firebase.database().ref(`games/${game}/players/${player}`);

  const gameExist = await gameRef
    .once('value')
    .then(data => data.exists())
    .catch(err => console.error(err));

  const playerExist = await playerRef
    .once('value')
    .then(data => data.exists())
    .catch(err => console.error(err));

  switch (game) {
    case 'floatingPoint':
      if (!gameExist) {
        const gameData = initGameDefaults(player);

        crudDataGame('floatingPoint', 'create', gameData);
      }

      if (!playerExist) {
        const playerData = initPlayerDefaults(user);

        crudDataGamePlayer('floatingPoint', player, 'create', playerData);
      }

      gameRef.child('game').on('value', data => {
        handleData('game', data.val());
      });

      gameRef.child('players').on('value', data => {
        handleData('players', data.val());
      });

      gameRef.child('fp').on('value', data => {
        handleData('fp', data.val());
      });

      break;
  }
};

export const removeListenerUser: RemoveListenerUser = user => {
  const userRef = firebase.database().ref(`users/${user}`);

  userRef.off('value');
};

export const removeListenersGame: RemoveListenersGame = game => {
  const gameRef = firebase.database().ref(`games/${game}`);

  switch (game) {
    case 'floatingPoint':
      gameRef.child('game').off('value');
      gameRef.child('players').off('value');
      gameRef.child('fp').off('value');

      break;
  }
};

export const updateDataFP: UpdateDataFP = async update => {
  const pointRef = firebase.database().ref('games/floatingPoint/fp');

  await pointRef.update(update).catch(err => console.error(err));
};
