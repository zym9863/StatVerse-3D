import * as THREE from 'three';
import { Distribution, type DistributionParams } from '../statistics/Distribution';

export class ParameterEstimationVisualizer {
  private group: THREE.Group;
  private samples: number[] = [];
  private samplePoints: THREE.Points[] = [];
  private distributionCurve: THREE.Line | null = null;
  private estimationMarkers: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();
  }

  public generateSamples(params: DistributionParams): void {
    this.clearSamples();
    this.samples = Distribution.generateNormalSample(params);
    this.createSampleVisualization();
    this.updateEstimationMarkers();
  }

  private createSampleVisualization(): void {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];

    this.samples.forEach((value, index) => {
      const y = Math.random() * 2;
      const z = (index / this.samples.length) * 4 - 2;
      
      positions.push(value, y, z);
      
      const color = new THREE.Color();
      color.setHSL(0.6 - (value + 3) / 6 * 0.4, 0.8, 0.5);
      colors.push(color.r, color.g, color.b);
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    this.samplePoints.push(points);
    this.group.add(points);
  }

  public visualizeDistribution(mean: number, stdDev: number): void {
    if (this.distributionCurve) {
      this.group.remove(this.distributionCurve);
      this.distributionCurve.geometry.dispose();
      (this.distributionCurve.material as THREE.Material).dispose();
    }

    const curveData = Distribution.generateDistributionCurve(mean, stdDev);
    const points: THREE.Vector3[] = [];

    curveData.forEach(point => {
      points.push(new THREE.Vector3(point.x, point.y * 10, 0));
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      linewidth: 2,
      transparent: true,
      opacity: 0.8
    });

    this.distributionCurve = new THREE.Line(geometry, material);
    this.group.add(this.distributionCurve);
  }

  private updateEstimationMarkers(): void {
    this.clearEstimationMarkers();

    const sampleMean = Distribution.calculateMean(this.samples);
    const sampleStdDev = Distribution.calculateStdDev(this.samples, sampleMean);

    const meanMarker = this.createMarker(sampleMean, 0x00ff00, 'mean');
    this.estimationMarkers.push(meanMarker);
    this.group.add(meanMarker);

    const ci = Distribution.calculateConfidenceInterval(
      sampleMean,
      sampleStdDev,
      this.samples.length
    );

    const lowerMarker = this.createMarker(ci.lower, 0xff9900, 'ci_lower');
    const upperMarker = this.createMarker(ci.upper, 0xff9900, 'ci_upper');
    
    this.estimationMarkers.push(lowerMarker, upperMarker);
    this.group.add(lowerMarker, upperMarker);

    this.createConfidenceIntervalBar(ci.lower, ci.upper);
  }

  private createMarker(position: number, color: number, type: string): THREE.Mesh {
    const geometry = new THREE.ConeGeometry(0.2, 0.5, 8);
    const material = new THREE.MeshPhongMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.3
    });
    
    const marker = new THREE.Mesh(geometry, material);
    marker.position.set(position, 3, 0);
    marker.rotation.z = Math.PI;
    marker.userData = { type };
    
    return marker;
  }

  private createConfidenceIntervalBar(lower: number, upper: number): void {
    const width = upper - lower;
    const center = (upper + lower) / 2;

    const geometry = new THREE.BoxGeometry(width, 0.1, 0.1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xff9900,
      transparent: true,
      opacity: 0.6
    });

    const bar = new THREE.Mesh(geometry, material);
    bar.position.set(center, 2.5, 0);
    
    this.estimationMarkers.push(bar);
    this.group.add(bar);
  }

  public animateSampling(params: DistributionParams, onComplete?: () => void): void {
    this.clearSamples();
    const targetSamples = params.size;
    let currentSamples = 0;
    const samplesPerFrame = Math.ceil(targetSamples / 60);

    const animate = () => {
      if (currentSamples < targetSamples) {
        const batch = Math.min(samplesPerFrame, targetSamples - currentSamples);
        
        for (let i = 0; i < batch; i++) {
          const value = Distribution.normalRandom(params.mean, params.stdDev);
          this.samples.push(value);
          this.addAnimatedSample(value, currentSamples + i);
        }
        
        currentSamples += batch;
        
        if (currentSamples >= targetSamples) {
          this.updateEstimationMarkers();
          if (onComplete) onComplete();
        }
        
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  private addAnimatedSample(value: number, index: number): void {
    const geometry = new THREE.SphereGeometry(0.05, 8, 8);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(0.6 - (value + 3) / 6 * 0.4, 0.8, 0.5),
      transparent: true,
      opacity: 0.8
    });

    const sphere = new THREE.Mesh(geometry, material);
    const startY = 5;
    const targetY = Math.random() * 2;
    const z = (index / this.samples.length) * 4 - 2;

    sphere.position.set(value, startY, z);
    this.group.add(sphere);

    const duration = 1000 + Math.random() * 500;
    const startTime = Date.now();

    const animateFall = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      sphere.position.y = startY + (targetY - startY) * easeOut;
      
      if (progress < 1) {
        requestAnimationFrame(animateFall);
      }
    };

    animateFall();
  }

  private clearSamples(): void {
    this.samples = [];
    this.samplePoints.forEach(points => {
      this.group.remove(points);
      points.geometry.dispose();
      (points.material as THREE.Material).dispose();
    });
    this.samplePoints = [];
  }

  private clearEstimationMarkers(): void {
    this.estimationMarkers.forEach(marker => {
      this.group.remove(marker);
      marker.geometry.dispose();
      (marker.material as THREE.Material).dispose();
    });
    this.estimationMarkers = [];
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  public getStatistics(): { mean: number; stdDev: number; ci: { lower: number; upper: number } } | null {
    if (this.samples.length === 0) return null;

    const mean = Distribution.calculateMean(this.samples);
    const stdDev = Distribution.calculateStdDev(this.samples, mean);
    const ci = Distribution.calculateConfidenceInterval(mean, stdDev, this.samples.length);

    return { mean, stdDev, ci };
  }

  public clear(): void {
    this.clearSamples();
    this.clearEstimationMarkers();
    
    if (this.distributionCurve) {
      this.group.remove(this.distributionCurve);
      this.distributionCurve.geometry.dispose();
      (this.distributionCurve.material as THREE.Material).dispose();
      this.distributionCurve = null;
    }
  }
}