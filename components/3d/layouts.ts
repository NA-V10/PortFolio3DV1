/**
 * Node layouts for each scene mode.
 *
 * The scene uses ONE fixed pool of nodes. Every mode is a different target
 * arrangement of that same pool, so moving between sections morphs the
 * system instead of swapping objects. Node 0 is always the core.
 *
 * Counts that carry meaning (agents, tools, LLMs, PRs, roles) mirror the
 * facts in lib/content.ts.
 */
import type { SceneMode } from "@/lib/scene-store";
import { experience, openSource, ossNodeCount, skills } from "@/lib/content";

export const NODE_COUNT = 56;
export const MAX_EDGES = 160;

export const KIND = { base: 0, hub: 1, threat: 2, ambient: 3 } as const;
type Kind = (typeof KIND)[keyof typeof KIND];

export type Orbit = { node: number; center: number; radius: number; speed: number; phase: number };

export type Layout = {
  positions: Float32Array;
  scales: Float32Array;
  kinds: Uint8Array;
  groups: (string | null)[];
  /** Directed pairs [from, to, from, to, …] — pulses travel from → to. */
  edges: Uint16Array;
  orbits: Orbit[];
  core: [number, number, number];
  coreScale: number;
  /** Desktop placement of the whole system, in world units. */
  offset: [number, number];
  scale: number;
  /** Radians per second the layout turns around Y. */
  spin: number;
  color: string;
  lineOpacity: number;
};

type Vec3 = [number, number, number];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fibonacci(i: number, n: number): Vec3 {
  const y = 1 - (i / Math.max(1, n - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const theta = Math.PI * (3 - Math.sqrt(5)) * i;
  return [Math.cos(theta) * r, y, Math.sin(theta) * r];
}

class Builder {
  p: number[] = [];
  s: number[] = [];
  k: Kind[] = [];
  g: (string | null)[] = [];
  e: number[] = [];
  o: Orbit[] = [];
  private keys = new Set<string>();
  private rand: () => number;

  constructor(
    private core: Vec3,
    seed: number,
  ) {
    this.rand = mulberry32(seed);
    this.add(core, 0, KIND.base, "core");
  }

  r() {
    return this.rand();
  }

  get size() {
    return this.s.length;
  }

  add(pos: Vec3, scale: number, kind: Kind, group: string | null) {
    if (this.size >= NODE_COUNT) throw new Error("Layout exceeds NODE_COUNT");
    this.p.push(pos[0], pos[1], pos[2]);
    this.s.push(scale);
    this.k.push(kind);
    this.g.push(group);
    return this.size - 1;
  }

  pos(i: number): Vec3 {
    return [this.p[i * 3], this.p[i * 3 + 1], this.p[i * 3 + 2]];
  }

  edge(from: number, to: number) {
    const key = from < to ? `${from}-${to}` : `${to}-${from}`;
    if (from === to || this.keys.has(key) || this.e.length / 2 >= MAX_EDGES) return;
    this.keys.add(key);
    this.e.push(from, to);
  }

  /** Connect each node to its k nearest neighbours inside `set`. */
  knn(set: number[], k: number) {
    for (const i of set) {
      const a = this.pos(i);
      const near = set
        .filter((j) => j !== i)
        .map((j) => {
          const b = this.pos(j);
          return { j, d: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 };
        })
        .sort((x, y) => x.d - y.d)
        .slice(0, k);
      near.forEach(({ j }) => this.edge(i, j));
    }
  }

  /** Pad the pool with faint ambient nodes far from the action. */
  fillAmbient(min = 5, max = 7.5) {
    while (this.size < NODE_COUNT) {
      const dir = fibonacci(this.size, NODE_COUNT);
      const rad = min + this.r() * (max - min);
      this.add([dir[0] * rad, dir[1] * rad * 0.6, dir[2] * rad - 1.5], 0.3, KIND.ambient, null);
    }
  }

  build(cfg: Omit<Layout, "positions" | "scales" | "kinds" | "groups" | "edges" | "orbits" | "core">): Layout {
    this.fillAmbient();
    return {
      positions: new Float32Array(this.p),
      scales: new Float32Array(this.s),
      kinds: new Uint8Array(this.k),
      groups: this.g,
      edges: new Uint16Array(this.e),
      orbits: this.o,
      core: this.core,
      ...cfg,
    };
  }
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ------------------------------------------------------------------ */

function home(): Layout {
  const b = new Builder([0, 0, 0], 1);
  const shell = range(NODE_COUNT - 1).map((i) => {
    const [x, y, z] = fibonacci(i, NODE_COUNT - 1);
    const rad = 2 + b.r() * 1.2;
    return b.add([x * rad, y * rad * 0.9, z * rad], 0.55 + b.r() * 0.55, i % 9 === 0 ? KIND.hub : KIND.base, null);
  });
  b.knn(shell, 2);
  shell.filter((_, i) => i % 6 === 0).forEach((i) => b.edge(0, i));
  return b.build({ coreScale: 1, offset: [2.9, 0.1], scale: 0.78, spin: 0.06, color: "#8fb3ff", lineOpacity: 0.32 });
}

function about(): Layout {
  const b = new Builder([0, 0, 0], 2);
  const ring = range(40).map((i) => {
    const a = (i / 40) * Math.PI * 2;
    const rad = 2.4 + b.r() * 1.3;
    const y = (b.r() - 0.5) * 0.7;
    return b.add([Math.cos(a) * rad, y + Math.sin(a) * 0.9, Math.sin(a) * rad], 0.45 + b.r() * 0.5, KIND.base, null);
  });
  b.knn(ring, 2);
  ring.filter((_, i) => i % 8 === 0).forEach((i) => b.edge(0, i));
  return b.build({ coreScale: 0.85, offset: [3.0, 0], scale: 0.7, spin: 0.08, color: "#8fb3ff", lineOpacity: 0.28 });
}

function projectsLayout(): Layout {
  const b = new Builder([0, 0, 0], 3);
  const hubs: { group: string; angle: number }[] = [
    { group: "proj:cybersentinel", angle: Math.PI / 2 },
    { group: "proj:intellicourse", angle: Math.PI / 2 + (Math.PI * 2) / 3 },
    { group: "proj:dailydocs", angle: Math.PI / 2 + (Math.PI * 4) / 3 },
  ];
  hubs.forEach(({ group, angle }, h) => {
    const c: Vec3 = [Math.cos(angle) * 2.3, Math.sin(angle) * 2.0, Math.sin(angle * 2) * 0.6];
    const hub = b.add(c, 1.8 - h * 0.2, KIND.hub, group);
    b.edge(0, hub);
    const sats = range(h === 0 ? 14 : 11).map((i, _, all) => {
      const [x, y, z] = fibonacci(i, all.length);
      const rad = 0.55 + b.r() * 0.35;
      return b.add([c[0] + x * rad, c[1] + y * rad, c[2] + z * rad], 0.45 + b.r() * 0.3, KIND.base, group);
    });
    sats.forEach((s) => b.edge(hub, s));
    b.knn(sats, 1);
  });
  return b.build({ coreScale: 0.9, offset: [3.1, 0], scale: 0.72, spin: 0.05, color: "#8fb3ff", lineOpacity: 0.34 });
}

/** 1 orchestrator core · 12 agents · 9 MCP tools · 3 LLMs · network hosts with threats. */
function cybersentinel(): Layout {
  const b = new Builder([0, 0, 0], 4);
  const agents = range(12).map((i) => {
    const a = (i / 12) * Math.PI * 2;
    return b.add([Math.cos(a) * 1.5, Math.sin(a * 2) * 0.12, Math.sin(a) * 1.5], 0.95, KIND.hub, "cs:agents");
  });
  const tools = range(9).map((i) => {
    const a = (i / 9) * Math.PI * 2 + 0.35;
    return b.add([Math.cos(a) * 2.55, -0.45, Math.sin(a) * 2.55], 0.8, KIND.base, "cs:tools");
  });
  const llms = range(3).map((i) => {
    const a = (i / 3) * Math.PI * 2;
    return b.add([Math.cos(a) * 0.7, 1.75, Math.sin(a) * 0.7], 1.25, KIND.hub, "cs:llms");
  });
  const threatAt = new Set([3, 9, 16, 22, 28]);
  const hosts = range(NODE_COUNT - b.size).map((i) => {
    const a = (i / 31) * Math.PI * 2 + b.r() * 0.2;
    const rad = 2.9 + b.r() * 0.7;
    const kind = threatAt.has(i) ? KIND.threat : KIND.base;
    return b.add([Math.cos(a) * rad, (b.r() - 0.5) * 1.8, Math.sin(a) * rad], 0.5 + b.r() * 0.25, kind, "cs:network");
  });

  agents.forEach((a) => b.edge(a, 0));
  llms.forEach((l) => b.edge(0, l));
  tools.forEach((t, i) => {
    b.edge(t, agents[Math.floor((i * 12) / 9)]);
    b.edge(t, agents[(Math.floor((i * 12) / 9) + 1) % 12]);
  });
  hosts.forEach((h) => {
    const hp = b.pos(h);
    let best = tools[0];
    let bestD = Infinity;
    tools.forEach((t) => {
      const tp = b.pos(t);
      const d = (hp[0] - tp[0]) ** 2 + (hp[1] - tp[1]) ** 2 + (hp[2] - tp[2]) ** 2;
      if (d < bestD) {
        bestD = d;
        best = t;
      }
    });
    b.edge(h, best);
  });
  b.knn(hosts, 1);
  return b.build({ coreScale: 1.05, offset: [3.0, 0], scale: 0.78, spin: 0.045, color: "#7fc8ff", lineOpacity: 0.38 });
}

/** Knowledge graph: users → courses → skills → careers → branching timelines. */
function intellicourse(): Layout {
  const b = new Builder([0, 0.1, -0.3], 5);
  const cluster = (group: string, n: number, angle: number, spread: number) => {
    const c: Vec3 = [Math.cos(angle) * 2.5, Math.sin(angle) * 1.55, (b.r() - 0.5) * 0.6];
    return range(n).map((i) => {
      const [x, y, z] = fibonacci(i, n);
      const rad = spread * (0.45 + b.r() * 0.55);
      return b.add([c[0] + x * rad, c[1] + y * rad, c[2] + z * rad], i === 0 ? 1.3 : 0.6, i === 0 ? KIND.hub : KIND.base, group);
    });
  };
  const users = cluster("kg:users", 7, Math.PI * 1.08, 0.55);
  const courses = cluster("kg:courses", 13, Math.PI * 0.72, 0.75);
  const skillsN = cluster("kg:skills", 14, Math.PI * 0.28, 0.75);
  const careers = cluster("kg:careers", 9, -Math.PI * 0.12, 0.6);

  // Three diverging future timelines branching from the career cluster.
  const origin = b.pos(careers[0]);
  const timelines: number[][] = [-0.55, -0.95, -1.35].map((angle) =>
    range(4).map((s) =>
      b.add(
        [origin[0] + Math.cos(angle) * (0.55 + s * 0.42), origin[1] + Math.sin(angle) * (0.55 + s * 0.42), origin[2] + s * 0.12],
        0.55 + s * 0.08,
        KIND.base,
        "kg:timelines",
      ),
    ),
  );

  [users, courses, skillsN, careers].forEach((set) => b.knn(set, 1));
  users.forEach((u, i) => {
    b.edge(u, courses[(i * 2) % courses.length]);
    b.edge(u, courses[(i * 2 + 5) % courses.length]);
  });
  courses.forEach((c, i) => b.edge(c, skillsN[(i * 3) % skillsN.length]));
  skillsN.forEach((s, i) => b.edge(s, careers[i % careers.length]));
  timelines.forEach((line) => {
    b.edge(careers[0], line[0]);
    line.slice(1).forEach((n, i) => b.edge(line[i], n));
  });
  [users[0], courses[0], skillsN[0], careers[0]].forEach((h) => b.edge(0, h));
  return b.build({ coreScale: 0.75, offset: [3.0, 0.1], scale: 0.72, spin: 0, color: "#b3a3ff", lineOpacity: 0.36 });
}

/** Pages → in-memory pipeline → compact packaged output. */
function dailydocs(): Layout {
  const b = new Builder([0, 0, 0], 6);
  const pages = range(3).map((p) => {
    const ox = -2.5 + p * 0.22;
    const oy = 0.15 + p * 0.18;
    const oz = -p * 0.45;
    const cells: number[][] = range(4).map((row) =>
      range(3).map((col) => b.add([ox + col * 0.32 - 0.32, oy + 0.54 - row * 0.36, oz], 0.55, KIND.base, "dd:input")),
    );
    cells.forEach((row) => {
      b.edge(row[0], row[1]);
      b.edge(row[1], row[2]);
    });
    return cells;
  });
  const inbound = range(4).map((i) => b.add([-1.55 + i * 0.36, 0, 0], 0.5, KIND.base, "dd:pipeline"));
  const outbound = range(4).map((i) => b.add([0.5 + i * 0.36, 0, 0], 0.5, KIND.base, "dd:pipeline"));
  const output: number[][] = range(3).map((row) =>
    range(3).map((col) => b.add([2.1 + col * 0.2, 0.2 - row * 0.2, 0.2], 0.6, KIND.hub, "dd:output")),
  );

  pages.forEach((cells) => b.edge(cells[1][2], inbound[0]));
  inbound.slice(1).forEach((n, i) => b.edge(inbound[i], n));
  b.edge(inbound[inbound.length - 1], 0);
  b.edge(0, outbound[0]);
  outbound.slice(1).forEach((n, i) => b.edge(outbound[i], n));
  b.edge(outbound[outbound.length - 1], output[1][0]);
  output.forEach((row) => {
    b.edge(row[0], row[1]);
    b.edge(row[1], row[2]);
  });
  return b.build({ coreScale: 0.7, offset: [-3.0, 0], scale: 0.75, spin: 0, color: "#e6e2d6", lineOpacity: 0.3 });
}

/** Repositories as hubs; each supplied merged PR orbits its repository. */
function opensource(): Layout {
  const b = new Builder([0, 0, 0], 7);
  openSource.repos.forEach((repo, i) => {
    const a = (i / openSource.repos.length) * Math.PI * 2 + 0.5;
    const hub = b.add([Math.cos(a) * 2.5, Math.sin(a) * 1.6, Math.sin(a) * 0.8], 1.3 + ossNodeCount(repo) * 0.14, KIND.hub, repo.id);
    b.edge(0, hub);
    range(ossNodeCount(repo)).forEach((p) => {
      const node = b.add(b.pos(hub), 0.6, KIND.base, repo.id);
      b.edge(hub, node);
      b.o.push({ node, center: hub, radius: 0.42 + (p % 2) * 0.16, speed: 0.45 - (p % 3) * 0.08, phase: (p / ossNodeCount(repo)) * Math.PI * 2 });
    });
  });
  const stars = range(NODE_COUNT - b.size).map(() => {
    const [x, y, z] = fibonacci(Math.floor(b.r() * 400), 400);
    const rad = 4.2 + b.r() * 2.4;
    return b.add([x * rad, y * rad * 0.65, z * rad - 1], 0.32 + b.r() * 0.2, KIND.ambient, null);
  });
  b.knn(stars, 1);
  return b.build({ coreScale: 0.8, offset: [0.4, 0.2], scale: 1.05, spin: 0.03, color: "#7ee2b8", lineOpacity: 0.24 });
}

/** A receding spatial timeline: VIT → roles in order → the core (agentic systems). */
function experienceLayout(): Layout {
  const start: Vec3 = [-3.2, -1.25, 1.6];
  const core: Vec3 = [3.2, 1.25, -1.9];
  const b = new Builder(core, 8);
  const groups = ["xp:vit", ...experience.map((x) => x.id)];
  const satCounts = [0, ...experience.map((x) => x.points.length)];
  // Stops are spaced evenly along the line from VIT to the core, however many roles there are.
  const stops: Vec3[] = groups.map((_, i) => {
    const t = i / groups.length;
    return [lerp(start[0], core[0], t), lerp(start[1], core[1], t), lerp(start[2], core[2], t)];
  });
  const scaleOf = (i: number) => (i === 0 ? 1.3 : experience[i - 1].current ? 1.85 : 1.5);
  const hubs = stops.map((s, i) => b.add(s, scaleOf(i), KIND.hub, groups[i]));
  [...hubs, 0].forEach((h, i, all) => {
    if (i === 0) return;
    const prev = all[i - 1];
    const a = b.pos(prev);
    const z = b.pos(h);
    const mid = b.add([(a[0] + z[0]) / 2, (a[1] + z[1]) / 2, (a[2] + z[2]) / 2], 0.4, KIND.base, null);
    b.edge(prev, mid);
    b.edge(mid, h);
  });
  hubs.forEach((h, i) => {
    const c = b.pos(h);
    range(Math.min(satCounts[i], 9)).forEach((j, _, all) => {
      const a = (j / all.length) * Math.PI * 2;
      const n = b.add([c[0] + Math.cos(a) * 0.32, c[1] + Math.sin(a) * 0.62, c[2] + Math.sin(a * 2) * 0.12], 0.42, KIND.base, groups[i]);
      b.edge(h, n);
    });
  });
  return b.build({ coreScale: 0.8, offset: [1.2, 0.9], scale: 0.85, spin: 0, color: "#8fb3ff", lineOpacity: 0.36 });
}

/** A sphere banded by skill category. */
function skillsLayout(): Layout {
  const b = new Builder([0, 0, 0], 9);
  const total = NODE_COUNT - 1;
  const counts = skills.map((s) => s.items.length);
  const sum = counts.reduce((x, y) => x + y, 0);
  let acc = 0;
  const bandOf = (i: number) => {
    const f = i / total;
    let c = 0;
    acc = 0;
    for (let k = 0; k < counts.length; k++) {
      acc += counts[k] / sum;
      if (f < acc) {
        c = k;
        break;
      }
      c = k;
    }
    return c;
  };
  const bands: number[][] = skills.map(() => []);
  range(total).forEach((i) => {
    const [x, y, z] = fibonacci(i, total);
    const band = bandOf(i);
    const rad = 2.5 + (b.r() - 0.5) * 0.3;
    bands[band].push(b.add([x * rad, y * rad, z * rad], 0.6 + b.r() * 0.3, KIND.base, skills[band].id));
  });
  bands.forEach((set) => {
    b.knn(set, 2);
    if (set[0] !== undefined) b.edge(0, set[0]);
  });
  return b.build({ coreScale: 0.75, offset: [3.0, 0.4], scale: 0.75, spin: 0.07, color: "#8fb3ff", lineOpacity: 0.3 });
}

/** Everything folds back into a single core. */
function contactLayout(): Layout {
  const b = new Builder([0, 0, 0], 10);
  while (b.size < NODE_COUNT) b.add([0, 0, 0], 0, KIND.base, null);
  return b.build({ coreScale: 1.35, offset: [3.0, 0], scale: 1, spin: 0, color: "#cfdcff", lineOpacity: 0 });
}

export function buildLayouts(): Record<SceneMode, Layout> {
  return {
    home: home(),
    about: about(),
    projects: projectsLayout(),
    cybersentinel: cybersentinel(),
    intellicourse: intellicourse(),
    dailydocs: dailydocs(),
    opensource: opensource(),
    experience: experienceLayout(),
    skills: skillsLayout(),
    contact: contactLayout(),
  };
}
