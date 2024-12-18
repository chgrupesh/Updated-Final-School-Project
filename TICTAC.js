let boxes = document.querySelectorAll(".box");
let reset = document.querySelector("#reset-button");
let turnO = true;  //player X and Player O
let newgamebutton = document.querySelector("#new-button");
let msgcontainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let count = 0;
const winningpatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const resetgame = () => {
    turnO = true;
    count = 0;
    enableallboxes();
    msgcontainer.classList.remove("show");
    msgcontainer.classList.add("hide");
    removeWinnerLine();
    // Reset message opacity and position to prepare for next game
    msg.style.opacity = 0;
    msg.style.transform = 'translateY(-30px)';
}

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (box.innerText !== "") return; // Prevent clicking on filled boxes

        if (turnO) {
            box.innerText = "O";
            turnO = false;
        } else {
            box.innerText = "X";
            turnO = true;
        }
        box.disabled = true;
        count++;

        let waswinner = checkwinner();
        if (count === 9 && !waswinner) {
            gamedraw();
        }
    });
});

const gamedraw = () => {
    msg.innerText = `Game was Draw`;
    msgcontainer.classList.remove("hide");
    msgcontainer.classList.add("show");
    msg.style.opacity = 1;
    msg.style.transform = 'translateY(0)';
    disableallboxes();
};

const disableallboxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableallboxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

const showWinner = (winner, pattern) => {
    msg.innerText = `Player ${winner} won the game`;
    msgcontainer.classList.remove("hide");
    msgcontainer.classList.add("show");
    msg.style.opacity = 1;
    msg.style.transform = 'translateY(0)';
    disableallboxes();
    animateWinnerLine(pattern);
};

const checkwinner = () => {
    for (let pattern of winningpatterns) {
        let val1 = boxes[pattern[0]].innerText;
        let val2 = boxes[pattern[1]].innerText;
        let val3 = boxes[pattern[2]].innerText;

        if (val1 != "" && val2 != "" && val3 != "") {
            if (val1 === val2 && val2 === val3 && val3 === val1) {
                showWinner(val1, pattern);
                return true;
            }
        }
    }
    return false;
};

const animateWinnerLine = (pattern) => {
    const line = document.createElement("div");
    line.classList.add("winning-line");
    const boxPositions = pattern.map(index => boxes[index].getBoundingClientRect());
    
    const x1 = boxPositions[0].left + boxPositions[0].width / 2;
    const y1 = boxPositions[0].top + boxPositions[0].height / 2;
    const x2 = boxPositions[2].left + boxPositions[2].width / 2;
    const y2 = boxPositions[2].top + boxPositions[2].height / 2;
    
    const lineWidth = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    line.style.width = `${lineWidth}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.top = `${y1}px`;
    line.style.left = `${x1}px`;

    document.body.appendChild(line);
    line.classList.add("active");
};

const removeWinnerLine = () => {
    const line = document.querySelector(".winning-line");
    if (line) {
        line.remove();
    }
};

newgamebutton.addEventListener("click", resetgame);
reset.addEventListener("click", resetgame);
