import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";
import { loadMeshes } from "./src/meshLoader.js";
import { initPartialClipping } from "./src/initPartial.js";
import { sliderControls } from "./src/slider.js";
import { DoneButtonClick } from "./src/done.js";
import { rightPanelButtonClick } from "./src/rightPanelButton.js";

import { updateSliderBackground } from './src/updateSlideColor.js';
import { exportButtonEventHandler } from "./src/exportButtonEventHandler.js";
        
export function main(
    shapeLog,
    timeLog
) {
    const container = document.getElementById("render-target");
    const scene = new THREE.Scene();

    scene.background = new THREE.Color("#F5F5DC");
    
    const lightConfigs = [
        [0, 3, 0],
        [0, 3, 5],
        [5, 3, 0],
        [-5, 3, 5],
        [5, 3, -5],
        [0, 3, -5],
        [-5, 3, 0],
    ];

    lightConfigs.forEach(pos => {
        const light = new THREE.DirectionalLight(0xffffff, 0.7);
        light.position.set(...pos);
        light.castShadow = true;
        light.shadow.bias = -0.0005;
        light.shadow.mapSize.width = 1024; // 그림자 품질 낮추면 퍼지게 보임
        light.shadow.mapSize.height = 1024;
        scene.add(light);
    });

    // 조명 설정2
    const ambientLight = new THREE.AmbientLight(0x000000); // 부드러운 전체광
    scene.add(ambientLight);

    // renderer 설정
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    container.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.01, 5000);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 1, 0);

    // Control 설정
    const controls = new MapControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;

    // window.addEventListener("resize", onWindowResize);
    const resizeObserver = new ResizeObserver(() => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // slider update
    const sliderPartially = document.getElementById("partially-slider");
    sliderPartially.addEventListener("input", () => updateSliderBackground(sliderPartially));
    
    // .d8888. d888888b .88b  d88. d8888b. db      d88888b      .d8888. d88888b d888888b d888888b d888888b d8b   db  d888b       d88888b d8b   db d8888b. .d8888. 
    // 88'  YP   `88'   88'YbdP`88 88  `8D 88      88'          88'  YP 88'     `~~88~~' `~~88~~'   `88'   888o  88 88' Y8b      88'     888o  88 88  `8D 88'  YP 
    // `8bo.      88    88  88  88 88oodD' 88      88ooooo      `8bo.   88ooooo    88       88       88    88V8o 88 88           88ooooo 88V8o 88 88   88 `8bo.   
    //   `Y8b.    88    88  88  88 88~~~   88      88~~~~~        `Y8b. 88~~~~~    88       88       88    88 V8o88 88  ooo      88~~~~~ 88 V8o88 88   88   `Y8b. 
    // db   8D   .88.   88  88  88 88      88booo. 88.          db   8D 88.        88       88      .88.   88  V888 88. ~8~      88.     88  V888 88  .8D db   8D 
    // `8888Y' Y888888P YP  YP  YP 88      Y88888P Y88888P      `8888Y' Y88888P    YP       YP    Y888888P VP   V8P  Y888P       Y88888P VP   V8P Y8888D' `8888Y' 

    const { allGroup, meshDict } = loadMeshes(shapeLog, scene, 0.2);
    const timeKeys = Object.keys(timeLog).sort();

    const { planes, cons, helpers, latestElem } = initPartialClipping(scene, meshDict, timeLog, timeKeys, allGroup, renderer, camera, controls);
    console.log(latestElem);
    let buttonState = {
        "Walls": false,
        "Curtain Walls": false,
        "Floors": false,
        "Ceilings": false,
        "Columns": false,
        "Structural Columns": false,
        "Stairs": false,
        "Railings": false,
        "Windows": false,
        "Doors": false,
    }

    sliderControls("partially-slider", timeKeys, timeLog, allGroup, meshDict, buttonState, false);
    updateSliderBackground(sliderPartially);

    const doneButton = document.getElementById("done-button");
    let uniqueData;
    let allGroup2;
    let meshDict2;
    let valiableElemId;

    doneButton.addEventListener('click', () => {
        updateSliderBackground(sliderPartially);

        let box3 = makeBoxFromPlanes(planes);

        cons.forEach(e => {
            e.visible = false;
        });
        helpers.forEach(e => {
            e.visible = false;
        });

        ({meshDict2, uniqueData, allGroup2, valiableElemId } = DoneButtonClick(box3, allGroup, latestElem, timeLog, timeKeys))
        const newTimeKeys = Object.keys(uniqueData);

        sliderControls("partially-slider", newTimeKeys, uniqueData, allGroup2, meshDict2, buttonState, true);
        rightPanelButtonClick(buttonState);
        
        const exportButton = document.getElementById("export-button");
        exportButton.addEventListener('click', () => {
            exportButtonEventHandler(valiableElemId);
        });

        doneButton.remove();
        const pb = document.getElementById("plane-button");
        pb.remove();
    });
    
    animate();

    function animate() {
        controls.update();
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    function makeBoxFromPlanes(planes) {
        let max = new THREE.Vector3();
        let min = new THREE.Vector3();

        planes.forEach(plane => {
            const normal = plane.normal;
            const constant = plane.constant;

            if (normal.x > 0.1) {
                max.x = -constant;
            } else if (normal.x < -0.1) {
                min.x = -constant;
            }
            
            if (normal.y > 0.1) {
                max.y = -constant;
            } else if (normal.y < -0.1) {
                min.y = -constant;
            }

            if (normal.z > 0.1) {
                max.z = -constant;
            } else if (normal.z < -0.1) {
                min.z = -constant;
            }
        });

        min.x = -min.x;
        min.y = -min.y;
        min.z = -min.z;
        const box0 = new THREE.Box3(min, max);
        
        return box0;
    }
}