const getSelectors = (el, doc = document) => {
    if (!el || el.nodeType !== 1)
        return { defaultXPath: "", xpaths: [], css: [] };

    const tag = el.tagName.toLowerCase();

    let xpaths = [];
    let css = [];

    // ======================
    // 🔥 DEFAULT FULL XPATH
    // ======================
    function getFullXPath(node) {
        if (!node || node.nodeType !== 1) return "";

        if (node.tagName.toLowerCase() === "html") return "/html";

        let index = 1;
        let sibling = node;

        while ((sibling = sibling.previousElementSibling)) {
            if (sibling.tagName === node.tagName) index++;
        }

        return (
            getFullXPath(node.parentNode) +
            "/" +
            node.tagName.toLowerCase() +
            "[" +
            index +
            "]"
        );
    }

    const defaultXPath = getFullXPath(el);

    // ======================
    // 🔥 MULTIPLE XPATH
    // ======================

    if (el.id) {
        xpaths.push(`//*[@id="${el.id}"]`);
    }

    if (el.className) {
        const cls = el.className.split(" ")[0];
        if (cls) {
            xpaths.push(`//${tag}[contains(@class,"${cls}")]`);
        }
    }

    const text = el.textContent?.trim();
    if (text && text.length < 40) {
        xpaths.push(`//${tag}[contains(text(),"${text.slice(0, 20)}")]`);
    }

    for (let attr of el.attributes || []) {
        if (attr.name === "class" || attr.name === "style") continue;

        xpaths.push(`//${tag}[@${attr.name}="${attr.value}"]`);
    }

    if (el.parentElement?.className) {
        const cls = el.parentElement.className.split(" ")[0];
        if (cls) {
            xpaths.push(
                `//${el.parentElement.tagName.toLowerCase()}[contains(@class,"${cls}")]/${tag}`
            );
        }
    }

    // ======================
    // 🔥 CSS SELECTORS
    // ======================

    if (el.id) css.push(`#${el.id}`);

    if (el.className) {
        const cls = el.className.split(" ")[0];
        if (cls) {
            css.push(`.${cls}`);
            css.push(`${tag}.${cls}`);
        }
    }

    for (let attr of el.attributes || []) {
        if (attr.name === "class") continue;

        css.push(`${tag}[${attr.name}="${attr.value}"]`);
    }

    if (el.parentElement) {
        const parent = el.parentElement.tagName.toLowerCase();
        css.push(`${parent} > ${tag}`);
    }

    return {
        defaultXPath,
        xpaths,
        css,
    };
}

export default getSelectors;