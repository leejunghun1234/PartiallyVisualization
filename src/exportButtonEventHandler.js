export function exportButtonEventHandler(valiableElemId) {
    if (valiableElemId) {
        const forPatching = new Set();
        valiableElemId.forEach((eid) => {
            forPatching.add(eid.split("_")[0]);
        });
        const elemIds = Array.from(forPatching);

        const display = document.getElementById("time-button");
        const patchFinal = {};
        patchFinal['Time'] = display.textContent;
        patchFinal['Elements'] = elemIds;

        saveJsonToLocal(patchFinal, "patch.json");
    }
}

function saveJsonToLocal(data, fileName) {
    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}