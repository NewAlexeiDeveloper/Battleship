const startButton = document.getElementById('start')
const rotateButton = document.getElementById('rotate')
const moveInfo = document.getElementById('move')
const userBoard = document.querySelector('.user-board')
const computerBoard = document.querySelector('.computer-board')
const takeShipBoard = document.querySelector('.take-ship-board')
const ships = [
    {
        name: 'ship1',
        position: [[0, 1, 2], [0, 10, 20]]
    },
    {
        name: 'ship2',
        position: [[0, 1, 2, 3], [0, 10, 20, 30]]
    },
    {
        name: 'ship3',
        position: [[0, 1, 2, 3], [0, 10, 20, 30]]
    },
    {
        name: 'ship4',
        position: [[0, 1, 2, 3, 4], [0, 10, 20, 30, 40]]
    },
    {
        name: 'ship5',
        position: [[0, 1, 2, 3, 4, 5], [0, 10, 20, 30, 40, 50]]
    }
]
const forbiddenHorizontally = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 12, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83, 93, 4, 14, 24, 34, 44, 54, 64, 74, 84, 94, 5, 15, 25, 35, 45, 55, 65, 75, 85, 95]
const forbiddenVertically = [90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]


let userSquares = [],
    computerSquares = [],
    userMove = true,
    isGameOver = false,
    isGameWin = false,
    ship1IsTakenComputer = 0
ship2IsTakenComputer = 0
ship3IsTakenComputer = 0
ship4IsTakenComputer = 0
ship5IsTakenComputer = 0

let ship1IsTakenUser = 0
let ship2IsTakenUser = 0
let ship3IsTakenUser = 0
let ship4IsTakenUser = 0
let ship5IsTakenUser = 0


// All that is required after the page is loaded 
document.addEventListener('DOMContentLoaded', () => {
    // Create func in order to fill the boards with
    const fillBoard = (board, squareCollection) => {
        for (let i = 0; i < 100; i++) {
            const square = document.createElement('div')
            square.classList.add('square')
            square.dataset.id = i
            board.appendChild(square)
            squareCollection.push(square)
        }
    }
    fillBoard(userBoard, userSquares)
    fillBoard(computerBoard, computerSquares)

})

// Necessary functions for game

// Generate ships randomly for the computer
const generateShipsRandomlyForComputer = ship => {
    let randomStartSquare
    let randomDirection = Math.floor(Math.random() * 2)
    let multiplier = randomDirection == 0 ? 1 : 10
    function randomGenerator() {
        let random = Math.abs(Math.floor(Math.random() * 100 - (ship.position[0].length - 1) * multiplier))
        if (random < 0) {
            randomGenerator()
        } else {
            randomStartSquare = random
        }
    }
    randomGenerator()
    // Check if squares are taken or no and if is allowed horizontally
    let squareIsTaken = false
    let notAllowedHorizontal = false
    let indexToSpliceHorizontal = ship.position[0].length - 1
    let forbiddenIndexesForHorizontal = [...forbiddenHorizontally].splice(0, indexToSpliceHorizontal * 10)
    for (let i = 0; i < ship.position[0].length; i++) {
        if (computerSquares[randomStartSquare + (i * multiplier)].classList.contains('taken')) squareIsTaken = true
        // Check the last item if it's allowed to be placed
        if (i == ship.position[0].length - 1 && forbiddenIndexesForHorizontal.includes(randomStartSquare + (i * multiplier))) {
            notAllowedHorizontal = true
        }
    }
    // if squares are not taken create a ship and if no iterate again
    if (!squareIsTaken && !notAllowedHorizontal) {
        for (let i = 0; i < ship.position[0].length; i++) {
            computerSquares[randomStartSquare + (i * multiplier)].classList.add(ship.name, 'taken', 'invisible')
        }
    } else {
        generateShipsRandomlyForComputer(ship)
    }
}
setTimeout(() => {
    ships.forEach(ship => generateShipsRandomlyForComputer(ship))
}, 100)

// Create ships for user
const createShipsForUser = () => {
    ships.forEach(ship => {
        let newShip = document.createElement('div')
        newShip.style.display = 'flex'
        // create squares for ship
        for (let i = 0; i < ship.position[0].length; i++) {
            let div = document.createElement('div')
            div.classList.add('squareWithoutBorder')
            div.setAttribute('id', `${ship.name}SquareID${i}`)
            newShip.appendChild(div)
        }
        let lengthOfSquaresForShip = ship.position[0].length
        newShip.classList.add(ship.name, 'ship')
        newShip.style.width = (4.5 * lengthOfSquaresForShip) + 'vmin'
        newShip.style.marginBottom = '15px'
        newShip.draggable = true
        takeShipBoard.appendChild(newShip)
    })
}
createShipsForUser()


// Rotate ships         
function rotateShips() {
    let allShipsOnTheBoard = takeShipBoard.childNodes
    // if the game is over then create ships that adequate to the rotateBtn class
    if (isGameOver) {
        if (takeShipBoard.classList.contains('vertical')) {
            takeShipBoard.classList.add('vertical')
            allShipsOnTheBoard.forEach(ship => {
                ship.classList.add('vertical')
                ship.style.marginRight = '25px'
                ship.style.flexWrap = 'wrap'
            })
        } else {
            takeShipBoard.className = 'take-ship-board'
            // remove vertical class
            allShipsOnTheBoard.forEach(ship => {
                let shipClassAttribute = ship.className
                let split = shipClassAttribute.split(' ')
                let shipName = split[0]
                let findShipInGeneralArray = ships.find(ship => ship.name == shipName)
                let indexForShipWidth = findShipInGeneralArray.position[0].length
                ship.classList.remove('vertical')
                ship.style.width = (indexForShipWidth * 4.5) + 'vmin'
                ship.style.height = '4.5vmin'
                ship.style.marginBottom = '15px'
                ship.style.flexWrap = 'nowrap'
            })
        }
        // Normal game restart
    } else {
        if (takeShipBoard.classList.contains('vertical')) {
            takeShipBoard.className = 'take-ship-board'
            // remove vertical class
            allShipsOnTheBoard.forEach(ship => {
                let shipClassAttribute = ship.className
                let split = shipClassAttribute.split(' ')
                let shipName = split[0]
                let findShipInGeneralArray = ships.find(ship => ship.name == shipName)
                let indexForShipWidth = findShipInGeneralArray.position[0].length
                ship.classList.remove('vertical')
                ship.style.width = (indexForShipWidth * 4.5) + 'vmin'
                ship.style.marginBottom = '15px'
                ship.style.flexWrap = 'nowrap'
            })
        } else {
            takeShipBoard.classList.add('vertical')
            allShipsOnTheBoard.forEach(ship => {
                ship.classList.add('vertical')
                ship.style.marginRight = '4vmin'
                ship.style.flexWrap = 'wrap'
            })
        }
    }
}
rotateButton.addEventListener('click', () => {
    rotateShips()
})

// Allow to drag ships
let allShipsOnTheBoard = takeShipBoard.childNodes,
    draggedShip,
    indexOfClickedSquare,
    isVertical,
    lengthOfDraggedShip
allShipsOnTheBoard.forEach(ship => ship.addEventListener('dragstart', dragstart))
allShipsOnTheBoard.forEach(ship => ship.addEventListener('mousedown', e => {
    let ClickedSquare = e.target
    let IDOfClickedSquare = ClickedSquare.getAttribute('id')
    indexOfClickedSquare = IDOfClickedSquare.substr(-1)
}))
setTimeout(() => {
    userSquares.forEach(square => square.addEventListener('dragover', dragover))
    userSquares.forEach(square => square.addEventListener('drop', drop))
}, 500)

function dragstart() {
    draggedShip = this
    lengthOfDraggedShip = draggedShip.childNodes.length
}

function dragover(e) {
    e.preventDefault()
}

function drop() {
    // Check if ship is vertical or horizontal
    let classOfShip = draggedShip.getAttribute('class')
    let splittedClassName = classOfShip.split(' ')
    let requiredClassName = splittedClassName[0]
    isVertical = classOfShip.includes('vertical') ? true : false

    let clickedSquare = +this.dataset.id
    // Check if the ship can be placed on the board
    if (!isVertical) {
        let targetSquare = clickedSquare - indexOfClickedSquare
        let theLastSquareToDrawShip = targetSquare + (lengthOfDraggedShip - 1)
        let not_allowed_horizontally = forbiddenHorizontally.slice(0, (lengthOfDraggedShip - 1) * 10).includes(theLastSquareToDrawShip) ? true : false
        let square_is_busy = false
        for (let i = targetSquare; i < (targetSquare + lengthOfDraggedShip); i++) {
            if (userSquares[i].classList.contains('taken')) square_is_busy = true
        }
        // Draw a ship
        if (!not_allowed_horizontally && !square_is_busy) {
            for (let i = targetSquare; i < (targetSquare + lengthOfDraggedShip); i++) {
                userSquares[i].classList.add(requiredClassName, 'taken', 'animation', 'animation-horizontal')
                // Make border-radius for the utmost squsare
                if (i == targetSquare) {
                    userSquares[i].classList.add('border-top-left-radius', 'border-bottom-left-radius')
                }
                if (i == (targetSquare + lengthOfDraggedShip) - 1) {
                    userSquares[i].classList.add('border-top-right-radius', 'border-bottom-right-radius')
                }
            }
            // Remove the ship from the board
            takeShipBoard.removeChild(draggedShip)
            // If there are no ships then make button not active
            if (allShipsOnTheBoard.length == 0) {
                rotateButton.disabled = true
                rotateButton.style.background = 'grey'
                rotateButton.style.border = 'none'
                rotateButton.classList.remove('active')
            }
        }
    } else {
        let targetSquare = clickedSquare - (indexOfClickedSquare * 10)
        let not_allowed_vertically = forbiddenVertically.slice(0, (lengthOfDraggedShip - 1) * 10).includes(targetSquare) ? true : false
        if (not_allowed_vertically) return
        let square_is_busy = false
        for (let i = 0; i < lengthOfDraggedShip; i++) {
            if (userSquares[targetSquare + i * 10].classList.contains('taken')) square_is_busy = true
        }
        // Draw a ship
        let splittedClass = classOfShip.split(' ')
        let targetClass = splittedClass[0]
        if (!not_allowed_vertically && !square_is_busy) {
            for (let i = 0; i < lengthOfDraggedShip; i++) {
                userSquares[targetSquare + i * 10].classList.add(targetClass, 'taken', 'animation', 'animation-vertical')
                // Make border-radius for the utmost squsare
                if (i == 0) {
                    userSquares[targetSquare + i * 10].classList.add('border-top-left-radius', 'border-top-right-radius')
                }
                if (i == lengthOfDraggedShip - 1) {
                    userSquares[targetSquare + i * 10].classList.add('border-bottom-left-radius', 'border-bottom-right-radius')
                }
            }
            // Remove the ship from the board
            takeShipBoard.removeChild(draggedShip)
            // If there are no ships then make button not active
            if (allShipsOnTheBoard.length == 0) {
                rotateButton.disabled = true
                rotateButton.style.background = 'grey'
                rotateButton.style.border = 'none'
                rotateButton.classList.remove('active')
            }
        }
    }
}

// Start a game
startButton.addEventListener('click', () => {
    // Initialize the start function
    function startGame() {
        // Secure methods to stop game 
        if (isGameWin || isGameOver) return
        if (userMove) {
            moveInfo.textContent = 'Your move'
            computerSquares.forEach(square => square.addEventListener('click', () => userGame(square)))
            function userGame(square) {
                if (!userMove || isGameWin || isGameOver) return
                // check if user missed or not
                if (square.classList.contains('taken')) {
                    square.classList.add('shot')
                    square.classList.remove('taken')
                    let splittedClassName = square.getAttribute('class').split(' ')
                    let shipName = splittedClassName[1]
                    // increment numbers of taken squares
                    if (shipName == 'ship1') ship1IsTakenUser++
                    if (shipName == 'ship2') ship2IsTakenUser++
                    if (shipName == 'ship3') ship3IsTakenUser++
                    if (shipName == 'ship4') ship4IsTakenUser++
                    if (shipName == 'ship5') ship5IsTakenUser++
                    // check for win conditions 
                    if (ship1IsTakenUser == 3 && ship2IsTakenUser == 4 && ship3IsTakenUser == 4 && ship4IsTakenUser == 5 && ship5IsTakenUser == 6) {
                        isGameWin = true
                        moveInfo.textContent = 'You won!'
                        startButton.classList.add('restart')
                        startButton.textContent = 'Restart'
                    } else {
                        userMove = false
                        startGame()
                        moveInfo.textContent = 'Computer move'
                        moveInfo.style.color = 'red'
                    }
                } else if (square.classList.contains('shot') || square.classList.contains('miss')) {
                    moveInfo.textContent = 'This square was already fired, choose another one'
                    moveInfo.style.color = 'red'
                } else {
                    square.classList.add('miss')
                    userMove = false
                    moveInfo.textContent = 'Computer move'
                    moveInfo.style.color = 'red'
                    startGame()
                }
            }
        } else {
            setTimeout(() => {
                let lengthOfFreeSquares = 0
                let freeSquares = []
                userSquares.forEach(square => {
                    if (!square.classList.contains('shot') && !square.classList.contains('miss')) {
                        lengthOfFreeSquares++
                        freeSquares.push(square)
                    }
                })
                // Create a random number to fire
                let random = Math.floor(Math.random() * lengthOfFreeSquares)
                if (freeSquares[random].classList.contains('taken')) {
                    let ClassNameOfSquare = freeSquares[random].getAttribute('class')
                    let splittedClassName = ClassNameOfSquare.split(' ')
                    let className = splittedClassName[1]
                    // increment numbers of taken squares
                    if (className == 'ship1') ship1IsTakenComputer++
                    if (className == 'ship2') ship2IsTakenComputer++
                    if (className == 'ship3') ship3IsTakenComputer++
                    if (className == 'ship4') ship4IsTakenComputer++
                    if (className == 'ship5') ship5IsTakenComputer++
                    // Change the square
                    freeSquares[random].classList.add('shot')
                    freeSquares[random].classList.add('removeAnimation')
                    // check for win conditions
                    if (ship1IsTakenComputer == 3 && ship2IsTakenComputer == 4 && ship3IsTakenComputer == 4 && ship4IsTakenComputer == 5 && ship5IsTakenComputer == 6) {
                        isGameOver = true
                        moveInfo.textContent = 'Computer won!'
                        startButton.classList.add('restart')
                        startButton.textContent = 'Restart'
                    } else {
                        userMove = true
                        moveInfo.textContent = 'Your move'
                        moveInfo.style.color = 'green'
                        startGame()
                    }
                } else {
                    freeSquares[random].classList.add('miss')
                    moveInfo.textContent = 'Your move'
                    moveInfo.style.color = 'green'
                    userMove = true
                    startGame()
                }
            }, 500)
        }
    }
    // Check if the game should be started or restarted
    let classOfTheButton = startButton.getAttribute('class')
    // If there are no "restart" then start the game
    if (!classOfTheButton.includes('restart')) {
        if (isGameWin || isGameOver) return
        let lengthOfLeftShips = allShipsOnTheBoard.length
        if (lengthOfLeftShips !== 0) {
            moveInfo.textContent = 'Before starting a game you must put all ships on the board'
            moveInfo.style.color = 'red'
            moveInfo.style.backgroundColor = 'rgb(194, 228, 238)'
        } else {
            moveInfo.textContent = 'Your move'
            moveInfo.style.color = 'green'
            moveInfo.style.backgroundColor = 'rgb(194, 228, 238)'
            startGame()
            takeShipBoard.style.opacity = 0
        }
    } else {
        // The game should be restarted
        // Clear boards
        userSquares.forEach(square => square.className = 'square')
        computerSquares.forEach(square => square.className = 'square')
        // Display takeShipBoard
        takeShipBoard.style.opacity = 1
        // Create ships for a user and computer
        createShipsForUser()
        // Check the value of rotate button and create the same ships
        rotateShips()
        ships.forEach(ship => generateShipsRandomlyForComputer(ship))
        let allShipsOnTheBoard = takeShipBoard.childNodes
        allShipsOnTheBoard.forEach(ship => ship.addEventListener('dragstart', dragstart))
        allShipsOnTheBoard.forEach(ship => ship.addEventListener('mousedown', e => {
            let IDofClickedSquare = e.target
            let classOfClickedSquare = IDofClickedSquare.getAttribute('id')
            indexOfClickedSquare = classOfClickedSquare.substr(-1)
        }))
        userSquares.forEach(square => square.addEventListener('dragover', dragover))
        userSquares.forEach(square => square.addEventListener('drop', drop))
        // Allow user to move and start a new game
        userMove = true
        isGameOver = false
        isGameWin = false
        startButton.classList.remove('restart')
        startGame()
        // Change the button's text and output
        moveInfo.textContent = ''
        startButton.textContent = 'Start'
        // Change the rotate button style
        rotateButton.disabled = false
        rotateButton.style.background = 'rgb(239, 239, 239)'
        rotateButton.style.border = ''
        rotateButton.classList.add('active')
        // Remove background from info table
        moveInfo.style.backgroundColor = ''
    }
})