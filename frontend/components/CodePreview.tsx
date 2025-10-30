"use client";

import { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("jsx", jsx);
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";

interface CodePreviewProps {
    title?: string;
    language?: string;
    code: string;
}

export default function CodePreview({
    title = "Example",
    language = "bash",
    code,
}: CodePreviewProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Card className="w-full bg-white text-slate-800 rounded-xl overflow-hidden shadow-md border border-slate-200 gap-0 py-0">
            <CardHeader className="flex flex-row justify-between items-center px-4 h-[45px] py-5 bg-slate-100 border-b text-13 border-slate-200">
                <span className="text-13 font-medium">{title}</span>
                <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-600 hover:text-black"
                    onClick={handleCopy}
                >
                    {copied ? (
                        <div className="text-13 flex gap-1">
                            <Check className="w-3 h-3" /> Copied
                        </div>
                    ) : (
                        <div className="text-13 flex gap-1">
                            <Copy className="w-3 h-3" /> Copy
                        </div>
                    )}
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <SyntaxHighlighter
                    language={language}
                    style={oneLight}
                    customStyle={{
                        margin: 0,
                        padding: "1rem",
                        fontSize: "0.9rem",
                    }}
                >
                    {code.trim()}
                </SyntaxHighlighter>
            </CardContent>
        </Card>
    );
}
