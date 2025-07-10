import { sliderEvent } from "./sliderEvent.js";
import { updatesInfos0 } from "./updateInfo0.js";

export function sliderControls(sliderName, timeKeys, timeJson, allGroup, meshDict, buttonState, isPartial) {
    const slider = document.getElementById(sliderName);
    slider.max = timeKeys.length - 1;
    slider.value = timeKeys.length - 1;
    const currentTime = timeKeys[timeKeys.length - 1];
    
    updateMeshes(currentTime);
    updatesInfos(timeJson, currentTime, buttonState);

    slider.removeEventListener('input', sliderEvent);
    slider.addEventListener('input', () => {
        sliderEvent(slider, timeKeys, timeJson, allGroup, meshDict, buttonState, isPartial, true);
    });

    function sliderEvent(slider, timeKeys, uniqueData, allGroup, meshDict, buttonState, twice, num) {
        const currentIndex = parseInt(slider.value, 10);
        const currentTime = timeKeys[currentIndex];
    
        updateMeshes(currentTime);
        
        if (twice) {
            if (num) {
                updatesInfos(uniqueData, currentTime, buttonState);
                makeCategoryList(true, buttonState);
            } else {
                updatesInfos2(uniqueData, currentTime, buttonState);
                makeCategoryList(false, buttonState);
            }
        }
    
        function updateSlider(value) {
            slider.value = value;
            slider.dispatchEvent(new Event('input'));
        }
    
        function updateMeshes(currentTime) {
            for (const mm of allGroup) {
                mm.visible = false;
            }
            for (const timelog of uniqueData[currentTime]["Elements"]) {
                const groups = meshDict[timelog];
                if (groups === undefined) continue;
                groups.visible = true;
            }
        }
    }

    function updatesInfos(uniqueData, currentTime, buttonState) {
        const infoTarget = document.getElementById('info-target');
        const quantity = Object.keys(uniqueData[currentTime]["Quantity"]);
        infoTarget.innerHTML = ""; // 기존 내용 초기화

        for (const cat of quantity) {
            const catReplace = cat.replace(" ", "-");

            const quantityCat = Object.keys(uniqueData[currentTime]["Quantity"][cat]);
            let categoryDiv = document.createElement("div");
            categoryDiv.classList.add("category-container");

            let catNameDiv = document.createElement("div");
            catNameDiv.classList.add("category-name-container");
            catNameDiv.innerHTML = `<div id = "category-title" class="category-title">${cat}</div>`;
            catNameDiv.innerHTML += `<div id = ${catReplace}-category-button class="category-button">▾</div>`

            categoryDiv.appendChild(catNameDiv);

            let list = document.createElement("ul");
            list.classList.add("category-list");
            
            list.id = `${catReplace}-list`;
            let importantInfo = document.createElement("div");
            for (const quantityCatQuan of quantityCat) {
                let value = uniqueData[currentTime]["Quantity"][cat][quantityCatQuan];
                if (quantityCatQuan === "All Volume"
                    || quantityCatQuan === "All Length"
                    || quantityCatQuan === "Column Volume"
                    || quantityCatQuan === "Column Length"
                    || quantityCatQuan === "Stair Length"
                    || quantityCatQuan === "Railing Length"
                ) {
                    importantInfo.innerHTML += `<span class="key1234">${quantityCatQuan}: </span> <span id = "value123" class = "value123">${(value).toFixed(3)} </span> `;
                } else if (quantityCatQuan === "All Numbers") {
                    importantInfo.innerHTML += `<span class="key1234">${quantityCatQuan}: </span> <span id = "value123" class = "value123">${value} </span> `
                } else if (["Windows", "Doors"].includes(cat)) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = `<span class="key123">${quantityCatQuan}: </span> <span id = "value123" class = "value123">${value} </span> `;
                    list.appendChild(listItem);
                } else {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = `<span class="key123">${quantityCatQuan}: </span> <span id = "value123" class = "value123">${(value).toFixed(3)} </span> `;
                    list.appendChild(listItem);
                }
            }
            categoryDiv.appendChild(importantInfo);
            categoryDiv.appendChild(list);
            infoTarget.appendChild(categoryDiv);
            if (!buttonState[cat]) {
                list.classList.add("hide");
            } else {
                document.getElementById(`${catReplace}-category-button`).textContent = "▴";
                list.classList.remove("hide");
            }
        }
    }
    
    function updatesInfos2(uniqueData, currentTime, buttonState) {
        const infoTarget = document.getElementById("element-target");
        const quantity = Object.keys(uniqueData[currentTime]["Compare"]);
        infoTarget.innerHTML = "";

        for (const cat of quantity) {
            const catReplace = cat.replace(" ", "-");

            const quantityCat = Object.keys(uniqueData[currentTime]["Compare"][cat]);
            let categoryDiv = document.createElement("div");
            categoryDiv.classList.add("category-container");

            let catNameDiv = document.createElement("div");
            catNameDiv.classList.add("category-name-container");
            catNameDiv.innerHTML = `<div id = "category-title" class="category-title">${cat}</div>`;
            catNameDiv.innerHTML += `<div id = ${catReplace}-category-button class="category-button">▾</div>`
            
            categoryDiv.appendChild(catNameDiv);

            let list = document.createElement("ul");
            list.classList.add("category-list");
            
            list.id = `${catReplace}-list`;
            let importantInfo = document.createElement("div");
            for (const quantityCatQuan of quantityCat) {
                let value = uniqueData[currentTime]["Compare"][cat][quantityCatQuan];
                let valueClass = value > 0 ? "positive" : value < 0 ? "negative" : "neutral";
                
                if (quantityCatQuan === "All Volume"
                    || quantityCatQuan === "All Length"
                    || quantityCatQuan === "Column Volume"
                    || quantityCatQuan === "Column Length"
                    || quantityCatQuan === "Stair Length"
                    || quantityCatQuan === "Railing Length"
                ) {
                    importantInfo.innerHTML += `<span class="key1234">${quantityCatQuan}: </span> <span id = "value123" class = "value123 ${valueClass}">${(value).toFixed(3)} </span> `;
                } else if (quantityCatQuan === "All Numbers") {
                    importantInfo.innerHTML += `<span class="key1234">${quantityCatQuan}: </span> <span id = "value123" class = "value123 ${valueClass}">${value} </span> `
                } else if (["Windows", "Doors"].includes(cat)){
                    let listItem = document.createElement("li");
                    listItem.innerHTML = `<span class="key123">${quantityCatQuan}: </span> <span id = "value123" class = "value123 ${valueClass}">${(uniqueData[currentTime]["Compare"][cat][quantityCatQuan])} </span> `;
                    list.appendChild(listItem);
                } else {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = `<span class="key123">${quantityCatQuan}: </span> <span id = "value123" class = "value123 ${valueClass}">${(uniqueData[currentTime]["Compare"][cat][quantityCatQuan]).toFixed(3)} </span> `;
                    list.appendChild(listItem);
                }
            }
            categoryDiv.appendChild(importantInfo);
            categoryDiv.appendChild(list);
            infoTarget.appendChild(categoryDiv);
            if (!buttonState[cat]) {
                list.classList.add("hide");
            } else {
                console.log(`${catReplace}-category-button`);
                document.getElementById(`${catReplace}-category-button`).textContent = "▴";
                list.classList.remove("hide");
            }
        }
    }

    function updateSlider(value) {
        slider.value = value;
        slider.dispatchEvent(new Event('input'));
    }

    function updateMeshes(currentTime) {
        for (const mm of allGroup) {
            mm.visible = false;
        }
        for (const timelog of timeJson[currentTime]["Elements"]) {
            const groups = meshDict[timelog];
            if (groups === undefined) continue;
            groups.visible = true;
        }
    }
}

function makeCategoryList(buttonState) {
    let getButton = {
        "Walls": document.getElementById("Walls-category-button"),
        "Curtain Walls": document.getElementById("Curtain-Walls-category-button"),
        "Floors": document.getElementById("Floors-category-button"),
        "Ceilings": document.getElementById("Ceilings-category-button"),
        "Columns": document.getElementById("Columns-category-button"),
        "Structural Columns": document.getElementById("Structural-Columns-category-button"),
        "Stairs": document.getElementById("Stairs-category-button"),
        "Railings": document.getElementById("Railings-category-button"),
        "Windows": document.getElementById("Windows-category-button"),
        "Doors": document.getElementById("Doors-category-button"),
    }
    let getList = {
        "Walls": document.getElementById("Walls-list"),
        "Curtain Walls": document.getElementById("Curtain-Walls-list"),
        "Floors": document.getElementById("Floors-list"),
        "Ceilings": document.getElementById("Ceilings-list"),
        "Columns": document.getElementById("Columns-list"),
        "Structural Columns": document.getElementById("Structural-Columns-list"),
        "Stairs": document.getElementById("Stairs-list"),
        "Railings": document.getElementById("Railings-list"),
        "Windows": document.getElementById("Windows-list"),
        "Doors": document.getElementById("Doors-list"),
    }
    
    function buttonClickEventHandler(cat, getList) {
        if (!buttonState[cat]) {
            getList[cat].classList.remove("hide");
            buttonState[cat] = true;
            getButton[cat].textContent = "▴";
        } else {
            getList[cat].classList.add("hide");
            buttonState[cat] = false;
            getButton[cat].textContent = "▾";
        }
    }

    Object.keys(getButton).forEach(k => {
        getButton[k].addEventListener("click", () => buttonClickEventHandler(k, getList));
    });
}