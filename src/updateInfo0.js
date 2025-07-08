export function updatesInfos0(infoTarget0, timeInfo0) {
    const quantity = Object.keys(timeInfo0);
    infoTarget0.innerHTML = ""; 
    for (const cat of quantity) {
        const catReplace = cat.replace(" ", "-");

        const quantityCat = Object.keys(timeInfo0[cat]);
        let categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category-container");

        let catNameDiv = document.createElement("div");
        catNameDiv.classList.add("category-name-container");
        catNameDiv.innerHTML = `<div id = "category-title" class="category-title">${cat}</div>`;
        categoryDiv.appendChild(catNameDiv);

        let list = document.createElement("ul");
        list.classList.add("category-list");
        list.classList.add("hide");
        list.id = `${catReplace}-list-1`;

        let importantInfo = document.createElement("div");
        for (const quantityCatQuan of quantityCat) {
            let value = timeInfo0[cat][quantityCatQuan];
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
            } else if (["Windows", "Doors"].includes(cat)){
                let listItem = document.createElement("li");
                listItem.innerHTML = `<span class="key123">${quantityCatQuan}: </span> <span id = "value123" class = "value123">${(timeInfo0[cat][quantityCatQuan])} </span> `;
                list.appendChild(listItem);
            } else {
                let listItem = document.createElement("li");
                listItem.innerHTML = `<span class="key123">${quantityCatQuan}: </span> <span id = "value123" class = "value123">${(timeInfo0[cat][quantityCatQuan]).toFixed(3)} </span> `;
                list.appendChild(listItem);
            }
        }
        categoryDiv.appendChild(importantInfo);
        categoryDiv.appendChild(list);
        infoTarget0.appendChild(categoryDiv);
    }
}