// Variables
const items = [
    { name: "Bray", wins: 0, games: 0 },
    { name: "Audrey", wins: 0, games: 0 },
    { name: "Veronica", wins: 0, games: 0 },
    { name: "Abi", wins: 0, games: 0 },
    { name: "Sabrina", wins: 0, games: 0 },
    { name: "Alyssa", wins: 0, games: 0 },
    { name: "Isabel", wins: 0, games: 0 },
    { name: "Kenna", wins: 0, games: 0 },
    { name: "Ephraim", wins: 0, games: 0 },
    { name: "Rhys", wins: 0, games: 0 },
    { name: "Rou", wins: 0, games: 0 },
    { name: "Hackbacon", wins: 0, games: 0 },
    { name: "Alyx", wins: 0, games: 0 },
    { name: "Xinyi", wins: 0, games: 0 },
    { name: "Rena", wins: 0, games: 0 }
];

let matchups = [];
let currentMatchupIndex = 0;
let previousMatchupIndex = null;
let previousWinner = null;
let previousLoser = null;

// DOM Elements
const userSelectionContainer = document.getElementById('userSelectionContainer');
const userSelection = document.getElementById('userSelection');
const startVotingButton = document.getElementById('startVoting');
const matchupContainer = document.getElementById('matchupContainer');
const voteForItem1Button = document.getElementById('voteForItem1');
const voteForItem2Button = document.getElementById('voteForItem2');
const statusMessage = document.getElementById('statusMessage');
const copyResultsButton = document.getElementById('copyResults');
const backButton = document.getElementById('backButton');

// Functions

/**
 * Shuffle an array using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 */
function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

/**
 * Populate the user selection dropdown.
 */
function populateUserSelection() {
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = item.name;
        userSelection.appendChild(option);
    });
}

/**
 * Generate initial matchups using a round-robin style to start.
 * @param {Array} items - The array of items.
 * @returns {Array} - The array of initial matchups.
 */
function generateInitialMatchups(items) {
    for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
            matchups.push({ item1: items[i].name, item2: items[j].name });
        }
    }
    return matchups;
}

/**
 * Filter out matchups that include the selected user.
 * @param {Array} matchups - The array of matchups.
 * @param {string} selectedUser - The selected user name.
 * @returns {Array} - The filtered array of matchups.
 */
function filterMatchups(matchups, selectedUser) {
    return matchups.filter(matchup => matchup.item1 !== selectedUser && matchup.item2 !== selectedUser);
}

/**
 * Display the current matchup.
 * @param {Object} matchup - The current matchup.
 */
function displayMatchup(matchup) {
    voteForItem1Button.textContent = matchup.item1;
    voteForItem2Button.textContent = matchup.item2;
    statusMessage.textContent = `Matchups completed: ${currentMatchupIndex}/${matchups.length}`;
}

/**
 * Handle the end of voting, hide buttons and display the final status.
 */
function endVoting() {
    statusMessage.textContent = "All matchups are complete!";
    voteForItem1Button.style.display = 'none';
    voteForItem2Button.style.display = 'none';
    backButton.style.display = 'none';
    copyResultsButton.classList.remove('hidden');
    console.log(items);
}

/**
 * Handle a vote and move to the next matchup or end voting if complete.
 * @param {string} winnerName - The name of the winning item.
 * @param {string} loserName - The name of the losing item.
 */
function handleVote(winnerName, loserName) {
    previousMatchupIndex = currentMatchupIndex;
    previousWinner = winnerName;
    previousLoser = loserName;

    const winner = items.find(item => item.name === winnerName);
    const loser = items.find(item => item.name === loserName);

    winner.wins++;
    winner.games++;
    loser.games++;

    currentMatchupIndex++;
    if (currentMatchupIndex < matchups.length) {
        displayMatchup(matchups[currentMatchupIndex]);
    } else {
        endVoting();
    }
}

/**
 * Handle going back to the previous matchup.
 */
function goBack() {
    if (previousMatchupIndex !== null) {
        const winner = items.find(item => item.name === previousWinner);
        const loser = items.find(item => item.name === previousLoser);

        winner.wins--;
        winner.games--;
        loser.games--;

        currentMatchupIndex = previousMatchupIndex;
        previousMatchupIndex = null;
        displayMatchup(matchups[currentMatchupIndex]);
    }
}

/**
 * Encode the results into a Base64 string.
 * @returns {string} - The encoded results.
 */
function encodeResults() {
    const results = items.map(item => ({ name: item.name, wins: item.wins }));
    const jsonString = JSON.stringify(results);
    return btoa(jsonString); // Base64 encode
}

/**
 * Copy the encoded results to the clipboard.
 */
function copyResultsToClipboard() {
    const encodedResults = encodeResults();
    navigator.clipboard.writeText(encodedResults).then(() => {
        alert("Results copied to clipboard!");
    }).catch(err => {
        console.error('Error copying results: ', err);
    });
}

// Event Listeners
startVotingButton.addEventListener('click', () => {
    const selectedUser = userSelection.value;
    if (selectedUser) {
        matchups = filterMatchups(generateInitialMatchups(items), selectedUser);
        shuffle(matchups);
        userSelectionContainer.classList.add('hidden');
        matchupContainer.classList.remove('hidden');
        displayMatchup(matchups[currentMatchupIndex]);
    } else {
        alert("Please select a user.");
    }
});

voteForItem1Button.addEventListener('click', () => {
    const currentMatchup = matchups[currentMatchupIndex];
    handleVote(currentMatchup.item1, currentMatchup.item2);
});

voteForItem2Button.addEventListener('click', () => {
    const currentMatchup = matchups[currentMatchupIndex];
    handleVote(currentMatchup.item2, currentMatchup.item1);
});

backButton.addEventListener('click', goBack);

copyResultsButton.addEventListener('click', copyResultsToClipboard);

// Initialize
populateUserSelection();
