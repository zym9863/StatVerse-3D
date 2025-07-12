export interface DistributionParams {
  mean: number;
  stdDev: number;
  size: number;
}

export class Distribution {
  static normalRandom(mean: number, stdDev: number): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  static generateNormalSample(params: DistributionParams): number[] {
    const sample: number[] = [];
    for (let i = 0; i < params.size; i++) {
      sample.push(this.normalRandom(params.mean, params.stdDev));
    }
    return sample;
  }

  static calculateMean(data: number[]): number {
    return data.reduce((sum, val) => sum + val, 0) / data.length;
  }

  static calculateStdDev(data: number[], mean?: number): number {
    const m = mean ?? this.calculateMean(data);
    const variance = data.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / data.length;
    return Math.sqrt(variance);
  }

  static calculateConfidenceInterval(
    mean: number,
    stdDev: number,
    sampleSize: number,
    confidenceLevel: number = 0.95
  ): { lower: number; upper: number } {
    const zScores: { [key: number]: number } = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576
    };
    
    const z = zScores[confidenceLevel] || 1.96;
    const marginOfError = z * (stdDev / Math.sqrt(sampleSize));
    
    return {
      lower: mean - marginOfError,
      upper: mean + marginOfError
    };
  }

  static normalPDF(x: number, mean: number, stdDev: number): number {
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
  }

  static generateDistributionCurve(
    mean: number,
    stdDev: number,
    points: number = 100
  ): { x: number; y: number }[] {
    const curve: { x: number; y: number }[] = [];
    const range = 4 * stdDev;
    const start = mean - range;
    const end = mean + range;
    const step = (end - start) / points;

    for (let x = start; x <= end; x += step) {
      curve.push({
        x,
        y: this.normalPDF(x, mean, stdDev)
      });
    }

    return curve;
  }
}