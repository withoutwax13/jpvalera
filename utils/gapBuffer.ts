class GapBuffer {

  gapStart: number;
  gapEnd: number;
  buffer: string[];

  constructor(initialText = "", gapSize = 10) {
    this.buffer = new Array(initialText.length + gapSize);
    this.gapStart = 0;
    this.gapEnd = gapSize;

    for (let i = 0; i < initialText.length; i++) {
      this.buffer[this.gapEnd + i] = initialText[i];
    }
  }

  insert(char: string) {
    if (this.gapStart === this.gapEnd) {
      const oldBuffer = this.buffer;
      this.buffer = new Array(oldBuffer.length * 2); // double the size of the buffer
      for (let i = 0; i < this.gapStart; i++) {
        this.buffer[i] = oldBuffer[i]; // copy characters before the gap
      }
      for (let i = this.gapEnd; i < oldBuffer.length; i++) {
        this.buffer[i + oldBuffer.length] = oldBuffer[i]; // copy characters after the gap
      }
      this.gapEnd += oldBuffer.length; // adjust the end of the gap
    }

    this.buffer[this.gapStart] = char;
    this.gapStart++;
  }

  delete() {
    if (this.gapStart > 0) {
      this.gapStart--;
    }
  }

  moveCursor(position: number) {
    while (this.gapStart > position) {
      this.gapEnd--;
      this.buffer[this.gapEnd] = this.buffer[this.gapStart - 1];
      this.gapStart--;
    }

    while (this.gapStart < position) {
      this.buffer[this.gapStart] = this.buffer[this.gapEnd];
      this.gapStart++;
      this.gapEnd++;
    }
  }

  get text() {
    return this.buffer.slice(0, this.gapStart).concat(this.buffer.slice(this.gapEnd)).join('');
  }
}


export default GapBuffer;