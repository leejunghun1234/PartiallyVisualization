export function updateSliderBackground(slider) {
    const min = slider.min || 0;
    const max = slider.max || 100;
    const val = (slider.value - min) / (max - min) * 100;
    slider.style.background = `linear-gradient(to right, #263238 0%, #45a049 ${val}%, #ddd ${val}%, #ddd 100%)`;
}