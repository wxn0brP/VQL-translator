import { SQL_TO_VQL, SV_Ref } from "#index";
import { convert_VQLR_to_VQLS } from "#VQLR_to_VQLS";

const sqlInput = document.querySelector<HTMLTextAreaElement>("#sql-input");
const dbNameInput = document.querySelector<HTMLInputElement>("#db-name");
const translateBtn = document.querySelector<HTMLButtonElement>("#translate-btn");
const vqlObjectOutput = document.querySelector<HTMLPreElement>("#vql-object");
const vqlStringOutput = document.querySelector<HTMLPreElement>("#vql-string");
const copyVqlBtn = document.querySelector<HTMLButtonElement>("#copy-vql");
const copyStringBtn = document.querySelector<HTMLButtonElement>("#copy-string");
const outputCard = document.querySelector<HTMLDivElement>("#output-card");

let _vqlObject: string = "";
let _vqlString: string = "";

const tabLinks = document.querySelectorAll<HTMLButtonElement>(".tab-link");
const tabPanes = document.querySelectorAll<HTMLDivElement>(".tab-pane");

tabLinks.forEach(link => {
    link.addEventListener("click", () => {
        tabLinks.forEach(l => l.classList.remove("active"));
        tabPanes.forEach(p => p.classList.remove("active"));

        link.classList.add("active");
        const targetTab = document.querySelector(`#${link.dataset.tab}`);
        if (targetTab)
            targetTab.classList.add("active");
    });
});

function translate() {
    const sql = sqlInput.value.trim();
    const dbName = dbNameInput.value.trim() || "db1";

    if (!sql) {
        vqlObjectOutput.textContent = "Please enter a SQL query.";
        vqlStringOutput.textContent = "";
        outputCard.classList.add("hidden");
        return;
    }

    try {
        const ref: SV_Ref = {};
        const vqlObject = SQL_TO_VQL(sql, dbName, false, ref) as any;
        console.log(ref);
        console.log(vqlObject);

        _vqlObject = JSON.stringify(vqlObject, null, 2);
        vqlObjectOutput.textContent = _vqlObject;

        const vqlString = convert_VQLR_to_VQLS(vqlObject);
        _vqlString = vqlString;
        vqlStringOutput.textContent = _vqlString;
        console.log(vqlString);
        console.log("----");

        outputCard.classList.remove("hidden");
    } catch (error) {
        console.error("Translation error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        _vqlObject = `Error: ${errorMessage}`;
        _vqlString = `Error: ${errorMessage}`;
        vqlObjectOutput.textContent = _vqlObject;
        vqlStringOutput.textContent = _vqlString;
        outputCard.classList.remove("hidden");
    }
}

translateBtn.addEventListener("click", translate);

function enter(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        translateBtn.click();
    }
}

sqlInput.addEventListener("keydown", enter);
dbNameInput.addEventListener("keydown", enter);

let tooltipTimeout: any;
function showCopyFeedback(button: HTMLButtonElement) {
    const resultBox = button.closest(".result-box");
    if (!resultBox) return;

    const tooltip = resultBox.querySelector<HTMLDivElement>(".copy-tooltip");
    if (!tooltip) return;

    clearTimeout(tooltipTimeout);
    tooltip.classList.add("visible");
    tooltipTimeout = setTimeout(() => {
        tooltip.classList.remove("visible");
    }, 1500);
}

copyVqlBtn.addEventListener("click", () => {
    if (!_vqlObject) return;
    navigator.clipboard.writeText(_vqlObject);
    showCopyFeedback(copyVqlBtn);

});

copyStringBtn.addEventListener("click", () => {
    if (!_vqlString) return;
    navigator.clipboard.writeText(_vqlString);
    showCopyFeedback(copyStringBtn);
});

translate();