import React, { useState } from "react";

function Square({ value, handleSquareClickProp }) {
  if (value === "X") {
    return (
      <button className="square" onClick={handleSquareClickProp} style={{ color: "red" }}>
        {value}
      </button>
    );
  } else {
    return (
      <button className="square" onClick={handleSquareClickProp} style={{ color: "green" }}>
        {value}
      </button>
    );
  }
}

let moveHistory = [];
export default function Board() {
  const [isXNext, setIsXNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  function handleSquareClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    let squaresCopy = squares.slice();
    if (isXNext) {
      squaresCopy[i] = "X";
    } else {
      squaresCopy[i] = "O";
    }
    setSquares(squaresCopy);
    setIsXNext(!isXNext);
    moveHistory.push(squaresCopy);
  }
  const moves = moveHistory.map((move, idx) => {
    let description;
    if (idx > 0) {
      // description = "Go to move #" + idx;
      // return (
      //   <li>
      //     <button onClick={() => jumpTo(idx)}>{description}</button>
      //   </li>
      // );
    } else {
      return (
        <li>
          <button onClick={() => jumpTo(0)}>Start Over !</button>
        </li>
      );
    }
  });
  function jumpTo(idx) {
    if (idx === 0) {
      setSquares(Array(9).fill(null));
      setIsXNext(true);
      moveHistory = [];
      showBoardEnd();
    } else {
      setSquares(moveHistory[idx - 1]);
      moveHistory.splice(idx);
      if (idx % 2 === 0) {
        setIsXNext(true);
      } else {
        setIsXNext(false);
      }
    }
  }
  function basicAI() {
    let occurences = [];
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] == null) {
        occurences.push(i);
      }
    }
    let min = Math.ceil(0);
    let max = Math.floor(occurences.length);
    const randomValue = occurences[Math.floor(Math.random() * (max - min) + min)];

    return randomValue;
  }
  if (!isXNext) {
    const idx = basicAI();
    handleSquareClick(idx);
  }

  const winningSeries = calculateWinner(squares);
  var finalText;
  if (winningSeries) {
    const winner = squares[winningSeries[0]];
    if (winner === "X") {
      finalText = "Congratulations! You Won!";
    } else {
      finalText = ":( You Lost, Check where you went wrong!";
    }
    let firstButton = document.getElementsByClassName("square")[winningSeries[0]];
    let secondButton = document.getElementsByClassName("square")[winningSeries[1]];
    let thirdButton = document.getElementsByClassName("square")[winningSeries[2]];
    firstButton.style.backgroundColor = "lightyellow";
    secondButton.style.backgroundColor = "lightyellow";
    thirdButton.style.backgroundColor = "lightyellow";
    const winningX1 = firstButton.offsetLeft + firstButton.offsetWidth / 2;
    const winningY1 = firstButton.offsetTop + firstButton.offsetHeight / 2;
    const winningX2 = thirdButton.offsetLeft + thirdButton.offsetWidth / 2;
    const winningY2 = thirdButton.offsetTop + thirdButton.offsetHeight / 2;
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "1200");
    svg.setAttribute("height", "1200");
    svg.style.bottom = "0px";
    svg.style.top = "0px";
    svg.style.right = "0px";
    svg.style.left = "0px";

    svg.style.position = "absolute";

    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("width", "0");
    line.setAttribute("height", "0");
    line.setAttribute("x1", winningX1);
    line.setAttribute("y1", winningY1);
    line.setAttribute("x2", winningX2);
    line.setAttribute("y2", winningY2);
    line.setAttribute("stroke", "rgb(176, 245, 66)");
    line.setAttribute("stroke-width", "5");

    svg.appendChild(line);

    let ct = document.getElementsByClassName("game-board")[0];
    let gameoverMenuElement = document.getElementsByClassName("gameover-menu")[0];
    ct.appendChild(svg);
    setTimeout(() => {
      ct.style.visibility = "hidden";
      ct.style.display = "none";
      gameoverMenuElement.style.display = "block";
      gameoverMenuElement.style.visibility = "visible";
      gameoverMenuElement.style.transform = "rotate(360deg)";
    }, 1500);
  } else {
    let draw = true;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] == null) {
        draw = false;
        break;
      }
    }
    if (draw) {
      finalText = "It's a draw! Try Again";
      let ct = document.getElementsByClassName("game-board")[0];
      let gameoverMenuElement = document.getElementsByClassName("gameover-menu")[0];
      ct.style.visibility = "hidden";
      ct.style.display = "none";
      gameoverMenuElement.style.display = "block";
      gameoverMenuElement.style.visibility = "visible";
      gameoverMenuElement.style.transform = "rotate(360deg)";
    }
  }

  return (
    <React.Fragment>
      <h1>
        <u>React Tic-Tac-Toe</u>
      </h1>

      <main className="container">
        <span className="game-menu">
          <h3>Choose your symbol</h3>
          <a
            href="#"
            role="button"
            style={{ margin: "20px" }}
            onClick={() => {
              setIsXNext(true);
              showBoardStart();
            }}
          >
            X (Player goes first)
          </a>
          <a
            href="#"
            role="button"
            onClick={() => {
              setIsXNext(false);
              showBoardStart();
            }}
          >
            O (Computer goes first)
          </a>
        </span>
        <article className="game-board">
          {/* <svg viewBox="0 0 100 100" style={{ top: "0px", bottom: "0px", left: "0px", right: "0px", position: "absolute" }}>
            <line x1="365" x2="365" y1="0" y2="275" stroke="black" strokeWidth="5px"></line>
          </svg> */}
          <div className="grid" style={{ borderBottom: "5px solid black" }}>
            <Square value={squares[0]} handleSquareClickProp={() => handleSquareClick([0])} />
            <Square value={squares[1]} handleSquareClickProp={() => handleSquareClick([1])} />
            <Square value={squares[2]} handleSquareClickProp={() => handleSquareClick([2])} />
          </div>
          <div className="grid" style={{ borderBottom: "5px solid black" }}>
            <Square value={squares[3]} handleSquareClickProp={() => handleSquareClick([3])} />
            <Square value={squares[4]} handleSquareClickProp={() => handleSquareClick([4])} />
            <Square value={squares[5]} handleSquareClickProp={() => handleSquareClick([5])} />
          </div>
          <div className="grid">
            <Square value={squares[6]} handleSquareClickProp={() => handleSquareClick([6])} />
            <Square value={squares[7]} handleSquareClickProp={() => handleSquareClick([7])} />
            <Square value={squares[8]} handleSquareClickProp={() => handleSquareClick([8])} />
          </div>
        </article>
        <article className="gameover-menu">
          <h4>{finalText}</h4>
          {moves}
        </article>
      </main>
    </React.Fragment>
  );
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
function showBoard() {
  const boardElement = document.getElementsByClassName("game-board")[0];

  boardElement.style.visibility = "visible";
  boardElement.style.display = "block";
  boardElement.style.opacity = "1";
}
function hideGameoverMenu() {
  let gameoverMenuElement = document.getElementsByClassName("gameover-menu")[0];
  gameoverMenuElement.style.visibility = "hidden";
  gameoverMenuElement.style.display = "none";
}
function showBoardStart() {
  const menuElement = document.getElementsByClassName("game-menu")[0];
  menuElement.style.display = "none";
  showBoard();
}
function showBoardEnd() {
  hideGameoverMenu();
  showBoard();
  for (var i = document.getElementsByTagName("svg").length; i--; ) {
    document.getElementsByTagName("svg")[i].remove();
  }

  for (let element of document.getElementsByClassName("square")) {
    element.style.backgroundColor = "white";
  }
}
