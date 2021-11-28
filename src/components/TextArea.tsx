import * as React from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";

interface TextArea {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}
export function TextareaContainer({ value, setValue }: TextArea) {
    return (
        <TextareaAutosize
            maxRows={50}
            minRows={50}
            aria-label="maximum height"
            placeholder="write your code. example print 'hello world'"
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
            }}
            style={{
                width: "100%",
                fontSize: "20px",
                backgroundColor: "#1e1e1e",
                color: "white",
            }}
        />
    );
}
