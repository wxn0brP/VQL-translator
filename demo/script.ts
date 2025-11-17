import { convert_VQLR_to_VQLS, s2v } from "#s2v";

const sqlInput = document.querySelector<HTMLTextAreaElement>("#sql-input");
const dbNameInput = document.querySelector<HTMLInputElement>("#db-name");
const translateBtn = document.querySelector<HTMLButtonElement>("#translate-btn");
const vqlObjectOutput = document.querySelector<HTMLPreElement>("#vql-object");
const vqlStringOutput = document.querySelector<HTMLPreElement>("#vql-string");

let _vqlObject: string = "";
let _vqlString: string = "";

translateBtn.addEventListener("click", () => {
    const sql = sqlInput.value.trim();
    const dbName = dbNameInput.value.trim() || "db1";

    if (!sql) {
        alert("Please enter a SQL query");
        return;
    }

    try {
        const vqlObject = s2v(sql, dbName, false) as any;
        vqlObjectOutput.textContent = _vqlObject = JSON.stringify(vqlObject, null, 2);

        const vqlString = convert_VQLR_to_VQLS(vqlObject);
        vqlStringOutput.textContent = _vqlString = vqlString;
    } catch (error) {
        console.error("Translation error:", error);
        vqlObjectOutput.textContent = `Error: ${error.message}`;
        vqlStringOutput.textContent = `Error: ${error.message}`;
    }
});

function enter(e: KeyboardEvent) {
    if (e.key === "Enter") {
        translateBtn.click();
    }
}

sqlInput.addEventListener("keydown", enter);
dbNameInput.addEventListener("keydown", enter);

document.querySelector("#copy-vql").addEventListener("click", () => {
    navigator.clipboard.writeText(_vqlObject);
    alert("VQL object copied to clipboard");
});

document.querySelector("#copy-string").addEventListener("click", () => {
    navigator.clipboard.writeText(_vqlString);
    alert("VQL string copied to clipboard");
});