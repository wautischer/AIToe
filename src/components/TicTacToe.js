import React, { useState } from 'react';
import './tictactoe.css';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [winner, setWinner] = useState(null);

    const handleMove = (index) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);
        checkForWinner(newBoard);
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    };

    const checkForWinner = (board) => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
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
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="container text-center text-light">
                <div className="board d-grid gap-2 mx-auto">
                    {board.map((cell, index) => (
                        <button
                            key={index}
                            className={`btn btn-light cell ${cell ? 'disabled' : ''}`}
                            onClick={() => handleMove(index)}
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
                <button className="btn btn-primary mt-3" onClick={resetGame}>
                    Reset Game
                </button>
            </div>
        </div>
    );
};

export default TicTacToe;
