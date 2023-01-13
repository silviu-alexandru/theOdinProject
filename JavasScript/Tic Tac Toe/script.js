const tableDivs = document.querySelectorAll('.tableDiv');    
const players = document.querySelectorAll('.player');
let currentPlayer = '1';
let messageBoard = document.getElementById('messages');
messageBoard.textContent = 'Game started.'

const gameEvents = (()=>{
    const events = {};
    const subscribe = (eventName, fn) => {
        events[eventName] = events[eventName] || [];
        events[eventName].push(fn)
    }
    const unsubscribe = (eventName, fn) => {
        if (events[eventName]) {
            for (let index = 0; index < events[eventName].length; index++) {
                if (events[eventName][index] == fn) {
                    events[eventName].splice(index, 1);
                    break;
                }
                
            }
        }
    }
    const emit = (eventName, data) => {
        if (events[eventName]) {
            events[eventName].forEach((fn) => {
                fn(data);
            })
        }
    }
    return {
        subscribe,
        unsubscribe,
        emit,
        events
    }
})()

const init = (() => {
    const restartButton = document.getElementById('restart-btn');
    restartButton.addEventListener('click', () => {
        gameEvents.emit('restart')
    })
    const resetButton = document.getElementById('reset-btn');
    resetButton.addEventListener('click', () => {
        gameEvents.emit('reset')
    })

    players[0].classList.add('active-player');

/*     const playerMaker = (aNumber, aName = '') =>{
        let name = aName;
        let number = aNumber;
        const changeName = function(newName) {
            this.name = newName;
        }
        return {number, name, changeName}
    }

    //createPlayers
    const player1 = playerMaker('1', '');
    const palyer2 = playerMaker('2', '');
    let names = [...document.querySelectorAll('#name-1, #name-2')];
    console.log(names);
    names.forEach(element => {
        element.addEventListener('change', (e) =>{
            player1.changeName = e.target.textContent
        })        
    });
    return {
        player1,
        palyer2,

    } */
})()

const game = (()=>{


    const markCell = (e) => {
        let markClass = `marked-${currentPlayer}`;
        e.target.classList.add(markClass);
        e.target.removeEventListener('click', game.markCell)
        gameEvents.emit('marked')

    };
    const checkLines = () => {
        for (const key in tableAction.lines) {
            if (Object.hasOwnProperty.call(tableAction.lines, key)) {
                const line = tableAction.lines[key];
                
                if (!line.tie) {
                    
                    let lineArray =[];
                    line.cells.forEach(element => {
                        if (element.className.match(/marked-/g)) {
                            const ref = element.className.match(/marked-\d/)
                            
                            lineArray.push(ref[0])
                        }
                    });
                    
                    if (lineArray.length == 3) {
                        if (lineArray[0] == lineArray[1] && lineArray[0] == lineArray[2]) {
                            gameEvents.emit("win", line.cells);
                            return
                        }else {
                            line.tie = true;

                            gameEvents.emit('newTie');
                        }
                    }
                }                
            }
        }
        console.log("emit continue");
        gameEvents.emit('continue')
    }
    const checkForTie = () => {
        for (const key in tableAction.lines) {
            if (Object.hasOwnProperty.call(tableAction.lines, key)) {
                const line = tableAction.lines[key];                
                if (!line.tie) {
                    return
                }
            }
        }
        console.log("emit tie");
        gameEvents.emit("tie");
        //writeMsg("Tie.Game Ended");
    }
    const celebrate = (cells) => {
        
        cells.forEach(element => {
            element.classList.add("win")
        });
        let winer = document.getElementById(`name-${currentPlayer}`).value;
        winer = winer == '' ? `Player ${currentPlayer}` : winer;
        messageBoard.textContent += "\n"+`${winer} won.` 
        
    }
    const gameEnded = (win) => {
        //removeEventListener('click', game.markCell)
        console.log(win);
        if (!win) {

            messageBoard.textContent += "\n"+`Tie. No winner.` 
        }

        gameEvents.unsubscribe('continue', nextPlayer);
        gameEvents.unsubscribe('marked', checkLines);
        tableDivs.forEach(tableDiv => {
            tableDiv.removeEventListener('click', game.markCell)
        });
        tableAction.lines
    }

    const nextPlayer = () =>{
        currentPlayer = currentPlayer === '1' ? '2' : "1";  
        players.forEach(player => {
            player.classList.toggle('active-player')
        });
        gameEvents.emit('nextPlayer', currentPlayer);
    }
    const resubscribe = () =>{
        gameEvents.unsubscribe('continue', nextPlayer);
        gameEvents.unsubscribe('marked', checkLines);

        gameEvents.subscribe('continue', nextPlayer);
        gameEvents.subscribe('marked', checkLines);
    }
    gameEvents.subscribe('marked', checkLines);
    gameEvents.subscribe('continue', nextPlayer);
    gameEvents.subscribe('newTie', checkForTie);
    gameEvents.subscribe('win', celebrate);
    gameEvents.subscribe('win', gameEnded);
    gameEvents.subscribe('tie', gameEnded);
    gameEvents.subscribe('reset', resubscribe);
    gameEvents.subscribe('restart', resubscribe);
    

    return {
        markCell,
        /*         
        checkForTie,
        celebrate,
        nextPlayer, */
    }
})()

const tableAction = (() =>{

    const createLine = (selector) => {
        let cells = [...document.querySelectorAll(`${selector}`)]
        let tie = false;
        return {tie, cells}        
    }
    const lines = {
        row1 : createLine('.row1'),
        row2 : createLine('.row2'),
        row3 : createLine('.row3'),

        col1 : createLine('.col1'),
        col2 : createLine('.col2'),
        col3 : createLine('.col3'),

        diag1 : createLine('#r1c1, #r2c2, #r3c3'),
        diag2: createLine('#r1c3, #r2c2, #r3c1'),
    }
    
    const resetTies = ()=>{

        for (const key in lines) {
            if (Object.hasOwnProperty.call(lines, key)) {
                const line = lines[key];
                line.tie = false;
            }
        }
    }
    const addClickToCells = () => {
        tableDivs.forEach(tableDiv => {
            tableDiv.addEventListener('click', game.markCell)
        });
    };
    addClickToCells();
    const clearTable = () => {
        tableDivs.forEach(tableDiv => {
            tableDiv.classList.remove('marked-1', 'marked-2', 'win')
        });
        
    };

    const clearPlayersFields = ()=>{
        let name1 = document.getElementById('name-1');
        let name2 = document.getElementById('name-2');
        console.log(name1);
        name1.value = '';
        name2.value = ''; 
    }

    const initialActivePlayer = ()=>{
        currentPlayer = '1'
        players[0].classList.add('active-player');
        players[1].classList.remove('active-player');
    }
    const initialMessage = ()=>{
        messageBoard.textContent = "Game Started." 
    }
    gameEvents.subscribe('reset', initialActivePlayer)
    gameEvents.subscribe('reset', clearPlayersFields)
    gameEvents.subscribe('reset', initialMessage)
    gameEvents.subscribe('reset', resetTies)

    gameEvents.subscribe('reset', clearTable)
    gameEvents.subscribe('reset', addClickToCells)

    gameEvents.subscribe('restart', clearTable)
    gameEvents.subscribe('restart', addClickToCells)
    gameEvents.subscribe('restart', initialActivePlayer)
    gameEvents.subscribe('restart', initialMessage)
    gameEvents.subscribe('restart', resetTies)
    return {lines}
})();


const robot = (() => {
    
    /*     let index = Math.floor(Math.random()*10);
    index = index > 8 ? index-8 : index;
    console.log(index);
    let cell = tableDivs[index];
    if (!cell.className.match(/marked-/g)) {
        cell.classList.add('marked-2')
    } */
    const cpuPlayerNo = "2"
    
    const lines = tableAction.lines;
    console.log(lines);
    const priotities = {
        1: ['r2c2'],
        2: ['r1c1', 'r1c3', 'r3c1', 'r3c3' ],
        3: ['r1c2', 'r2c1', 'r2c3', 'r3c2'],
    }
    const linePriorities = {}
    const cpuMove = (playerNo) => {
        if (playerNo == cpuPlayerNo) {
            console.log('cpuMove fireing..');
            for (const key in lines) {
                if (Object.hasOwnProperty.call(lines, key)) {
                    const line = lines[key];
                    if (!line.tie) {
                        //let cpuCells = 0;
                        //let playerCells = 0;
                        line.priority = [];
                        line.cells.forEach(element => {
                            let id = element.id;
                            let score = [0,0];
                            if (element.className.match(/marked-/g)) {
                                let ref = element.className.match(/marked-\d/)
                                if (ref ==   `marked-${cpuPlayerNo}`) {
                                    score[0] = 1
                                    //cpuCells++
                                }else {
                                    //playerCells++
                                    score[1] = 1
                                }
                            }
                            line.priority.push([id, score])
                        });
                        //line.priority = [cpuCells, playerCells]
                        console.log(line.priority);

/*                         if (cpuCells > 1) {
                            line.priotity = 9;
                        }else if (playerCells > 1) {
                            line.priotity = 8;
                        }else if (cpuCells > 0) {
                            line.priotity = 7;
                        }else if (playerCells > 0){
                            line.priotity = 6;
                        } else {
                            line.priotity = 5;
                        } */
                    }
                    
                }
            }
        }
    }
    cpuMove("2");
    gameEvents.subscribe('nextPlayer', cpuMove );
})()
