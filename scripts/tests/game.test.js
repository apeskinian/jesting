/**
 * @jest-environment jsdom
 */

const { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn } = require("../game");

jest.spyOn(window, 'alert').mockImplementation(() => {});

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync('index.html', 'utf-8');
    document.open();
    document.write(fileContents);
    document.close();
})

describe("game object contains correct keys", () => {
    test("score key exists", () => {
        expect('score' in game).toBe(true);
    });
    test("currentGame key exists", () => {
        expect('currentGame' in game).toBe(true);
    });
    test("playerMoves key exists", () => {
        expect('playerMoves' in game).toBe(true);
    });
    test("choices key exists", () => {
        expect('choices' in game).toBe(true);
    });
    test("turnNumber key exists", () => {
        expect('turnNumber' in game).toBe(true);
    });
    test("choices contain correct ids", () => {
        expect(game.choices).toEqual(['button1', 'button2', 'button3', 'button4']);
    });
    test("turnInProgress key is true", () => {
        showTurns();
        expect(game.turnInProgress).toBe(true);
    });
    test("turnInProgress key exists", () => {
        showTurns();
        expect('turnInProgress' in game).toBe(true);
    });
    test("lastButton key exists", () => {
        showTurns();
        expect('lastButton' in game).toBe(true);
    });
});

describe("newGame works correctly", () => {
    beforeAll(() => {
        game.score = 42;
        game.playerMoves = ['1','2','3'];
        game.currentGame = ['1','2','3'];
        document.getElementById("score").innerText = '42';
        newGame();
    });
    test("should set game score to 0", () => {
        expect(game.score).toEqual(0);
    });
    test("should clear the playerMoves array", () => {
        expect(game.playerMoves.length).toBe(0);
    });
    test("should be one move in the computers move array", () => {
        expect(game.currentGame.length).toBe(1);
    });
    test("should display 0 for the element of id 'score'", () => {
        expect(document.getElementById("score").innerText).toEqual(0);
    });
    test("expect data listener to be true", () => {
        const elements = document.getElementsByClassName("circle");
        for (let element of elements) {
            expect(element.getAttribute('data-listener')).toEqual('true');
        };
    });
});

describe("gameplay works correctly", () => {
    beforeEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
        addTurn();
    });
    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    });
    test("addTurn adds a new turn to the game", () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    });
    test("should add correct class to buttons to light up", () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain("light");
    });
    test("showTurns should update game.turnNumber", () => {
        game.turnNumber = 42;
        showTurns();
        expect(game.turnNumber).toBe(0);
    });
    test("should increment score if turn is correct", () => {
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    });
    test("should call an alert if the move is wrong", () => {
        game.playerMoves.push('wrong');
        playerTurn();
        expect(window.alert).toBeCalledWith('Wrong move!');
    });
    test("clicking during the computer sequence shoudl fail", () => {
        showTurns();
        game.lastButton = '';
        document.getElementById('button2').click();
        expect(game.lastButton).toEqual('');
    });
});