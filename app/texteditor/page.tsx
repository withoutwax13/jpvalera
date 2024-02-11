"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import GapBuffer from "@/utils/gapBuffer";

export default function TextEditorPage() {
  const [buffer, setBuffer] = useState(new GapBuffer());
  const [cursorIndex, setCursorIndex] = useState(0);
  const ignoreNextKeyPress = useRef(false);
  const isShiftDown = useRef(false);
  const selectionIndices = useRef<number[]>([]);

  console.log(selectionIndices.current);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
          if (!isShiftDown.current) {
            setCursorIndex((prevIndex) => prevIndex + 1);
          } else {
            selectionIndices.current.push(cursorIndex);
            setCursorIndex((prevIndex) => prevIndex + 1);
          }
          break;
        case "ArrowLeft":
          if (!isShiftDown.current) {
            setCursorIndex((prevIndex) =>
              prevIndex === 0 ? prevIndex : prevIndex - 1
            );
          }
          break;
        case "Backspace":
          if (cursorIndex > 0) {
            const newBuffer = new GapBuffer(buffer.text);
            newBuffer.moveCursor(cursorIndex);
            newBuffer.delete();
            setBuffer(newBuffer);
            setCursorIndex((prevIndex) => prevIndex - 1);
          }
          break;
        default:
          // ignore next key press if ctrl key is pressed
          if (event.ctrlKey) {
            ignoreNextKeyPress.current = true;
          }
          if (event.shiftKey) {
            isShiftDown.current = true;
          }
          if (event.key.length === 1) {
            if (!ignoreNextKeyPress.current) {
              buffer.moveCursor(cursorIndex);
              buffer.insert(event.key);
              const newBuffer = new GapBuffer(buffer.text);
              setCursorIndex((prevIndex) => prevIndex + 1);
              newBuffer.moveCursor(cursorIndex);
              setBuffer(newBuffer);
            }
            if (ignoreNextKeyPress.current) {
              ignoreNextKeyPress.current = false;
            }
          }
          break;
      }
    },
    [buffer, cursorIndex, ignoreNextKeyPress]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.shiftKey) {
        isShiftDown.current = false;
      }
    },
    [isShiftDown]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="page-container">
      {buffer.text.length === 0 && <span className="cursor" />}
      {buffer.text.length > 0 &&
        buffer.text.split("").map((char, index) => (
          <span
            key={index}
            onClick={() => {
              setCursorIndex(index);
            }}
          >
            {cursorIndex === index ? <span className="cursor" /> : ""}
            {char}
          </span>
        ))}
      {buffer.text.length !== 0 && buffer.text.length === cursorIndex && (
        <span className="cursor" />
      )}
    </div>
  );
}
