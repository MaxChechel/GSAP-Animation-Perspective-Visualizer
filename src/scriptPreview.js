export default function scriptPreview(paramsObj, previewEl) {
    previewEl.innerHTML = `<pre>
<code class="language-javascript">
tl.from(target, {
y: ${paramsObj.y},
opacity: 0,
stagger: { each: ${paramsObj.stagger.each} },
${
    typeof paramsObj.transformOrigin !== 'undefined'
        ? `transform-origin: ${paramsObj.transformOrigin},`
        : ''
},
${
    typeof paramsObj.rotationX !== 'undefined'
        ? `rotationX: ${paramsObj.rotationX},`
        : ''
}
${
    typeof paramsObj.rotationY !== 'undefined'
        ? `rotationY: ${paramsObj.rotationY},`
        : ''
}
${
    typeof paramsObj.rotationZ !== 'undefined'
        ? `rotationZ: ${paramsObj.rotationZ},`
        : ''
}
});
</code>
</pre>`;
    //Remove empty lines from a preview
    const codeBlock = document.querySelector('.language-javascript');
    const codeLines = codeBlock.innerHTML
        .split('\n')
        .filter((line) => line.trim() !== '');
    codeBlock.innerHTML = codeLines.join('\n');
}
