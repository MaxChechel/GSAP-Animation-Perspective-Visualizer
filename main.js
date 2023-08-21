import SplitType from 'split-type';
import { gsap } from 'gsap/all';

import scriptPreview from './src/scriptPreview';

document.addEventListener('DOMContentLoaded', () => {
    const splittedText = new SplitType('.text-target', {
        types: 'lines, words, chars',
    });
    const textOriginal = document.querySelector('.text-target');
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
    const playBtn = document.querySelector('[data-animation-play]');
    const resetAllBtn = document.querySelector('[data-animation-reset-all]');
    const scriptPreviewEL = document.querySelector('[data-script-preview]');
    const cssPreviewEL = document.querySelector('[data-css-preview]');

    const perspectiveResetBtn = document.querySelector(
        '[animation-pespective-reset]'
    );
    const targetSelect = document.querySelector('#targetSelect');
    const directionSelect = document.querySelector('#directionSelect');
    const alignmentSelect = document.querySelector('#alignmentSelect');
    const transformOriginSelect = document.querySelector(
        '#transformOriginSelect'
    );

    const perspectiveRange = document.querySelector('#perspectiveRange');
    const staggerRange = document.querySelector('#staggerRange');

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
    scriptPreview(params, scriptPreviewEL);
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

    targetSelect.addEventListener('change', (e) => {
        if (e.target.value === 'lines') target = lines;
        if (e.target.value === 'words') target = words;
        if (e.target.value === 'chars') target = chars;
        perspectiveRange.value = 0;
        setRangeVal(perspectiveRange);
    });
    directionSelect.addEventListener('change', (e) => {
        if (e.target.value === 'from-bottom') params.y = '100%';
        if (e.target.value === 'from-top') params.y = '-100%';
        scriptPreview(params, scriptPreviewEL);
    });

    alignmentSelect.addEventListener('change', (e) => {
        if (e.target.value === 'left') {
            textOriginal.style.textAlign = 'left';
            textOriginal.parentElement.style.justifyContent = 'left';
            target.forEach((el) => {
                el.style.textAlign = 'left';
            });
        }
        if (e.target.value === 'center') {
            textOriginal.style.textAlign = 'center';
            textOriginal.parentElement.style.justifyContent = 'center';
            target.forEach((el) => {
                el.style.textAlign = 'center';
            });
        }
    });

    function setRangeVal(target) {
        target
            .closest('.range_inner-wrap')
            .querySelector('.range_value').textContent = target.value;
    }

    transformOriginSelect.addEventListener('change', () => {
        params.transformOrigin = transformOriginSelect.value;
        scriptPreview(params, scriptPreviewEL);
    });

    perspectiveRange.addEventListener('input', (e) => {
        setRangeVal(e.target);
        target.forEach((el) => {
            const parent = el.parentElement;
            parent.style.perspective = `${e.target.value}px`;
        });

        cssPreviewEL.innerHTML = `<pre>
<code class="language-css">
.direct-parent-of-target {
    perspective: ${e.target.value}px;
}
</code>
</pre>`;
    });

    // perspectiveResetBtn.addEventListener('click', () => {
    //     target.forEach((el) => {
    //         const parent = el.parentElement;
    //         parent.style.perspective = 'none';
    //     });
    // });
    staggerRange.addEventListener('input', (e) => {
        setRangeVal(e.target);
        params.stagger.each = `${e.target.value}`;
    });
    rotateXRange.addEventListener('input', (e) => {
        setRangeVal(e.target);
        params.rotationX = `${e.target.value}`;
        if (e.target.value === '0') delete params.rotationX;
    });
    rotateYRange.addEventListener('input', (e) => {
        setRangeVal(e.target);
        params.rotationY = `${e.target.value}`;
        if (e.target.value === '0') delete params.rotationY;
    });
    rotateZRange.addEventListener('input', (e) => {
        setRangeVal(e.target);
        params.rotationZ = `${e.target.value}`;
        if (e.target.value === '0') delete params.rotationZ;
    });

    resetAllBtn.addEventListener('click', () => {
        document.querySelectorAll("[type='range']").forEach((input) => {
            input.value = 0;
            setRangeVal(input);
        });
        document.querySelectorAll('select').forEach((input) => {
            input.selectedIndex = 0;
        });
        target = lines;
        params = {
            y: '100%',
            opacity: 0,
            stagger: { each: 0 },
            clearProps: 'transform,transform-origin',
            repeatRefresh: true,
        };
        scriptPreview(params, scriptPreviewEL);
        textOriginal.style.textAlign = 'left';
        textOriginal.parentElement.style.justifyContent = 'left';
        target.forEach((el) => {
            el.style.textAlign = 'left';
        });

        cssPreviewEL.innerHTML = '';
    });

    document.querySelectorAll("[type='range']").forEach((input) => {
        input.addEventListener('input', () => {
            scriptPreview(params, scriptPreviewEL);
        });
    });
});
