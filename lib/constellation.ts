/**
 * 생년월일(+시간)을 시드로 사용해 그 사람만의 고유한 "별자리"를
 * 매번 동일하게 재현되도록 생성한다. 실제 천문 데이터가 아니라
 * 개인화를 위한 상징적 시각화다.
 */

export type ConstellationPoint = { x: number; y: number; r: number };
export type ConstellationData = {
  points: ConstellationPoint[];
  edges: [number, number][];
};

// mulberry32: 작고 안정적인 시드 기반 PRNG
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function generateConstellation(
  seedKey: string,
  opts: { width?: number; height?: number; pointCount?: number } = {}
): ConstellationData {
  const width = opts.width ?? 320;
  const height = opts.height ?? 220;
  const rand = mulberry32(hashString(seedKey));

  // 생년월일 자릿수 합으로 5~8개 사이 점 개수를 결정 (개인화 요소)
  const digitSum = seedKey
    .split("")
    .filter((c) => /\d/.test(c))
    .reduce((sum, d) => sum + Number(d), 0);
  const pointCount = opts.pointCount ?? 5 + (digitSum % 4); // 5~8

  const margin = 24;
  const points: ConstellationPoint[] = Array.from(
    { length: pointCount },
    () => ({
      x: margin + rand() * (width - margin * 2),
      y: margin + rand() * (height - margin * 2),
      r: 1.6 + rand() * 2.2,
    })
  );

  // 각 점을 가까운 다음 점과 순서대로 이어 별자리 라인을 만든다
  // (완전 임의 연결보다 실제 별자리처럼 자연스러운 형태가 나옴)
  const order = [...points.keys()].sort((a, b) => {
    const va = rand();
    const vb = rand();
    return va - vb;
  });

  const edges: [number, number][] = [];
  for (let i = 0; i < order.length - 1; i++) {
    edges.push([order[i], order[i + 1]]);
  }
  // 마지막에서 처음으로 되돌아가는 선 하나 추가 (약한 확률)
  if (rand() > 0.5 && order.length > 2) {
    edges.push([order[order.length - 1], order[0]]);
  }

  return { points, edges };
}
