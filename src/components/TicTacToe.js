import React, { useState } from 'react';
import Camera from './Camera';
import './tictactoe.css';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [winner, setWinner] = useState(null);
    const [row, setRow] = useState(null);
    const [cell, setCell] = useState(null);
    const [isRowSelection, setIsRowSelection] = useState(true);

    const handleSelectionComplete = (selectedClass) => {
        console.log("Detected selection:", selectedClass); // Log the detected class name
        const valueMap = {
            '1_finger': 0,
            '2_finger': 1,
            '3_finger': 2,
            'keine_finger': null,
        };

        const selection = valueMap[selectedClass];

        if (selection === null) {
            console.log("Invalid selection detected"); // Log if selection is invalid
            return;
        }

        if (isRowSelection) {
            setRow(selection);
            setIsRowSelection(false); // Move to cell selection next
        } else {
            setCell(selection);
            setIsRowSelection(true); // Reset to row selection after setting cell
        }
    };


    // Function to make a move based on the selected row and cell
    const makeMove = () => {
        if (row !== null && cell !== null && !winner) {
            const position = row * 3 + cell;
            if (board[position]) return; // Prevent overwriting an occupied cell

            const newBoard = [...board];
            newBoard[position] = currentPlayer;
            setBoard(newBoard);
            checkForWinner(newBoard);
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

            // Reset row and cell for the next move
            setRow(null);
            setCell(null);
        }
    };

    // Check for winner
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

    // Reset the game
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setWinner(null);
        setRow(null);
        setCell(null);
    };

    return (
        <div className="container vh-100 d-flex align-items-center">
            <div className="row w-100">
                {/* Left side: Camera and selection status */}
                <div className="col-md-6 d-flex flex-column align-items-center">
                    <Camera onSelectionComplete={handleSelectionComplete} />

                    {/* Display current selection below the camera */}
                    <div className="mt-3 text-center">
                        <p>Current Selection: {isRowSelection ? 'Row' : 'Cell'}</p>
                        {row !== null && <p>Selected Row: {row}</p>}
                        {cell !== null && <p>Selected Cell: {cell}</p>}
                    </div>
                </div>

                {/* Right side: Tic Tac Toe board, centered */}
                <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
                    <div className="text-center text-light">
                        <div className="board d-grid gap-2 mx-auto">
                            {board.map((cell, index) => (
                                <button
                                    key={index}
                                    className={`btn btn-light cell ${cell ? 'disabled' : ''}`}
                                    disabled={!!cell || winner} // Disable if cell is occupied or there's a winner
                                >
                                    {cell}
                                </button>
                            ))}
                        </div>

                        {/* Display the winner or the current player */}
                        {winner ? (
                            <div className="alert alert-success mt-3">Winner: {winner}</div>
                        ) : (
                            <p className="mt-3">Next Player: {currentPlayer}</p>
                        )}

                        {/* Buttons for Next Move and Reset */}
                        <button className="btn btn-primary mt-3" onClick={makeMove} disabled={row === null || cell === null || winner}>
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
