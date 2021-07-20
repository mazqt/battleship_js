document.addEventListener("DOMContentLoaded", () => {
  const userGrid = document.querySelector(".grid-user");
  const computerGrid = document.querySelector(".grid-computer");
  const displayGrid = document.querySelector(".grid-display");
  const ships = document.querySelectorAll(".ship");
  const destroyer = document.querySelector(".destroyer-container");
  const submarine = document.querySelector(".submarine-container");
  const cruiser = document.querySelector(".cruiser-container");
  const battleship = document.querySelector(".battleship-container");
  const carrier = document.querySelector(".carrier-container");
  const startButton = document.querySelector("#start");
  const rotateButton = document.querySelector("#rotate");
  const turnDisplay = document.querySelector("#whose-go");
  const infoDisplay = document.querySelector("#info");
  const userSquares = [];
  const computerSquares = [];
  let isHorizontal = true;
  let isGameOver = false
  let currentPlayer = "user"

  const width = 10;

  //Create boards
  function createBoard(grid, squares) {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.dataset.id = i;
      grid.appendChild(square);
      squares.push(square);
    }
  }

  createBoard(userGrid, userSquares);
  createBoard(computerGrid, computerSquares);

  //Ships
  const shipArray = [
    {
      name: "destroyer",
      directions: [
        [0, 1],
        [0, width],
      ],
    },
    {
      name: "submarine",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    {
      name: "cruiser",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    {
      name: "battleship",
      directions: [
        [0, 1, 2, 3],
        [0, width, width * 2, width * 3],
      ],
    },
    {
      name: "carrier",
      directions: [
        [0, 1, 2, 3, 4],
        [0, width, width * 2, width * 3, width * 4],
      ],
    },
  ];

  //Draw pc ships in random places
  function generate(ship) {
    let randomDirection = Math.floor(Math.random() * ship.directions.length);
    let current = ship.directions[randomDirection];
    if (randomDirection === 0) {
      direction = 1;
    }
    if (randomDirection === 1) {
      direction = 10;
    }
    let randomStart = Math.abs(
      Math.floor(
        Math.random() * computerSquares.length -
          ship.directions[0].length * direction
      )
    );

    const isTaken = current.some((index) =>
      computerSquares[randomStart + index].classList.contains("taken")
    );
    const isAtRightEdge = current.some(
      (index) => (randomStart + index) % width === width - 1
    );
    const isAtLeftEdge = current.some(
      (index) => (randomStart + index) % width === 0
    );

    if (!isTaken && !isAtRightEdge && !isAtLeftEdge) {
      current.forEach((index) =>
        computerSquares[randomStart + index].classList.add("taken", ship.name)
      );
    } else {
      generate(ship);
    }
  }
  generate(shipArray[0]);
  generate(shipArray[1]);
  generate(shipArray[2]);
  generate(shipArray[3]);
  generate(shipArray[4]);

  //Rotate the ships
  function rotate() {
    if (isHorizontal) {
      destroyer.setAttribute("class", "ship destroyer-container-vertical");
      submarine.setAttribute("class", "ship submarine-container-vertical");
      cruiser.setAttribute("class", "ship cruiser-container-vertical");
      battleship.setAttribute("class", "ship battleship-container-vertical");
      carrier.setAttribute("class", "ship carrier-container-vertical");
      isHorizontal = false;
    } else {
      destroyer.setAttribute("class", "ship destroyer-container");
      submarine.setAttribute("class", "ship submarine-container");
      cruiser.setAttribute("class", "ship cruiser-container");
      battleship.setAttribute("class", "ship battleship-container");
      carrier.setAttribute("class", "ship carrier-container");
      isHorizontal = true;
    }
  }

  rotateButton.addEventListener("click", rotate);

  //move ships
  ships.forEach((ship) => ship.addEventListener("dragstart", dragStart));
  userSquares.forEach((square) =>
    square.addEventListener("dragstart", dragStart)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragover", dragOver)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragenter", dragEnter)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragleave", dragLeave)
  );
  userSquares.forEach((square) => square.addEventListener("drop", dragDrop));
  userSquares.forEach((square) => square.addEventListener("dragend", dragEnd));

  let selectedShipNameWithIndex;
  let draggedShip;
  let draggedShipLength;

  ships.forEach((ship) =>
    ship.addEventListener("mousedown", (e) => {
      selectedShipNameWithIndex = e.target.id;
    })
  );

  function dragStart() {
    draggedShip = this;
    draggedShipLength = this.childNodes.length;
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragLeave(e) {
    e.preventDefault();
  }

  function dragDrop() {
    let shipNameWithLastID = draggedShip.lastChild.id;
    let shipClass = shipNameWithLastID.slice(0, -2);
    let lastShipIndex = parseInt(shipNameWithLastID.substr(-1))
    let shipLastID = lastShipIndex + parseInt(this.dataset.id)
    const notAllowedHorizontal = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 12, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83, 93]
    let notAllowedVertical = []
    for (let i = 99; i >= 60; i--) {notAllowedVertical.push(i)}

    let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
    let newNotAllowedVertical = notAllowedVertical

    selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))

    shipLastID = shipLastID - selectedShipIndex

    if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastID)) {
      for (let i = 0; i < draggedShipLength; i++) {
        userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add("taken", shipClass)
      }
    } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastID)){
      for (let i = 0; i < draggedShipLength; i++) {
        userSquares[parseInt(this.dataset.id) - selectedShipIndex + i*width].classList.add("taken", shipClass)
      }
    } else {return}

    displayGrid.removeChild(draggedShip)
  }

  function dragEnd() {}

  //game logic

  function playGame() {
    if (isGameOver) {return}
    if (currentPlayer === "user") {
      turnDisplay.innerHTML = "Your go"
      computerSquares.forEach(square => square.addEventListener("click", function(e) {
        revealSquare(square)
      }))
    } else {
      turnDisplay.innerHTML = "Computer's go"
      setTimeout(computerGo, 1000)
    }
    checkForWins()
  }

  startButton.addEventListener("click", playGame)

  let destroyerCount = 0
  let submarineCount = 0
  let cruiserCount = 0
  let battleshipCount = 0
  let carrierCount = 0


  function revealSquare(square) {

    if (square.classList.contains("boom")) {
      if (square.classList.contains("destroyer")) {destroyerCount++}
      if (square.classList.contains("submarine")) {submarineCount++}
      if (square.classList.contains("cruiser")) {cruiserCount++}
      if (square.classList.contains("battleship")) {battleshipCount++}
      if (square.classList.contains("carrier")) {carrierCount++}
    }

    if (square.classList.contains("taken")) {
      square.classList.add("boom")
      console.log(click)
    } else {
      square.classList.add("miss")
    }
    currentPlayer = "computer"
    playGame()
  }

  let cpuDestroyerCount = 0
  let cpuSubmarineCount = 0
  let cpuCruiserCount = 0
  let cpuBattleshipCount = 0
  let cpuCarrierCount = 0

  function computerGo() {
    let random = Math.floor(Math.random() * userSquares.length)
    if (!userSquares[random].classList.contains("boom")) {
      userSquares[random].classList.add("boom")
      if (userSquares[random].classList.contains("destroyer")) {cpuDestroyerCount++}
      if (userSquares[random].classList.contains("submarine")) {cpuSubmarineCount++}
      if (userSquares[random].classList.contains("cruiser")) {cpuCruiserCount++}
      if (userSquares[random].classList.contains("battleship")) {cpuBattleshipCount++}
      if (userSquares[random].classList.contains("carrier")) {cpuCarrierCount++}
    }
    currentPlayer = "user"
    turnDisplay.innerHTML = "Your go"
  }

  function checkForWins() {
    if (destroyerCount === 2) {
      infoDisplay.innerHTML = "You sunk their destroyer!"
      destroyerCount = 10
    }
    if (submarineCount === 3) {
      infoDisplay.innerHTML = "You sunk their submarine!"
      submarineCount = 10
    }
    if (cruiserCount === 3) {
      infoDisplay.innerHTML = "You sunk their cruiser!"
      cruiserCount = 10
    }
    if (battleshipCount === 4) {
      infoDisplay.innerHTML = "You sunk their battleship!"
      battleshipCount = 10
    }
    if (carrierCount === 5) {
      infoDisplay.innerHTML = "You sunk their carrier!"
      carrierCount = 10
    }
    if (cpuDestroyerCount === 2) {
      infoDisplay.innerHTML = "They sunk tyour destroyer!"
      cpuDestroyerCount = 10
    }
    if (cpuDubmarineCount === 3) {
      infoDisplay.innerHTML = "They sunk your submarine!"
      cpuSubmarineCount = 10
    }
    if (cpuCruiserCount === 3) {
      infoDisplay.innerHTML = "They sunk your cruiser!"
      cpuCruiserCount = 10
    }
    if (cpuBattleshipCount === 4) {
      infoDisplay.innerHTML = "They sunk your battleship!"
      cpuBattleshipCount = 10
    }
    if (cpuCarrierCount === 5) {
      infoDisplay.innerHTML = "They sunk your carrier!"
      cpuCarrierCount = 10
    }
    if (destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount === 50) {
      infoDisplay.innerHTML = "You won"
      gameOver()
    }
    if (cpuDestroyerCount + cpuSubmarineCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount === 50) {
      infoDisplay.innerHTML = "CPU won"
      gameOver()
    }
  }

  function gameOver() {
    isGameOver = true
    startButton.removeEventListener("click", playGame)
    infoDisplay.innerHTML = "You won!"
    setTimeout(location.reload(), 3000)
  }

});
