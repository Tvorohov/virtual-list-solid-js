function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ADJ = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Omega", "Prime", "Ultra", "Neo", "Aero", "Quantum"];
const NOUN = ["Widget", "Gadget", "Device", "Thing", "Item", "Product", "Unit", "Module", "Tool", "Gear"];

export type DemoItem = {
  id: number;
  name: string;
  price: number;
  updatedAt: string;
};

export function generateDataset(count = 50000, seed = 1337): DemoItem[] {
  const rand = mulberry32(seed);
  const items: DemoItem[] = new Array(count);
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const a = ADJ[Math.floor(rand() * ADJ.length)];
    const b = NOUN[Math.floor(rand() * NOUN.length)];
    const name = `${a} ${b} ${Math.floor(rand() * 1000)}`;
    const price = Math.round((rand() * 1000 + rand() * 100) * 100) / 100; // 0..~1100
    const daysAgo = Math.floor(rand() * 365);
    const updated = new Date(now - daysAgo * 24 * 60 * 60 * 1000 - Math.floor(rand() * 86400000));
    items[i] = { id: i + 1, name, price, updatedAt: updated.toISOString() };
  }
  return items;
}
