import * as THREE from 'three';
import { updatesInfos0 } from './updateInfo0.js';
import { calculateQuantity } from './calculate/calculateQuantity.js';
import { compareQuantity } from './calculate/compareQuantity.js';

export function DoneButtonClick(box3, allGroup, latestElem, timeData, timeKeys) {
    const timeInfo0 = timeData[timeKeys[timeKeys.length-1]]["Quantity"];

    const infoTarget0 = document.getElementById("before-target");
    updatesInfos0(infoTarget0, timeInfo0);
    console.log(infoTarget0);

    const meshDict2 = {};
    const allGroup2 = [];
    for (let i = 0; i < allGroup.length; i++) {
        const group = allGroup[i];
        const boxMesh = new THREE.Box3().setFromObject(group);

        if (box3.containsBox(boxMesh) || box3.intersectsBox(boxMesh)) {
            if (latestElem.includes(group)) {
                latestElem = latestElem.filter(item => item !== group);
            }

            const elementid = group.Id;
            const meshGroup = new THREE.Group;
            let checker = 0;
            for (let j = 0; j < group.children.length; j++) {
                const object = group.children[j];
                if (object.isMesh) {
                    checker = 1;
                    
                    meshGroup.add(object);
                }
            }
            if (checker === 1) {
                meshDict2[elementid] = meshGroup;
                allGroup2.push(meshGroup);
            }
            meshGroup.userData = group.userData;
        }
    }

    const timeInfo = {
        "Walls": {},
        "Curtain Walls": {},
        "Floors": {},
        "Ceilings": {},
        "Columns": {},
        "Structural Columns": {},
        "Stairs": {},
        "Railings": {},
        "Windows": {},
        "Doors": {}
    };

    Object.keys(timeInfo).forEach(category => {
        if (timeInfo0[category]) {
            Object.keys(timeInfo0[category]).forEach(k => {
                timeInfo[category][k] = 0;
            });
        }
    });
    

    for (const lm of latestElem) {
        calculateQuantity(timeInfo, lm);
    }

    const valiableElemId = Object.keys(meshDict2);
    const finalTimeDict = {};
    let checker2 = 0;
    timeKeys.forEach(k => {
        console.log(k);
        const tData = timeData[k]["Elements"];
        const timeInfoCopy = structuredClone(timeInfo);
        if (checker2 === 0) {
            const compare = {
                "Walls": {},
                "Curtain Walls": {},
                "Floors": {},
                "Ceilings": {},
                "Columns": {},
                "Structural Columns": {},
                "Stairs": {},
                "Railings": {},
                "Windows": {},
                "Doors": {},
            };
            Object.keys(timeInfoCopy).forEach(category => {
                Object.keys(timeInfo0[category]).forEach(k => {
                    compare[category][k] = -timeInfo0[category][k] + timeInfo[category][k];
                });
            });
            finalTimeDict[k] = {
                "Elements": tData,
                "Quantity": structuredClone(timeInfo),
                "Compare": compare,
            };
            checker2 = 1;
        } else {
            const timeElem = [];
            for (let i = 0; i < tData.length; i++) {
                const td = tData[i];
                if (valiableElemId.includes(td)) {
                    timeElem.push(td);
                    calculateQuantity(timeInfoCopy, meshDict2[td]);
                }
            }
            const compare = compareQuantity(timeInfo0, timeInfoCopy);
            finalTimeDict[k] = {
                "Elements": timeElem,
                "Quantity": timeInfoCopy,
                "Compare": compare,
            };
        }
    });

    console.log(finalTimeDict);

    const uniqueData = {};
    let seenValues = undefined;
    Object.entries(finalTimeDict).forEach((key, value) => {
        const key1 = key[0];
        const value1 = key[1];

        const serializedValue = JSON.stringify(value1);

        if (seenValues === undefined) {
            uniqueData[key1] = value1;
        } else {
            if (seenValues !== serializedValue) {
                uniqueData[key1] = value1;
            } else {

            }
            seenValues = serializedValue;
        }
    });

    console.log(uniqueData);

    // meshDict2: elementId 를 key값으로, Group을 value로 가지는 Dictionary
    // uniqueData: Time log를 원하는 element 만 가지고 할 수 있는거 -> 중복 제거거
    // allMeshes2: 새로만든 Group을 가지는 배열
    // valiableElemId: 모든 ElementId -> string
    return { meshDict2, uniqueData, allGroup2, valiableElemId };
}
