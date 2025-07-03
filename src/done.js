import * as THREE from 'three';

export function DoneButtonClick(scene, renderer, box3, planes, inversePlanes, allGroup, latestElem, timeData, timeKeys) {
    const timeInfo0 = timeData[timeKeys[timeKeys.length-1]]["Quantity"];

    const infoTarget0 = document.getElementById();

    const meshDict2 = {};
    const allGruop2 = [];
    for (let i = 0; i < allGroup.length; i++) {
        const group = allGroup[i];
        const boxMesh = new THREE.Box3().setFromObject(group);

        if (box3.containsBox(boxMesh) || box3.intersectsBox(boxMesh)) {
            if (latestElem.value.includes(group)) {
                latestElem.value = latestElem.value.filter(item => item !== group);
            }

            const elementid = group.Id;
            const meshGroup = new THREE.Group;
            let checker = 0;
        }
    }
}