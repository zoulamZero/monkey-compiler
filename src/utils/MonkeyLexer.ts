// let x = y + 5;

// 遇到空格自动分词，
// let
// x
// =
// y
// +
// 5
// ; 表示终止

//                  人可读 = 机器易读		 大分类，详细信息，行号
// 1、let 			LET = 0					LET(0,"let",0)
// 2、x , y			IDENTIFIER = 1			IDENTIFIER(1,"x",0) IDENTIFIER(1,"y",0)
// 3、=				EQUAL_SIGN = 2			EQUAL_SIGN(2,"=",0)
// 4、+				PLUS_SINN = 3			PLUS_SINN(3,"+",0)
// 5、5				NUMBER = 4 				NUMBER(4,"5",0)
// 6、;				SEMICOLON = 5			SEMICOLON(5,";",0)

class Token {
    protected _tokenType: number;
    protected _literal: string;
    protected _linerNumber: number;
    /**
     *
     * @param tokenType token类型
     * @param literal  token实体数据
     * @param lineNumber 行号
     */
    constructor(tokenType: number, literal: string, lineNumber: number) {
        this._tokenType = tokenType;
        this._literal = literal;
        this._linerNumber = lineNumber;
    }

    get tokenType() {
        return this._tokenType;
    }

    get literal() {
        return this._literal;
    }

    get linerNumber() {
        return this._linerNumber;
    }
}

export class MonkeyLexer {
    sourceCode: string;
    position: number = 0;
    readPosition: number = 0;
    lineCount: number = 0;
    ch: string | 0 = ""; // char当前被读入的数据,0表示sourceCode被阅读完成，
    // initTokenType(){}
    ILLEGAL = -2; // 非法字符串
    EOF = -1; // 终结符，文本末尾
    LET = 0; //
    IDENTIFIER = 1; //
    EQUAL_SIGN = 2; //
    PLUS_SIGN = 3; //
    INTEGER = 4; //
    SEMICOLON = 5; //
    IF = 6;
    ELSE = 7;
    keyWordMap: { [key: string]: Token } = {};
    constructor(sourceCode: string) {
        this.sourceCode = sourceCode;
        this.initKeyWords();
    }

    initKeyWords() {
        this.keyWordMap["let"] = new Token(this.LET, "let", 0);
        this.keyWordMap["if"] = new Token(this.IF, "if", 0);
        this.keyWordMap["else"] = new Token(this.ELSE, "else", 0);
    }

    /**
     * 每次读入一个字符
     */
    readChar() {
        if (this.readPosition >= this.sourceCode.length) {
            this.ch = 0;
        } else {
            this.ch = this.sourceCode[this.readPosition];
        }
        this.position = this.readPosition;
        this.readPosition++;
    }

    skipWhiteSpaceAndNewLine() {
        while (
            this.ch === " " ||
            this.ch === "\t" ||
            this.ch === "\n" ||
            this.ch === "\u00a0"
        ) {
            if (this.ch === "\t" || this.ch === "\n") {
                this.lineCount++;
            }
            this.readChar();
        }
    }

    nextToken() {
        let tok;
        this.skipWhiteSpaceAndNewLine();
        const lineCount = this.lineCount;
        switch (this.ch) {
            case "=":
                tok = new Token(this.EQUAL_SIGN, "=", lineCount);
                break;
            case ";":
                tok = new Token(this.SEMICOLON, ";", lineCount);
                break;
            case "+":
                tok = new Token(this.PLUS_SIGN, "+", lineCount);
                break;
            case 0:
                tok = new Token(this.EOF, "", lineCount);
                break;
            default:
                let res = this.readIdentifier();
                // 判断是否为identifier
                if (res) {
                    // 判断是否为关键字
                    if (this.keyWordMap[res]) {
                        tok = this.keyWordMap[res];
                    } else {
                        tok = new Token(this.IDENTIFIER, res, lineCount);
                    }
                } else {
                    // 判断是否为数字
                    res = this.readNumber();
                    if (res) {
                        tok = new Token(this.INTEGER, res, lineCount);
                    }
                }
                // 既不是identifier也不是数字
                if (!res) {
                    tok = undefined;
                }
        }
        if (this.ch === ";") {
            console.log({ tok });
        }
        this.readChar();
        return tok;
    }

    /**
     *
     * @param ch
     * @returns
     * 判断是否为 a-z A-Z _ 的情况
     */
    isLetter(ch: string) {
        return (
            ("a" <= ch && ch <= "z") || ("A" <= ch && ch <= "Z") || ch === "_"
        );
    }

    readIdentifier(): string {
        let identifier = "";
        while (this.isLetter(this.ch as string)) {
            identifier += this.ch;
            this.readChar();
        }
        if (identifier.length > 0) {
            this.readPosition--;
            return identifier;
        } else {
            return "";
        }
    }

    isDigit(ch: string) {
        return "0" <= ch && ch <= "9";
    }

    readNumber(): string {
        let number = "";
        while (this.isDigit(this.ch as string)) {
            number += this.ch;
            this.readChar();
        }

        if (number.length > 0) {
            this.readPosition--;
            return number;
        } else {
            return "";
        }
    }

    lexing() {
        this.readChar();
        const tokens = [];
        let token = this.nextToken();
        while (token?.tokenType !== this.EOF) {
            tokens.push(token);
            token = this.nextToken();
        }
        console.log({ tokens });
    }
}
