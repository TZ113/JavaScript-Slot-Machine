// My attempt at JavaScript-slot-machine from techwithtim

const prompt = require("prompt-sync")();

const ROWS = 3
const REELS = 3

const symbolsCount = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
}

const symbolsValue = {
    A: 8,
    B: 6,
    C: 4,
    D: 2
}

// Gets a deposit amount from the player
const getDeposit = () => {
    while (true) {
        const depositAmount = prompt("How much you want to deposit? $");
        const numberDepositAmount = parseFloat(depositAmount);
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Please enter a valid amount");
        } else {
            return numberDepositAmount
        }
    }
}

// Gets the total number of lines the player wants to bet on
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("How many lines you want to bet on (max is 3)? ");
        const numberOfLines = parseFloat(lines);
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Please enter a valid number");
        } else {
            return numberOfLines
        }
    }
}

// gets the amount the player wants to bet on each line
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt(`You have ${balance} left and you are betting on ${lines} lines. How much you want to bet per line? $`);
        const numberBet = parseFloat(bet);
        if (isNaN(numberBet) || numberBet <= 0) {
            console.log("Please enter a valid number");
        } else if (numberBet * lines > balance) {
            console.log("You don't have sufficient amount for that bet.")
        }
        else {
            return numberBet
        }
    }
}

// Returns an array of arrays of symbols that implements the spin of a slot machine where each array has the length of rows and represents the reels or columns in the slot machine
const spin = () => {
    const allSymbols = []
    for (const symbol in symbolsCount) {
        for (let i = 0; i < symbolsCount[symbol]; i++) {
            allSymbols.push(symbol);
        }
    }

    const slots = [];
    for (let i = 0; i < REELS; i++) {
        slots.push([]);
        const allSymbolsCopy = [...allSymbols];
        for (j = 0; j < ROWS; j++) {
            let rndIndex = Math.floor(Math.random() * allSymbolsCopy.length);
            const selectedSymbol = allSymbolsCopy[rndIndex];
            slots[i].push(selectedSymbol);
            allSymbolsCopy.splice(rndIndex, 1);
        }
    }

    return slots
}

// Prints the result for the player in a readable way
const printSlots = (cols) => {
    console.log(cols);
    for (let i = 0; i < cols[0].length; i++) {
        let str = '';
        for (let j = 0; j < cols.length; j++) {
            if (j < cols.length - 1) {
                str += cols[j][i] + ' | ';
            } else {
                str += cols[j][i];
            }
        }
        console.log(str);
    }
}

// Checks whether the player won or lost in any of the lines and returns the winnings and lines on which he's won
const checkWinnings = (bet, lines, columns) => {
    let winnings = 0;
    const winningLines = [];
    for (let i = 0; i < lines; i++) {
        console.log(columns[0][i]);
        const symbol = columns[0][i];
        allSame = true;
        for (let column of columns) {
            if (symbol != column[i]) {
                allSame = false;
                break
            }
        }
        if (allSame === true) {
            winningLines.push(i + 1);
            winnings += bet * symbolsValue[symbol]
        }
    }
    console.log(winnings, winningLines);
    return [winnings, winningLines]
}


// This is the main function where the game begins and ends
const game = () => {
    let balance = getDeposit();

    while (true) {
        if (balance <= 0) {
            console.log("You have ran out of money.");
            break
        } else {
            const ans = prompt(`You have ${balance}$. Do you want to continue (y/n)? `);
            if (ans.match(/y/i)) {
                const lines = getNumberOfLines();
                const betPerLine = getBet(balance, lines);
                const totalBet = lines * betPerLine;
                balance -= totalBet;
                const slots = spin();
                printSlots(slots);
                const winningsAndWinningLines = checkWinnings(betPerLine, lines, slots);
                console.log(winningsAndWinningLines);
                if (winningsAndWinningLines[0] > 0) {
                    balance += winningsAndWinningLines[0];
                    if (winningsAndWinningLines[1].length < lines) {
                        const totalLines = [];
                        for (let i = 0; i < lines; i++) totalLines.push(i + 1)
                        const losingLines = totalLines.filter(function (i) { return !winningsAndWinningLines[1].includes(i) });
                        console.log(`You've won ${winningsAndWinningLines[0]}$ on lines ${winningsAndWinningLines[1]}, and lost ${betPerLine * losingLines.length}$ on lines ${losingLines}.`);
                    }
                } else {
                    console.log(`You've lost ${totalBet}$.`)
                }
            } else break
        }
    }
}

game()