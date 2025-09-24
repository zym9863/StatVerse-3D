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
  private configListeners: Array<(config: ControlsConfig) => void> = [];
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

  /**
   * 构建统计信息展示区域，挂载到控制面板容器。
   */
  private createStatsDisplay(): void {
    this.statsDisplay = document.createElement('div');
    this.statsDisplay.className = 'stats-display';
    this.statsDisplay.innerHTML = '<h3>统计信息</h3><div id="stats-content"></div>';

    const controlsElement = document.getElementById('controls');
    if (controlsElement) {
      controlsElement.appendChild(this.statsDisplay);
    }
  }

  /**
   * 配置 dat.GUI 控件并绑定交互行为。
   */
  private setupControls(): void {
    const modeFolder = this.gui.addFolder('模式选择');
    modeFolder
      .add(this.config, 'mode', {
        '参数估计': 'parameterEstimation',
        '置信区间': 'confidenceInterval'
      })
      .name('可视化模式')
      .onChange(() => this.handleModeChange());
    modeFolder.open();

    const paramFolder = this.gui.addFolder('总体参数');
    paramFolder
      .add(this.config, 'trueMean', -3, 3, 0.1)
      .name('总体均值 (μ)')
      .onFinishChange(() => this.emitConfigChange());
    paramFolder
      .add(this.config, 'trueStdDev', 0.1, 3, 0.1)
      .name('总体标准差 (σ)')
      .onFinishChange(() => this.emitConfigChange());
    paramFolder.open();

    const sampleFolder = this.gui.addFolder('抽样设置');
    sampleFolder
      .add(this.config, 'sampleSize', 10, 500, 10)
      .name('样本大小')
      .onFinishChange(() => this.emitConfigChange());
    sampleFolder
      .add(this.config, 'confidenceLevel', {
        '90%': 0.9,
        '95%': 0.95,
        '99%': 0.99
      })
      .name('置信水平')
      .onChange(() => this.emitConfigChange());
    sampleFolder.open();

    const visualFolder = this.gui.addFolder('可视化选项');
    visualFolder
      .add(this.config, 'showDistribution')
      .name('显示分布曲线')
      .onChange(() => this.emitConfigChange());
    visualFolder
      .add(this.config, 'animationSpeed', 0.1, 2, 0.1)
      .name('动画速度')
      .onFinishChange(() => this.emitConfigChange());
    visualFolder
      .add(this.config, 'numSimulations', 10, 200, 10)
      .name('模拟次数')
      .onFinishChange(() => this.emitConfigChange());

    const actions = {
      generate: () => this.generateVisualization(),
      animate: () => this.animateVisualization(),
      clear: () => this.clearVisualization()
    };

    this.gui.add(actions, 'generate').name('生成样本');
    this.gui.add(actions, 'animate').name('开始动画');
    this.gui.add(actions, 'clear').name('清除');
  }

  /**
   * 当可视化模式发生变化时，清理场景并通知订阅者。
   */
  private handleModeChange(): void {
    this.clearVisualization();
  }

  /**
   * 根据当前模式生成静态可视化内容。
   */
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

  /**
   * 启动动画演示流程并在完成后更新统计面板。
   */
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

  /**
   * 清空当前可视化结果并刷新统计数据。
   */
  private clearVisualization(): void {
    this.paramVisualizer.clear();
    this.ciVisualizer.clear();
    this.updateStatsDisplay();
    this.emitConfigChange();
  }

  /**
   * 更新侧边统计数据显示，区分不同模式。
   */
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

  /**
   * 通知所有注册的配置监听器当前配置快照。
   */
  private emitConfigChange(): void {
    const snapshot = { ...this.config };
    this.configListeners.forEach((listener) => listener(snapshot));
  }

  /**
   * 注册配置变更监听器，并立即派发当前配置。
   */
  public onConfigChange(listener: (config: ControlsConfig) => void): () => void {
    this.configListeners.push(listener);
    listener({ ...this.config });
    return () => {
      this.configListeners = this.configListeners.filter((item) => item !== listener);
    };
  }

  public getConfig(): ControlsConfig {
    return this.config;
  }
}