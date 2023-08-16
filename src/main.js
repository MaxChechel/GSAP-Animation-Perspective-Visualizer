console.log('heeeey');
import SplitType from 'split-type';
import { gsap } from 'gsap/all';
const splittedText = new SplitType('.text-target', {
    types: 'lines, words, chars',
});
const lines = document.querySelectorAll('.text-target .line');
const words = document.querySelectorAll('.text-target .word');
const chars = document.querySelectorAll('.text-target .char');
const textElements = document.querySelectorAll(
    '.text-target .line, .text-target .word, .text-target .char'
);
//Wrap elements in overflow-hidden container
lines.forEach((line) => {
    const wrapEl = document.createElement('div');
    wrapEl.classList = 'overflow-hidden';
    line.parentNode.appendChild(wrapEl);
    wrapEl.appendChild(line);
});

//Control buttons
const playBtn = document.querySelector('[animation-play]');
const resetAllBtn = document.querySelector('[animation-reset-all]');
const btnsSplitText = document.querySelectorAll('[animation-split-text]');
const btnsDirection = document.querySelectorAll('[animation-direction]');
const perspectiveResetBtn = document.querySelector(
    '[animation-pespective-reset]'
);

const transformOriginSelect = document.querySelector('#transformOriginSelect');
const parentPerspectiveRange = document.querySelector('#perspectiveRange');
const rotateXRange = document.querySelector('#rotateXRange');
const rotateYRange = document.querySelector('#rotateYRange');
const rotateZRange = document.querySelector('#rotateZRange');

//Parameters variables
let target = lines;

let activeTimeline = null;

let params = {
    y: '110%',
    opacity: 0,
    stagger: { each: 0.1 },
    clearProps: 'transform,transform-origin',
    transformOrigin: 'left top',
    repeatRefresh: true,
};

//Clear inline styles
function clearInlineStyles(targets) {
    targets.forEach((target) => {
        const displayStyle = target.style.display;
        // Clear all inline styles except display
        target.style.cssText = `display: ${displayStyle};`;
    });
}

function createTimeline(target) {
    if (activeTimeline && activeTimeline.isActive()) {
        // Clear properties of the active timeline
        activeTimeline.clear();
        //Clear inline styles except display on all text elements
        clearInlineStyles(textElements);
    }

    if (activeTimeline) {
        activeTimeline.kill();
    }

    let tl = gsap.timeline({
        y: '110%',
        opacity: 0,
        stagger: { each: 0.1 },
        clearProps: 'transform,transform-origin',
        transformOrigin: 'left top',
        repeatRefresh: true,
    });
    activeTimeline = tl;
    tl.from(target, params);
    tl.restart();
    console.log(tl, params);
}

playBtn.addEventListener('click', () => {
    createTimeline(target);
});

btnsSplitText.forEach((btn) => {
    btn.addEventListener('click', () => {
        const attr = btn.getAttribute('animation-split-text');

        if (attr === 'lines') target = lines;
        if (attr === 'words') target = words;
        if (attr === 'chars') target = chars;

        // target.forEach((el) => {
        //   const parent = el.parentElement;
        //   parent.style.perspective = `${parentPerspectiveRange.value}px`;
        // });
    });
});

btnsDirection.forEach((btn) => {
    btn.addEventListener('click', () => {
        const attr = btn.getAttribute('animation-direction');

        if (attr === 'from-bottom') params.y = '100%';
        if (attr === 'from-top') params.y = '-100%';
    });
});

function setRangeVal(target) {
    target.parentElement.querySelector('.range-value').textContent =
        target.value;
}

transformOriginSelect.addEventListener('change', () => {
    params.transformOrigin = transformOriginSelect.value;
});

parentPerspectiveRange.addEventListener('input', (e) => {
    setRangeVal(e.target);
    target.forEach((el) => {
        const parent = el.parentElement;
        parent.style.perspective = `${e.target.value}px`;
        //parent.style.transformStyle = "preserve-3d";
    });
});

perspectiveResetBtn.addEventListener('click', () => {
    target.forEach((el) => {
        const parent = el.parentElement;
        parent.style.perspective = 'none';
    });
});

rotateXRange.addEventListener('input', (e) => {
    setRangeVal(e.target);
    params.rotationX = `${e.target.value}`;
});
rotateYRange.addEventListener('input', (e) => {
    setRangeVal(e.target);
    params.rotationY = `${e.target.value}`;
});
rotateZRange.addEventListener('input', (e) => {
    setRangeVal(e.target);
    params.rotationZ = `${e.target.value}`;
});

resetAllBtn.addEventListener('click', () => {
    document.querySelectorAll("[type='range']").forEach((input) => {
        input.value = 0;
        setRangeVal(input);
    });
    params = {
        y: '100%',
        stagger: { each: 0.1 },
        clearProps: 'transform,transform-origin',
        transformOrigin: 'left top',
        repeatRefresh: true,
    };
});
