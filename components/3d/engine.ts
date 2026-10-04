/**
 * Imperative WebGL engine for the persistent "AI system".
 *
 * Kept outside React on purpose: everything here mutates every frame, and
 * none of it should ever trigger a re-render. The React layer (SystemScene)
 * only creates the engine, mounts `root`, and calls `update` from useFrame.
 */
import * as THREE from "three";
import { activeMode, sceneState } from "@/lib/scene-store";
import { buildLayouts, KIND, MAX_EDGES, NODE_COUNT, type Layout } from "./layouts";

export type Quality = "high" | "medium" | "low";

const THREAT = new THREE.Color("#ff6b4a");
const AMBIENT = new THREE.Color("#3b4150");
const WHITE = new THREE.Color("#eef1f6");
const damp = THREE.MathUtils.damp;
const lerp = THREE.MathUtils.lerp;

function radialTexture(stops: [number, string][]) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

type Pulse = { edge: number; t: number; speed: number };

export class SystemEngine {
  readonly root = new THREE.Group();

  private readonly layouts: Record<string, Layout> = buildLayouts();
  private readonly motion: number;
  private readonly rig = new THREE.Group();
  private readonly accent = new THREE.Color("#8fb3ff");
  private readonly tmpA = new THREE.Color();
  private readonly tmpB = new THREE.Color();
  private readonly dummy = new THREE.Object3D();
  private readonly disposables: { dispose: () => void }[] = [];

  // Scroll response
  private scrollVel = 0;
  private lastScroll = 0;

  // Core
  private readonly core = new THREE.Group();
  private readonly coreInner: THREE.Mesh;
  private readonly coreShell: THREE.LineSegments;
  private readonly ringA: THREE.Mesh;
  private readonly ringB: THREE.Mesh;
  private readonly halo: THREE.Sprite;
  private readonly innerMat: THREE.MeshStandardMaterial;
  private readonly shellMat: THREE.LineBasicMaterial;
  private readonly ringMat: THREE.MeshBasicMaterial;

  // Network
  private readonly nodes: THREE.InstancedMesh;
  private readonly lineGeo = new THREE.BufferGeometry();
  private readonly lineMat: THREE.LineBasicMaterial;
  private readonly pulses: THREE.InstancedMesh | null;
  private readonly pulseState: Pulse[];
  private readonly pos: Float32Array;
  private readonly scale = new Float32Array(NODE_COUNT);
  private readonly color = new Float32Array(NODE_COUNT * 3).fill(0.6);
  private readonly targets = new Float32Array(NODE_COUNT * 3);
  private edgeMode = "home";
  private fade = 0;

  // Particles
  private readonly particles: THREE.Points;

  constructor({ quality, reducedMotion }: { quality: Quality; reducedMotion: boolean }) {
    this.motion = reducedMotion ? 0 : 1;
    this.pos = new Float32Array(this.layouts.home.positions);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(4, 6, 5);
    const rim = new THREE.DirectionalLight(0x6d7fa8, 0.35);
    rim.position.set(-6, -2, -4);
    this.root.add(ambient, key, rim, this.rig);

    /* ---------- Core ---------- */
    this.innerMat = new THREE.MeshStandardMaterial({
      color: "#11141c",
      metalness: 0.45,
      roughness: 0.38,
      flatShading: true,
      emissive: this.accent.clone(),
      emissiveIntensity: 0.05,
    });
    this.shellMat = new THREE.LineBasicMaterial({ color: this.accent, transparent: true, opacity: 0.45, depthWrite: false });
    this.ringMat = new THREE.MeshBasicMaterial({ color: this.accent, transparent: true, opacity: 0.35, depthWrite: false });

    const innerGeo = new THREE.IcosahedronGeometry(0.58, 0);
    const shellSrc = new THREE.IcosahedronGeometry(1, 1);
    const shellGeo = new THREE.EdgesGeometry(shellSrc);
    shellSrc.dispose();
    const ringGeoA = new THREE.TorusGeometry(1.32, 0.0045, 6, 160);
    const ringGeoB = new THREE.TorusGeometry(1.62, 0.0035, 6, 160);
    const haloTex = radialTexture([
      [0, "rgba(255,255,255,0.55)"],
      [0.25, "rgba(255,255,255,0.14)"],
      [1, "rgba(255,255,255,0)"],
    ]);
    const haloMat = new THREE.SpriteMaterial({
      map: haloTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.4,
    });

    this.coreInner = new THREE.Mesh(innerGeo, this.innerMat);
    this.coreShell = new THREE.LineSegments(shellGeo, this.shellMat);
    this.coreShell.scale.setScalar(0.92);
    this.ringA = new THREE.Mesh(ringGeoA, this.ringMat);
    this.ringB = new THREE.Mesh(ringGeoB, this.ringMat);
    this.halo = new THREE.Sprite(haloMat);
    this.halo.scale.setScalar(4.2);
    this.core.add(this.coreInner, this.coreShell, this.ringA, this.ringB, this.halo);

    /* ---------- Network ---------- */
    const nodeGeo = new THREE.IcosahedronGeometry(0.055, quality === "low" ? 0 : 1);
    const nodeMat = new THREE.MeshBasicMaterial({ toneMapped: false });
    this.nodes = new THREE.InstancedMesh(nodeGeo, nodeMat, NODE_COUNT);
    this.nodes.frustumCulled = false;
    this.nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.nodes.setColorAt(0, WHITE);

    this.lineGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(MAX_EDGES * 6), 3).setUsage(THREE.DynamicDrawUsage),
    );
    this.lineGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(MAX_EDGES * 6), 3).setUsage(THREE.DynamicDrawUsage),
    );
    this.lineGeo.setDrawRange(0, 0);
    this.lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.LineSegments(this.lineGeo, this.lineMat);
    lines.frustumCulled = false;

    const pulseCount = quality === "high" ? 28 : quality === "medium" ? 16 : 0;
    this.pulseState = Array.from({ length: pulseCount }, (_, i) => ({
      edge: i,
      t: Math.random(),
      speed: 0.25 + Math.random() * 0.3,
    }));
    if (pulseCount > 0) {
      const pulseGeo = new THREE.SphereGeometry(0.035, 6, 6);
      const pulseMat = new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: 0.95 });
      this.pulses = new THREE.InstancedMesh(pulseGeo, pulseMat, pulseCount);
      this.pulses.frustumCulled = false;
      this.pulses.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      this.disposables.push(pulseGeo, pulseMat);
    } else {
      this.pulses = null;
    }

    this.rig.add(this.nodes, lines, this.core);
    if (this.pulses) this.rig.add(this.pulses);

    /* ---------- Particles ---------- */
    const count = quality === "high" ? 900 : quality === "medium" ? 500 : 220;
    const arr = new Float32Array(count * 3);
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      const r = 5 + rnd() * 11;
      const th = rnd() * Math.PI * 2;
      const ph = Math.acos(2 * rnd() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(ph) - 4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    const sprite = radialTexture([
      [0, "rgba(255,255,255,1)"],
      [0.4, "rgba(255,255,255,0.35)"],
      [1, "rgba(255,255,255,0)"],
    ]);
    const particleMat = new THREE.PointsMaterial({
      map: sprite,
      size: 0.06,
      sizeAttenuation: true,
      color: "#9aa6bd",
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.particles = new THREE.Points(particleGeo, particleMat);
    this.particles.frustumCulled = false;
    this.root.add(this.particles);

    this.disposables.push(
      innerGeo,
      shellGeo,
      ringGeoA,
      ringGeoB,
      haloTex,
      haloMat,
      this.innerMat,
      this.shellMat,
      this.ringMat,
      nodeGeo,
      nodeMat,
      this.lineGeo,
      this.lineMat,
      particleGeo,
      particleMat,
      sprite,
    );
  }

  update(camera: THREE.Camera, size: { width: number; height: number }, t: number, delta: number) {
    const dt = Math.min(delta, 0.05);
    const mode = activeMode();
    const L = this.layouts[mode];

    this.accent.lerp(this.tmpA.set(L.color), 1 - Math.exp(-2.5 * dt));
    this.updateCamera(camera, dt);
    this.updateRig(L, size, dt);
    this.updateCore(L, mode === "contact", t, dt);
    this.updateNetwork(L, mode, t, dt);
    this.updateParticles(t, dt);
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
  }

  /* ------------------------------------------------------------------ */

  private updateCamera(camera: THREE.Camera, dt: number) {
    camera.position.x = damp(camera.position.x, sceneState.pointerX * 0.55 * this.motion, 1.6, dt);
    camera.position.y = damp(camera.position.y, sceneState.pointerY * 0.35 * this.motion, 1.6, dt);
    camera.lookAt(0, 0, 0);
  }

  private updateRig(L: Layout, size: { width: number; height: number }, dt: number) {
    const g = this.rig;
    const mobile = size.width < 768;
    const narrow = THREE.MathUtils.clamp(size.width / size.height / 1.7, 0.45, 1);
    const tx = mobile ? 0 : L.offset[0] * narrow;
    const ty = mobile ? 0.6 : L.offset[1];
    const ts = L.scale * (mobile ? 0.62 : narrow < 0.8 ? 0.8 : 1);
    g.position.x = damp(g.position.x, tx, 2.2, dt);
    g.position.y = damp(g.position.y, ty, 2.2, dt);
    g.scale.setScalar(damp(g.scale.x, ts, 2.2, dt));

    // Scroll velocity tilts the system slightly: the environment answers the scroll.
    const vel = (sceneState.scroll - this.lastScroll) / Math.max(dt, 1e-3);
    this.lastScroll = sceneState.scroll;
    this.scrollVel = damp(this.scrollVel, THREE.MathUtils.clamp(vel * 2, -1, 1), 3, dt);
    const m = this.motion;
    g.rotation.x = damp(g.rotation.x, 0.12 + this.scrollVel * 0.25 * m + sceneState.pointerY * 0.06 * m, 3, dt);
    g.rotation.z = damp(g.rotation.z, -0.04 - sceneState.pointerX * 0.03 * m, 3, dt);
  }

  private updateCore(L: Layout, contact: boolean, t: number, dt: number) {
    const g = this.core;
    const m = this.motion;
    g.position.set(damp(g.position.x, L.core[0], 2.4, dt), damp(g.position.y, L.core[1], 2.4, dt), damp(g.position.z, L.core[2], 2.4, dt));
    const breathe = 1 + Math.sin(t * 0.9) * 0.025 * m;
    g.scale.setScalar(damp(g.scale.x, L.coreScale * breathe, 2.4, dt));

    this.coreInner.rotation.set(t * 0.11 * m, t * 0.17 * m, 0);
    this.coreShell.rotation.set(-t * 0.05 * m, -t * 0.08 * m, t * 0.03 * m);
    this.ringA.rotation.set(Math.PI / 2.3 + Math.sin(t * 0.2) * 0.1 * m, t * 0.25 * m, 0);
    this.ringB.rotation.set(Math.PI / 1.7, -t * 0.18 * m, Math.PI / 5);

    this.shellMat.color.copy(this.accent);
    this.ringMat.color.copy(this.accent);
    this.innerMat.emissive.copy(this.accent);
    this.innerMat.emissiveIntensity = damp(this.innerMat.emissiveIntensity, contact ? 0.14 : 0.05, 2, dt);
    this.shellMat.opacity = damp(this.shellMat.opacity, contact ? 0.7 : 0.42, 2, dt);
    const hm = this.halo.material;
    hm.color.copy(this.accent);
    hm.opacity = damp(hm.opacity, contact ? 0.75 : 0.4, 2, dt);
  }

  private updateNetwork(L: Layout, mode: string, t: number, dt: number) {
    const { pos, scale, color, targets, dummy, accent, tmpA, tmpB, motion } = this;
    const focus = sceneState.focus;

    // Target positions for this frame: layout, turned by the layout's spin, plus orbits.
    const angle = t * L.spin * motion;
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    for (let i = 0; i < NODE_COUNT; i++) {
      const x = L.positions[i * 3];
      const z = L.positions[i * 3 + 2];
      targets[i * 3] = x * ca - z * sa;
      targets[i * 3 + 1] = L.positions[i * 3 + 1];
      targets[i * 3 + 2] = x * sa + z * ca;
    }
    for (const o of L.orbits) {
      const a = o.phase + t * o.speed * motion;
      targets[o.node * 3] = targets[o.center * 3] + Math.cos(a) * o.radius;
      targets[o.node * 3 + 1] = targets[o.center * 3 + 1] + Math.sin(a) * o.radius * 0.8;
      targets[o.node * 3 + 2] = targets[o.center * 3 + 2] + Math.sin(a) * o.radius * 0.5;
    }

    const k = 1 - Math.exp(-4 * dt);
    for (let i = 0; i < NODE_COUNT; i++) {
      const kind = L.kinds[i];
      const drift = motion * (kind === KIND.ambient ? 0.08 : 0.035);
      for (let a = 0; a < 3; a++) {
        const idx = i * 3 + a;
        pos[idx] = damp(pos[idx], targets[idx] + Math.sin(t * 0.5 + i * 1.7 + a * 2.1) * drift, 2.3, dt);
      }

      const matched = focus !== null && L.groups[i] === focus;
      const dimmed = focus !== null && !matched && kind !== KIND.ambient;
      let sc = L.scales[i] * (matched ? 1.7 : dimmed ? 0.75 : 1);
      if (kind === KIND.threat) sc *= 1 + (0.25 + 0.25 * Math.sin(t * 3 + i)) * (motion || 0.4);
      scale[i] = damp(scale[i], i === 0 ? 0 : sc, 3, dt);

      if (kind === KIND.threat) tmpA.copy(THREAT);
      else if (kind === KIND.ambient) tmpA.copy(AMBIENT);
      else if (kind === KIND.hub) tmpA.copy(accent).lerp(WHITE, 0.25);
      else tmpA.copy(WHITE).lerp(accent, 0.55).multiplyScalar(0.8);
      if (matched) tmpA.lerp(WHITE, 0.35);
      if (dimmed) tmpA.multiplyScalar(0.35);
      color[i * 3] += (tmpA.r - color[i * 3]) * k;
      color[i * 3 + 1] += (tmpA.g - color[i * 3 + 1]) * k;
      color[i * 3 + 2] += (tmpA.b - color[i * 3 + 2]) * k;

      dummy.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      dummy.scale.setScalar(scale[i]);
      dummy.updateMatrix();
      this.nodes.setMatrixAt(i, dummy.matrix);
      this.nodes.setColorAt(i, tmpB.setRGB(color[i * 3], color[i * 3 + 1], color[i * 3 + 2]));
    }
    this.nodes.instanceMatrix.needsUpdate = true;
    if (this.nodes.instanceColor) this.nodes.instanceColor.needsUpdate = true;

    // Edge topology cross-fade: fade out, swap, fade back in.
    if (this.edgeMode !== mode) {
      this.fade = damp(this.fade, 0, 9, dt);
      if (this.fade < 0.03) {
        this.edgeMode = mode;
        this.pulseState.forEach((p) => (p.t = Math.random() * 0.3));
      }
    } else {
      this.fade = damp(this.fade, 1, 1.8, dt);
    }

    const EL = this.layouts[this.edgeMode];
    const edges = EL.edges;
    const edgeCount = edges.length / 2;
    const posAttr = this.lineGeo.getAttribute("position") as THREE.BufferAttribute;
    const colAttr = this.lineGeo.getAttribute("color") as THREE.BufferAttribute;
    const pa = posAttr.array as Float32Array;
    const cl = colAttr.array as Float32Array;
    for (let e = 0; e < edgeCount; e++) {
      const a = edges[e * 2];
      const b = edges[e * 2 + 1];
      for (let c = 0; c < 3; c++) {
        pa[e * 6 + c] = pos[a * 3 + c];
        pa[e * 6 + 3 + c] = pos[b * 3 + c];
      }
      const ambient = EL.kinds[a] === KIND.ambient || EL.kinds[b] === KIND.ambient;
      const threat = EL.kinds[a] === KIND.threat || EL.kinds[b] === KIND.threat;
      const lit = focus !== null && (EL.groups[a] === focus || EL.groups[b] === focus);
      let intensity = ambient ? 0.25 : 1;
      if (focus !== null) intensity *= lit ? 1.9 : 0.35;
      tmpA.copy(threat ? THREAT : accent).multiplyScalar(intensity);
      for (let v = 0; v < 2; v++) {
        cl[e * 6 + v * 3] = tmpA.r;
        cl[e * 6 + v * 3 + 1] = tmpA.g;
        cl[e * 6 + v * 3 + 2] = tmpA.b;
      }
    }
    this.lineGeo.setDrawRange(0, edgeCount * 2);
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    this.lineMat.opacity = this.fade * EL.lineOpacity;

    // Pulses: data / agent activity travelling along edges.
    const pm = this.pulses;
    if (!pm) return;
    for (let p = 0; p < this.pulseState.length; p++) {
      const pulse = this.pulseState[p];
      if (edgeCount === 0) {
        dummy.scale.setScalar(0);
      } else {
        pulse.t += dt * pulse.speed * motion;
        if (pulse.t >= 1 || pulse.edge >= edgeCount) {
          pulse.t = 0;
          pulse.edge = Math.floor(Math.random() * edgeCount);
        }
        const a = edges[pulse.edge * 2];
        const b = edges[pulse.edge * 2 + 1];
        dummy.position.set(
          lerp(pos[a * 3], pos[b * 3], pulse.t),
          lerp(pos[a * 3 + 1], pos[b * 3 + 1], pulse.t),
          lerp(pos[a * 3 + 2], pos[b * 3 + 2], pulse.t),
        );
        const visible = EL.kinds[a] === KIND.ambient ? 0 : 1;
        dummy.scale.setScalar(Math.sin(Math.PI * pulse.t) * this.fade * visible * motion);
      }
      dummy.updateMatrix();
      pm.setMatrixAt(p, dummy.matrix);
    }
    pm.instanceMatrix.needsUpdate = true;
    (pm.material as THREE.MeshBasicMaterial).color.copy(accent).lerp(WHITE, 0.4);
  }

  private updateParticles(t: number, dt: number) {
    const p = this.particles;
    p.rotation.y += dt * 0.012 * this.motion;
    // Parallax: the field drifts as the page scrolls.
    p.position.y = damp(p.position.y, sceneState.scroll * 5, 2, dt);
    p.rotation.x = Math.sin(t * 0.05) * 0.04 * this.motion;
  }
}
