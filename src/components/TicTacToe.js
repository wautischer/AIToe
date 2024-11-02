import React, { useState } from 'react';
import Camera from './Camera';
import './tictactoe.css';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [winner, setWinner] = useState(null);
    const [row, setRow] = useState(null);
    const [col, setCol] = useState(null);
    const [isRowSelection, setIsRowSelection] = useState(true);

    const handleSelectionComplete = (selectedClass) => {
        console.log("Detected selection:", selectedClass);
        const valueMap = {
            '1_finger': 0,
            '2_finger': 1,
            '3_finger': 2,
            'keine_finger': null,
        };

        const selection = valueMap[selectedClass];

        if (selection === null) {
            console.log("Invalid selection detected");
            return;
        }

        if (isRowSelection) {
            setRow(selection);
            setIsRowSelection(false);
        } else {
            setCol(selection);
            setIsRowSelection(true);
        }
    };

    const makeMove = () => {
        if (row !== null && col !== null && !winner) {
            const position = row * 3 + col;
            if (board[position]) return;

            const newBoard = [...board];
            newBoard[position] = currentPlayer;
            setBoard(newBoard);
            checkForWinner(newBoard);
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

            setRow(null);
            setCol(null);
        }
    };

    const checkForWinner = (board) => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];

        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                setWinner(board[a]);
                return;
            }
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setWinner(null);
        setRow(null);
        setCol(null);
    };

    return (
        <div className="container vh-100 d-flex align-items-center">
            <div className="row w-100">
                <div className="col-md-6 d-flex flex-column align-items-center">
                    <Camera onSelectionComplete={handleSelectionComplete} />
                    <div className="mt-3 text-center">
                        {row !== null && <p>Selected Row: {row + 1}</p>}
                        {col !== null && <p>Selected Column: {col + 1}</p>}
                    </div>
                </div>
                <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
                    <div className="text-center text-light">
                        <div className="board d-grid gap-2 mx-auto">
                            {board.map((cell, index) => (
                                <button
                                    key={index}
                                    className={`btn btn-light cell ${cell ? 'disabled' : ''}`}
                                    disabled={!!cell || winner}
                                >
                                    {cell}
                                </button>
                            ))}
                        </div>
                        {winner ? (
                            <div className="alert alert-success mt-3">Winner: {winner}</div>
                        ) : (
                            <p className="mt-3">Next Player: {currentPlayer}</p>
                        )}
                        <button className="btn btn-primary mt-3" onClick={makeMove} disabled={row === null || col === null || winner}>
                            Next Move
                        </button>
                        <button className="btn btn-secondary mt-3" onClick={resetGame}>
                            Reset Game
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicTacToe;
