import './style.css';
import { SceneManager } from './scene/SceneManager';
import { ParameterEstimationVisualizer } from './visualizers/ParameterEstimationVisualizer';
import { ConfidenceIntervalVisualizer } from './visualizers/ConfidenceIntervalVisualizer';
import { UIController } from './ui/UIController';

class StatVerse3D {
  private sceneManager: SceneManager;
  private paramVisualizer: ParameterEstimationVisualizer;
  private ciVisualizer: ConfidenceIntervalVisualizer;
  private uiController: UIController;
  private currentMode: 'parameterEstimation' | 'confidenceInterval' = 'parameterEstimation';

  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
    if (!canvas) throw new Error('Canvas element not found');

    this.sceneManager = new SceneManager(canvas);
    this.paramVisualizer = new ParameterEstimationVisualizer();
    this.ciVisualizer = new ConfidenceIntervalVisualizer();
    
    this.sceneManager.addObject(this.paramVisualizer.getGroup());
    this.sceneManager.addObject(this.ciVisualizer.getGroup());
    
    this.ciVisualizer.getGroup().visible = false;
    
    this.uiController = new UIController(this.paramVisualizer, this.ciVisualizer);
    
    this.createLegend();
    this.setupEventListeners();
    this.startAnimation();
  }

  private createLegend(): void {
    const legend = document.createElement('div');
    legend.className = 'legend';
    legend.innerHTML = `
      <h3 style="margin-top: 0; margin-bottom: 10px; color: #3b82f6;">图例</h3>
      <div class="legend-item">
        <div class="legend-color" style="background: #00ff00;"></div>
        <span>样本均值 / 真实参数</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #ff9900;"></div>
        <span>置信区间边界</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #3b82f6;"></div>
        <span>包含真值的区间</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #ef4444;"></div>
        <span>不包含真值的区间</span>
      </div>
    `;
    document.getElementById('app')?.appendChild(legend);
  }

  private setupEventListeners(): void {
    const checkMode = () => {
      const config = this.uiController.getConfig();
      if (config.mode !== this.currentMode) {
        this.currentMode = config.mode;
        this.switchMode(this.currentMode);
      }
    };

    setInterval(checkMode, 100);
  }

  private switchMode(mode: 'parameterEstimation' | 'confidenceInterval'): void {
    if (mode === 'parameterEstimation') {
      this.paramVisualizer.getGroup().visible = true;
      this.ciVisualizer.getGroup().visible = false;
    } else {
      this.paramVisualizer.getGroup().visible = false;
      this.ciVisualizer.getGroup().visible = true;
    }
  }

  private startAnimation(): void {
    this.sceneManager.startAnimation(() => {
      // 可以在这里添加额外的动画逻辑
    });
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new StatVerse3D();
});