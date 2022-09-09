import { makeAutoObservable } from 'mobx';
import Tool from '../tools/Tool';

class ToolState {
  private tool: Tool | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setTool(tool: Tool) {
    this.tool = tool;
  }

  setFillColor(color: string) {
    if (this.tool) {
      this.tool.fillColor = color;
    }
  }

  setStrokeColor(color: string) {
    if (this.tool) {
      this.tool.strokeColor = color;
    }
  }

  setLineWidth(width: number) {
    if (this.tool) {
      this.tool.lineWidth = width;
    }
  }

  get strokeColor() {
    return this.tool?.strokeColor;
  }
}

export default new ToolState();
