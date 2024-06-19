const wordSearchContainer = document.getElementById('word-search-container');
const wordListContainer = document.getElementById('word-list');
const restartButton = document.getElementById('restart-btn');

const words = ['BELGRANO', 'BANDERA', 'ARGENTINA', 'LIBERTAD', 'HEROE', 'PAIS', 'PATRIA', 'CELESTE', 'BLANCO', 'SOL'];
let grid = [];
const gridSize = 10;
const directions = [
    { x: 0, y: 1 },  // vertical hacia abajo
    { x: 1, y: 0 },  // horizontal hacia derecha
    { x: 1, y: 1 },  // diagonal abajo-derecha
    { x: 1, y: -1 }  // diagonal arriba-derecha
];
let selectedCells = [];
let foundWords = [];

function createGrid() {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
    words.forEach(word => placeWord(word));
    fillEmptyCells();
}

function placeWord(word) {
    let placed = false;
    while (!placed) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);
        if (canPlaceWord(word, x, y, direction)) {
            for (let i = 0; i < word.length; i++) {
                grid[y + i * direction.y][x + i * direction.x] = word[i];
            }
            placed = true;
        }
    }
}

function canPlaceWord(word, x, y, direction) {
    for (let i = 0; i < word.length; i++) {
        const newX = x + i * direction.x;
        const newY = y + i * direction.y;
        if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize || (grid[newY][newX] !== '' && grid[newY][newX] !== word[i])) {
            return false;
        }
    }
    return true;
}

function fillEmptyCells() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (grid[y][x] === '') {
                grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }
}

function displayGrid() {
    wordSearchContainer.innerHTML = '';
    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.textContent = cell;
            cellElement.dataset.x = x;
            cellElement.dataset.y = y;
            cellElement.addEventListener('click', () => selectCell(cellElement, x, y));
            wordSearchContainer.appendChild(cellElement);
        });
    });
}

function displayWords() {
    wordListContainer.innerHTML = '';
    words.forEach(word => {
        const wordElement = document.createElement('li');
        wordElement.textContent = word;
        wordElement.id = word;
        wordListContainer.appendChild(wordElement);
    });
}

function selectCell(cellElement, x, y) {
    cellElement.classList.toggle('selected');
    const cellIndex = selectedCells.findIndex(cell => cell.x === x && cell.y === y);
    if (cellIndex >= 0) {
        selectedCells.splice(cellIndex, 1);
    } else {
        selectedCells.push({ x, y, letter: cellElement.textContent });
    }
    checkSelectedWord();
}

function checkSelectedWord() {
    const selectedWord = selectedCells.map(cell => cell.letter).join('');
    const reversedSelectedWord = selectedCells.map(cell => cell.letter).reverse().join('');
    if (words.includes(selectedWord) || words.includes(reversedSelectedWord)) {
        selectedCells.forEach(cell => {
            const cellElement = wordSearchContainer.querySelector(`[data-x="${cell.x}"][data-y="${cell.y}"]`);
            cellElement.classList.remove('selected');
            cellElement.classList.add('correct');
        });
        markWordAsFound(selectedWord);
        foundWords.push(selectedWord);
        selectedCells = [];
        if (foundWords.length === words.length) {
            setTimeout(() => alert('¡Felicidades, encontraste todas las palabras!'), 100);
        }
    }
}

function markWordAsFound(word) {
    const wordElement = document.getElementById(word);
    if (wordElement) {
        wordElement.classList.add('found');
    }
}

restartButton.addEventListener('click', () => {
    selectedCells = [];
    foundWords = [];
    createGrid();
    displayGrid();
    displayWords();
});

createGrid();
displayGrid();
displayWords();
