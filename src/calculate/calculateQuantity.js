export function calculateQuantity(timeInfo, lm) {
    const common = lm.userData.Common;
    const elemCat = common.ElementCategory;
    const layers = lm.userData.Layers;
    if (elemCat === "Walls") {
        const wallInfo = timeInfo[elemCat];
        for (const l of layers) {
            const materialName = l["Material Name"];
            const materialVolume = l["Material Volume"];
            wallInfo["All Volume"] += materialVolume;
            wallInfo[materialName] += materialVolume;
        }
    } else if (elemCat === "Curtain Walls") {
        const ctWallInfo = timeInfo[elemCat];
        ctWallInfo["All Numbers"] += 1;
    } else if (elemCat === "Floors") {
        const floorInfo = timeInfo[elemCat];
        floorInfo["All Numbers"] += 1;
        for (const l of layers) {
            const materialName = l["Material Name"];
            const materialVolume = l["Material Volume"];
            floorInfo["All Volume"] += materialVolume;
            if (materialName in floorInfo) {
                floorInfo[materialName] += materialVolume;
            } else {
                floorInfo[materialName] = materialVolume;
            }
        }
    } else if (elemCat === "Ceilings") {
        const ceilingInfo = timeInfo[elemCat];
        ceilingInfo["All Numbers"] += 1;
        for (const l of layers) {
            const materialName = l["Material Name"];
            const materialVolume = l["Material Volume"];
            ceilingInfo["All Volume"] += materialVolume;
            if (materialName in ceilingInfo) {
                ceilingInfo[materialName] += materialVolume;
            } else {
                ceilingInfo[materialName] = materialVolume;
            }
        }
    } else if (elemCat == "Columns") {
        const columnInfo = timeInfo[elemCat];
        columnInfo["All Numbers"] += 1;
        columnInfo["Column Length"] += layers["Column Length"];
        columnInfo["Column Volume"] += layers["Column Volume"];
        
    } else if (elemCat == "Structural Columns") {
        const columnInfo = timeInfo[elemCat];
        const materialName = layers["Column Material"];
        const columnLength = layers["Column Length"];
        columnInfo["All Length"] +=  columnLength;
        columnInfo["All Numbers"] += 1;
        if (materialName in columnInfo) {
            columnInfo[materialName] += columnLength;
        } else {
            columnInfo[materialName] = columnLength;
        }
    } else if (elemCat == "Stairs") {
        const stairInfo = timeInfo[elemCat];
        const stairLength = layers["Stair Length"];
        const stairRunLength = layers["Stair Run Length"];
        const stairLandingLength = layers["Stair Landing Length"];
        stairInfo["All Numbers"] += 1;
        stairInfo["Stair Length"] += stairLength;
        stairInfo["Stair Run Length"] += stairRunLength;
        stairInfo["Stair Landing Length"] += stairLandingLength;
    } else if (elemCat == "Railings") {
        const railingInfo = timeInfo[elemCat];
        const railingLength = layers["Railing Length"];
        railingInfo["All Numbers"] += 1;
        railingInfo["Railing Length"] += railingLength;
    } else if (elemCat == "Windows" || elemCat == "Doors") {
        const windowInfo = timeInfo[elemCat];
        const familyName = common.ElementFamily + common.ElementType;
        windowInfo["All Numbers"] += 1;
        windowInfo[familyName] += 1;
    }
}