// script.js

document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelector("#textarea");
    const copybtn = document.querySelector(".button.copy");
    const tooltip = document.querySelector(".tooltip");

    const tooltipTexts = {
        "30": "Dark Gray",
        "31": "Bright Red",
        "32": "Bright Green",
        "33": "Golden Yellow",
        "34": "Sky Blue",
        "35": "Vivid Purple",
        "36": "Teal",
        "37": "White",
    };

    // Sanitize pasted content
    textarea.oninput = () => {
        const base = textarea.innerHTML.replace(/<(\/?(br|span|span class="ansi-[0-9]*"))>/g, "[$1]");
        if (base.includes("<") || base.includes(">")) {
            textarea.innerHTML = base.replace(/<.*?>/g, "").replace(/[<>]/g, "").replace(/\[(\/?(br|span|span class="ansi-[0-9]*"))\]/g, "<$1>");
        }
    };

    // Handle Enter key for new lines
    document.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            document.execCommand('insertLineBreak');
            event.preventDefault();
        }
    });

    // Handle style button clicks
    document.querySelectorAll(".style-button").forEach((btn) => {
        btn.onclick = () => {
            if (!btn.dataset.ansi) {
                textarea.innerText = textarea.innerText;
                return;
            }

            const selection = window.getSelection();
            const text = window.getSelection().toString();

            const span = document.createElement("span");
            span.innerText = text;
            span.classList.add(`ansi-${btn.dataset.ansi}`);

            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(span);

            range.selectNodeContents(span);
            selection.removeAllRanges();
            selection.addRange(range);
        };
        btn.onmouseenter = () => {
            const ansiCode = btn.dataset.ansi;
            if (!(ansiCode >= 30 && ansiCode <= 37)) return;

            const rect = btn.getBoundingClientRect();
            tooltip.style.display = "block";
            tooltip.innerText = tooltipTexts[ansiCode];
            tooltip.style.top = `${rect.top - 36}px`;
            tooltip.style.left = `${rect.left - tooltip.clientWidth / 2 + btn.clientWidth / 2}px`;
        };
        btn.onmouseleave = () => {
            tooltip.style.display = "none";
        };
    });

    // Convert nodes to ANSI codes
    function nodesToANSI(nodes, states) {
        let text = "";
        for (const node of nodes) {
            if (node.nodeType === 3) {
                text += node.textContent;
                continue;
            }
            if (node.nodeName === "BR") {
                text += "\n";
                continue;
            }
            const ansiCode = +(node.className.split("-")[1]);
            const newState = Object.assign({}, states.at(-1));

            if (ansiCode < 30) newState.st = ansiCode; // Style codes (bold, underline)
            if (ansiCode >= 30 && ansiCode <= 37) newState.fg = ansiCode; // Foreground colors

            states.push(newState);
            text += `\x1b[${newState.st};${newState.fg}m`;
            text += nodesToANSI(node.childNodes, states);
            states.pop();
            text += `\x1b[0m`;
            if (states.at(-1).fg !== 2) text += `\x1b[${states.at(-1).st};${states.at(-1).fg}m`;
        }
        return text;
    }

    // Handle copy button click
    copybtn.onclick = () => {
        const toCopy = "```ansi\n" + nodesToANSI(textarea.childNodes, [{ fg: 2, st: 2 }]) + "\n```";
        navigator.clipboard.writeText(toCopy).then(() => {
            alert("Text copied to clipboard!");
        }, (err) => {
            alert("Copying failed. Here's the text for you to copy manually:");
            alert(toCopy);
        });
    };
});
