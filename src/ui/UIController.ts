import * as dat from 'dat.gui';
import { ParameterEstimationVisualizer } from '../visualizers/ParameterEstimationVisualizer';
import { ConfidenceIntervalVisualizer } from '../visualizers/ConfidenceIntervalVisualizer';

export interface ControlsConfig {
  mode: 'parameterEstimation' | 'confidenceInterval';
  trueMean: number;
  trueStdDev: number;
  sampleSize: number;
  confidenceLevel: number;
  numSimulations: number;
  showDistribution: boolean;
  animationSpeed: number;
}

export class UIController {
  private gui: dat.GUI;
  private config: ControlsConfig;
  private paramVisualizer: ParameterEstimationVisualizer;
  private ciVisualizer: ConfidenceIntervalVisualizer;
  private statsDisplay!: HTMLElement;

  constructor(
    paramVisualizer: ParameterEstimationVisualizer,
    ciVisualizer: ConfidenceIntervalVisualizer
  ) {
    this.paramVisualizer = paramVisualizer;
    this.ciVisualizer = ciVisualizer;

    this.config = {
      mode: 'parameterEstimation',
      trueMean: 0,
      trueStdDev: 1,
      sampleSize: 100,
      confidenceLevel: 0.95,
      numSimulations: 50,
      showDistribution: true,
      animationSpeed: 1
    };

    this.gui = new dat.GUI({ autoPlace: false });
    const controlsElement = document.getElementById('controls');
    if (controlsElement) {
      controlsElement.appendChild(this.gui.domElement);
    }

    this.createStatsDisplay();
    this.setupControls();
  }

  private createStatsDisplay(): void {
    this.statsDisplay = document.createElement('div');
    this.statsDisplay.className = 'stats-display';
    this.statsDisplay.innerHTML = '<h3>统计信息</h3><div id="stats-content"></div>';
    
    const controlsElement = document.getElementById('controls');
    if (controlsElement) {
      controlsElement.appendChild(this.statsDisplay);
    }
  }

  private setupControls(): void {
    const modeFolder = this.gui.addFolder('模式选择');
    modeFolder.add(this.config, 'mode', {
      '参数估计': 'parameterEstimation',
      '置信区间': 'confidenceInterval'
    }).name('可视化模式').onChange(() => this.handleModeChange());
    modeFolder.open();

    const paramFolder = this.gui.addFolder('总体参数');
    paramFolder.add(this.config, 'trueMean', -3, 3, 0.1).name('总体均值 (μ)');
    paramFolder.add(this.config, 'trueStdDev', 0.1, 3, 0.1).name('总体标准差 (σ)');
    paramFolder.open();

    const sampleFolder = this.gui.addFolder('抽样设置');
    sampleFolder.add(this.config, 'sampleSize', 10, 500, 10).name('样本大小');
    sampleFolder.add(this.config, 'confidenceLevel', {
      '90%': 0.90,
      '95%': 0.95,
      '99%': 0.99
    }).name('置信水平');
    sampleFolder.open();

    const visualFolder = this.gui.addFolder('可视化选项');
    visualFolder.add(this.config, 'showDistribution').name('显示分布曲线');
    visualFolder.add(this.config, 'animationSpeed', 0.1, 2, 0.1).name('动画速度');
    visualFolder.add(this.config, 'numSimulations', 10, 200, 10).name('模拟次数');

    const actions = {
      generate: () => this.generateVisualization(),
      animate: () => this.animateVisualization(),
      clear: () => this.clearVisualization()
    };

    this.gui.add(actions, 'generate').name('生成样本');
    this.gui.add(actions, 'animate').name('开始动画');
    this.gui.add(actions, 'clear').name('清除');
  }

  private handleModeChange(): void {
    this.clearVisualization();
    this.updateStatsDisplay();
  }

  private generateVisualization(): void {
    if (this.config.mode === 'parameterEstimation') {
      const params = {
        mean: this.config.trueMean,
        stdDev: this.config.trueStdDev,
        size: this.config.sampleSize
      };
      
      this.paramVisualizer.generateSamples(params);
      
      if (this.config.showDistribution) {
        this.paramVisualizer.visualizeDistribution(
          this.config.trueMean,
          this.config.trueStdDev
        );
      }
    } else {
      this.ciVisualizer.setTrueParameters(
        this.config.trueMean,
        this.config.trueStdDev
      );
      this.ciVisualizer.setConfidenceLevel(this.config.confidenceLevel);
      this.ciVisualizer.simulateConfidenceIntervals(
        this.config.numSimulations,
        this.config.sampleSize
      );
    }

    this.updateStatsDisplay();
  }

  private animateVisualization(): void {
    if (this.config.mode === 'parameterEstimation') {
      const params = {
        mean: this.config.trueMean,
        stdDev: this.config.trueStdDev,
        size: this.config.sampleSize
      };
      
      this.paramVisualizer.animateSampling(params, () => {
        if (this.config.showDistribution) {
          this.paramVisualizer.visualizeDistribution(
            this.config.trueMean,
            this.config.trueStdDev
          );
        }
        this.updateStatsDisplay();
      });
    } else {
      this.ciVisualizer.animateCoverageVisualization();
    }
  }

  private clearVisualization(): void {
    this.paramVisualizer.clear();
    this.ciVisualizer.clear();
    this.updateStatsDisplay();
  }

  private updateStatsDisplay(): void {
    const content = document.getElementById('stats-content');
    if (!content) return;

    if (this.config.mode === 'parameterEstimation') {
      const stats = this.paramVisualizer.getStatistics();
      if (stats) {
        content.innerHTML = `
          <div class="stat-item">
            <span class="label">样本均值:</span>
            <span class="value">${stats.mean.toFixed(4)}</span>
          </div>
          <div class="stat-item">
            <span class="label">样本标准差:</span>
            <span class="value">${stats.stdDev.toFixed(4)}</span>
          </div>
          <div class="stat-item">
            <span class="label">95% 置信区间:</span>
            <span class="value">[${stats.ci.lower.toFixed(3)}, ${stats.ci.upper.toFixed(3)}]</span>
          </div>
          <div class="stat-item">
            <span class="label">真实均值:</span>
            <span class="value">${this.config.trueMean.toFixed(4)}</span>
          </div>
          <div class="stat-item">
            <span class="label">估计误差:</span>
            <span class="value">${Math.abs(stats.mean - this.config.trueMean).toFixed(4)}</span>
          </div>
        `;
      } else {
        content.innerHTML = '<p style="color: #888;">暂无数据</p>';
      }
    } else {
      const coverage = this.ciVisualizer.getCoverageStats();
      content.innerHTML = `
        <div class="stat-item">
          <span class="label">总模拟次数:</span>
          <span class="value">${coverage.total}</span>
        </div>
        <div class="stat-item">
          <span class="label">包含真值的区间:</span>
          <span class="value">${coverage.covered}</span>
        </div>
        <div class="stat-item">
          <span class="label">实际覆盖率:</span>
          <span class="value">${coverage.percentage.toFixed(1)}%</span>
        </div>
        <div class="stat-item">
          <span class="label">理论覆盖率:</span>
          <span class="value">${(this.config.confidenceLevel * 100).toFixed(0)}%</span>
        </div>
        <div class="stat-item">
          <span class="label">覆盖率误差:</span>
          <span class="value">${Math.abs(coverage.percentage - this.config.confidenceLevel * 100).toFixed(1)}%</span>
        </div>
      `;
    }
  }

  public getConfig(): ControlsConfig {
    return this.config;
  }
}