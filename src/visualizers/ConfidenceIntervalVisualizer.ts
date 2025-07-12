import * as THREE from 'three';
import { Distribution, type DistributionParams } from '../statistics/Distribution';

interface ConfidenceIntervalSample {
  mean: number;
  lower: number;
  upper: number;
  containsTrue: boolean;
  mesh: THREE.Mesh;
}

export class ConfidenceIntervalVisualizer {
  private group: THREE.Group;
  private samples: ConfidenceIntervalSample[] = [];
  private trueMean: number = 0;
  private trueStdDev: number = 1;
  private confidenceLevel: number = 0.95;
  private coverageStats = { total: 0, covered: 0 };

  constructor() {
    this.group = new THREE.Group();
  }

  public setTrueParameters(mean: number, stdDev: number): void {
    this.trueMean = mean;
    this.trueStdDev = stdDev;
    this.createTrueMeanLine();
  }

  public setConfidenceLevel(level: number): void {
    this.confidenceLevel = level;
  }

  private createTrueMeanLine(): void {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([
      this.trueMean, -5, 0,
      this.trueMean, 5, 0
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 3,
      transparent: true,
      opacity: 0.8
    });

    const line = new THREE.Line(geometry, material);
    line.userData = { type: 'trueMean' };
    this.group.add(line);
  }

  public simulateConfidenceIntervals(numSimulations: number, sampleSize: number): void {
    this.clearSimulations();
    this.coverageStats = { total: numSimulations, covered: 0 };

    for (let i = 0; i < numSimulations; i++) {
      setTimeout(() => {
        this.addConfidenceInterval(i, sampleSize);
      }, i * 50);
    }
  }

  private addConfidenceInterval(index: number, sampleSize: number): void {
    const params: DistributionParams = {
      mean: this.trueMean,
      stdDev: this.trueStdDev,
      size: sampleSize
    };

    const sample = Distribution.generateNormalSample(params);
    const sampleMean = Distribution.calculateMean(sample);
    const sampleStdDev = Distribution.calculateStdDev(sample, sampleMean);
    
    const ci = Distribution.calculateConfidenceInterval(
      sampleMean,
      sampleStdDev,
      sampleSize,
      this.confidenceLevel
    );

    const containsTrue = ci.lower <= this.trueMean && ci.upper >= this.trueMean;
    if (containsTrue) this.coverageStats.covered++;

    const interval = this.createIntervalVisualization(
      index,
      sampleMean,
      ci.lower,
      ci.upper,
      containsTrue
    );

    this.samples.push({
      mean: sampleMean,
      lower: ci.lower,
      upper: ci.upper,
      containsTrue,
      mesh: interval
    });

    this.group.add(interval);
    this.animateIntervalAppearance(interval);
  }

  private createIntervalVisualization(
    index: number,
    mean: number,
    lower: number,
    upper: number,
    containsTrue: boolean
  ): THREE.Mesh {
    const width = upper - lower;
    const height = 0.15;
    const depth = 0.05;

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshPhongMaterial({
      color: containsTrue ? 0x3b82f6 : 0xef4444,
      transparent: true,
      opacity: 0.7,
      emissive: containsTrue ? 0x3b82f6 : 0xef4444,
      emissiveIntensity: 0.2
    });

    const mesh = new THREE.Mesh(geometry, material);
    const y = -4 + (index * 0.2) % 8;
    const z = Math.floor(index * 0.2 / 8) * 0.3;
    
    mesh.position.set(mean, y, z);
    mesh.userData = {
      index,
      mean,
      lower,
      upper,
      containsTrue
    };

    const meanIndicator = new THREE.SphereGeometry(0.08, 8, 8);
    const meanMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.3
    });
    const meanMesh = new THREE.Mesh(meanIndicator, meanMaterial);
    meanMesh.position.set(0, 0, 0.1);
    mesh.add(meanMesh);

    return mesh;
  }

  private animateIntervalAppearance(mesh: THREE.Mesh): void {
    mesh.scale.x = 0;
    const material = mesh.material as THREE.MeshPhongMaterial;
    material.opacity = 0;

    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 2);
      mesh.scale.x = easeOut;
      material.opacity = 0.7 * easeOut;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  public animateCoverageVisualization(): void {
    const totalIntervals = this.samples.length;
    if (totalIntervals === 0) return;

    let currentIndex = 0;

    const highlightNext = () => {
      if (currentIndex < totalIntervals) {
        const interval = this.samples[currentIndex];
        this.highlightInterval(interval.mesh, interval.containsTrue);
        currentIndex++;
        setTimeout(highlightNext, 50);
      }
    };

    highlightNext();
  }

  private highlightInterval(mesh: THREE.Mesh, containsTrue: boolean): void {
    const originalScale = mesh.scale.y;
    const duration = 300;
    const startTime = Date.now();
    const material = mesh.material as THREE.MeshPhongMaterial;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const bounce = Math.sin(progress * Math.PI);
      mesh.scale.y = originalScale * (1 + bounce * 0.5);

      if (containsTrue) {
        material.emissiveIntensity = 0.2 + bounce * 0.6;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        mesh.scale.y = originalScale;
        material.emissiveIntensity = 0.2;
      }
    };

    animate();
  }

  public getCoverageStats(): { total: number; covered: number; percentage: number } {
    const percentage = this.coverageStats.total > 0
      ? (this.coverageStats.covered / this.coverageStats.total) * 100
      : 0;

    return {
      ...this.coverageStats,
      percentage
    };
  }

  private clearSimulations(): void {
    this.samples.forEach(sample => {
      this.group.remove(sample.mesh);
      sample.mesh.geometry.dispose();
      (sample.mesh.material as THREE.Material).dispose();
    });
    this.samples = [];

    const trueMeanLine = this.group.children.find(child => child.userData.type === 'trueMean');
    if (trueMeanLine) {
      this.group.clear();
      this.createTrueMeanLine();
    }
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  public clear(): void {
    this.clearSimulations();
    this.group.clear();
  }
}