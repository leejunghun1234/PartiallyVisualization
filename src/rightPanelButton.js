import { makeCategoryList } from "./slider.js";

export function rightPanelButtonClick(buttonState) {
    const buttons = {
        "quant-button": "info-divs",
        "chart-button":"element-divs"
    }

    const buttons2 = {
        "quant-button": ["info-target", "element-target"],
        "chart-button": ["element-target", "info-target"]
    }

    document.getElementById('quant-button').style.backgroundColor = "#2e7d32";
    document.getElementById('quant-button').style.transform = "translateY(-5px)";

    Object.keys(buttons).forEach(buttonId => {
        document.getElementById(buttonId).addEventListener("click", () => {
            const targetId = buttons[buttonId];

            Object.keys(buttons).forEach(b => {
                document.getElementById(b).style.backgroundColor = "#45a049";
                document.getElementById(b).style.transform = "translateY(0px)";
            })
            document.getElementById(buttonId).style.backgroundColor = "#2e7d32";
            document.getElementById(buttonId).style.transform = "translateY(-5px)";
            
            // 모든 cat-divs 그룹 숨김 처리
            document.querySelectorAll(".cat-divs").forEach(div => {
                div.classList.add("hide");
            });

            // 대상 div만 보이기
            document.getElementById(targetId).classList.remove("hide");
        });
    });

    const infoTarget = document.getElementById("info-target");
    const infoTarget2 = document.getElementById("element-target");

    infoTarget.scrollTop = infoTarget2.scrollTop;
}