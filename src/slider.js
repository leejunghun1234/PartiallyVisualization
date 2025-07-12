export function sliderControls(sliderName, timeKeys, timeJson, allGroup, meshDict, buttonState, isPartial) {
    const slider = document.getElementById(sliderName);
    slider.max = timeKeys.length - 1;
    slider.value = timeKeys.length - 1;
    const currentTime = timeKeys[timeKeys.length - 1];
    console.log(Object.keys(timeJson[Object.keys(timeJson)[0]]).includes("Compare"));
    updateMeshes(currentTime);

    if (isPartial) {
        updatesInfos(timeJson, currentTime, buttonState);
        updatesInfos2(timeJson, currentTime, buttonState);
        makeCategoryList(buttonState);
    }
    
    slider.removeEventListener('input', sliderEvent);
    slider.addEventListener('input', () => {
        sliderEvent(slider, timeKeys, timeJson, allGroup, meshDict, buttonState, isPartial, true);
    });

    function sliderEvent(slider, timeKeys, uniqueData, allGroup, meshDict, buttonState, isPartial, num) {
        const currentIndex = parseInt(slider.value, 10);
        const currentTime = timeKeys[currentIndex];
    
        updateMeshes(currentTime);
        if (isPartial) {
            if (num) {
                console.log("하이");
                updatesInfos(uniqueData, currentTime, buttonState);
                updatesInfos2(timeJson, currentTime, buttonState);
                
                makeCategoryList(buttonState);
            } else {
                updatesInfos2(uniqueData, currentTime, buttonState);
                makeCategoryList(buttonState);
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
            importantInfo.classList.add("main-quant-div");
            for (const quantityCatQuan of quantityCat) {
                let value = uniqueData[currentTime]["Quantity"][cat][quantityCatQuan];
                if (quantityCatQuan === "All Volume"
                    || quantityCatQuan === "All Length"
                    || quantityCatQuan === "Column Volume"
                    || quantityCatQuan === "Column Length"
                    || quantityCatQuan === "Stair Length"
                    || quantityCatQuan === "Railing Length"
                ) {
                    importantInfo.innerHTML += `<span class="main-qunt">${quantityCatQuan}: </span> <br> <span id = "value123" class = "main-value">${(value).toFixed(3)} </span> <br>`;
                } else if (quantityCatQuan === "All Numbers") {
                    importantInfo.innerHTML += `<span class="main-qunt">${quantityCatQuan}: </span> <br> <span id = "value123" class = "main-value">${value} </span> <br>`;
                } else if (["Windows", "Doors"].includes(cat)) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = `<span class="key123">${quantityCatQuan}: </span> <br> <span id = "value123" class = "value123">${value} </span> `;
                    list.appendChild(listItem);
                } else {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = `<span class="key123">${quantityCatQuan}: </span> <br> <span id = "value123" class = "value123">${(value).toFixed(3)} </span> `;
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
            catNameDiv.innerHTML += `<div id = "${catReplace}-category-button-2" class="category-button">▾</div>`
            
            categoryDiv.appendChild(catNameDiv);

            let list = document.createElement("ul");
            list.classList.add("category-list");
            
            list.id = `${catReplace}-list-2`;
            let importantInfo = document.createElement("div");
            importantInfo.classList.add("main-quant-div");
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
                    importantInfo.innerHTML += `<span class="main-qunt">${quantityCatQuan}: </span> <br> <span id = "value123" class = "main-value">${(value).toFixed(3)} </span> <br>`;
                } else if (quantityCatQuan === "All Numbers") {
                    importantInfo.innerHTML += `<span class="main-qunt">${quantityCatQuan}: </span> <br> <span id = "value123" class = "main-value">${value} </span> <br>`
                } else if (["Windows", "Doors"].includes(cat)){
                    let listItem = document.createElement("li");
                    listItem.innerHTML = `<span class="key123">${quantityCatQuan}: </span> <br> <span id = "value123" class = "value123 ${valueClass}">${(uniqueData[currentTime]["Compare"][cat][quantityCatQuan])} </span> `;
                    list.appendChild(listItem);
                } else {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = `<span class="key123">${quantityCatQuan}: </span> <br> <span id = "value123" class = "value123 ${valueClass}">${(uniqueData[currentTime]["Compare"][cat][quantityCatQuan]).toFixed(3)} </span> `;
                    list.appendChild(listItem);
                }
            }
            categoryDiv.appendChild(importantInfo);
            categoryDiv.appendChild(list);
            infoTarget.appendChild(categoryDiv);
            if (!buttonState[cat]) {
                list.classList.add("hide");
            } else {
                document.getElementById(`${catReplace}-category-button-2`).textContent = "▴";
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

export function makeCategoryList(buttonState) {
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
    let getButton2 = {
        "Walls": document.getElementById("Walls-category-button-2"),
        "Curtain Walls": document.getElementById("Curtain-Walls-category-button-2"),
        "Floors": document.getElementById("Floors-category-button-2"),
        "Ceilings": document.getElementById("Ceilings-category-button-2"),
        "Columns": document.getElementById("Columns-category-button-2"),
        "Structural Columns": document.getElementById("Structural-Columns-category-button-2"),
        "Stairs": document.getElementById("Stairs-category-button-2"),
        "Railings": document.getElementById("Railings-category-button-2"),
        "Windows": document.getElementById("Windows-category-button-2"),
        "Doors": document.getElementById("Doors-category-button-2"),
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
    let getList2 = {
        "Walls": document.getElementById("Walls-list-2"),
        "Curtain Walls": document.getElementById("Curtain-Walls-list-2"),
        "Floors": document.getElementById("Floors-list-2"),
        "Ceilings": document.getElementById("Ceilings-list-2"),
        "Columns": document.getElementById("Columns-list-2"),
        "Structural Columns": document.getElementById("Structural-Columns-list-2"),
        "Stairs": document.getElementById("Stairs-list-2"),
        "Railings": document.getElementById("Railings-list-2"),
        "Windows": document.getElementById("Windows-list-2"),
        "Doors": document.getElementById("Doors-list-2"),
    }
    let getList3 = {
        "Walls": document.getElementById("Walls-list-1"),
        "Curtain Walls": document.getElementById("Curtain-Walls-list-1"),
        "Floors": document.getElementById("Floors-list-1"),
        "Ceilings": document.getElementById("Ceilings-list-1"),
        "Columns": document.getElementById("Columns-list-1"),
        "Structural Columns": document.getElementById("Structural-Columns-list-1"),
        "Stairs": document.getElementById("Stairs-list-1"),
        "Railings": document.getElementById("Railings-list-1"),
        "Windows": document.getElementById("Windows-list-1"),
        "Doors": document.getElementById("Doors-list-1"),
    }
    
    function buttonClickEventHandler(cat) {
        console.log(getList);
        console.log(getList2);
        if (!buttonState[cat]) {
            getList[cat].classList.remove("hide");
            getButton[cat].textContent = "▴";

            getList2[cat].classList.remove("hide");
            getButton[cat].textContent = "▴";

            getList3[cat].classList.remove("hide");

            buttonState[cat] = true;
        } else {
            getList[cat].classList.add("hide");
            getButton[cat].textContent = "▾";

            getList2[cat].classList.add("hide");
            getButton[cat].textContent = "▾";

            getList3[cat].classList.add("hide");

            buttonState[cat] = false;
        }
    }

    Object.keys(getButton2).forEach(k => {
        getButton2[k].addEventListener("click", () => buttonClickEventHandler(k));
    });

    Object.keys(getButton).forEach(k => {
        getButton[k].addEventListener("click", () => buttonClickEventHandler(k));
    });
}