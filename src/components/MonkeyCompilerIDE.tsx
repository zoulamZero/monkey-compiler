interface MonkeyCompilerIDEProps {
    keyWords: string;
}
export function MonkeyCompilerIDE({ keyWords }: MonkeyCompilerIDEProps) {
    return (
        <div
            style={{ height: "90vh", border: "1px solid black" }}
            contentEditable
        ></div>
    );
}
