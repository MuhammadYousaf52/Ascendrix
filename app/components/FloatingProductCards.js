"use client"; // remove this line if you are not using Next.js App Router

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PRODUCT_IMAGES } from "@/app/components/productImages";

/**
 * FloatingProductCards
 * ---------------------------------------------------------------------------
 * VERSION MARKER: mobile-v8 (cards and bills clustered tightly near visual
 * center on phones, with no upward bias and a much smaller wander radius —
 * built on top of v7's canvas overflow fix.)
 *
 * Drop-in hero background: 4 lit, glossy 3D "mini listing cards" that
 * wander slowly within the visible frame (never crossing the screen edge)
 * and fly apart from the cursor (or a touch) on approach, with a soft
 * premium glow on each edge. A handful of dollar-bill sprites drift more
 * slowly in the background behind the cards, reacting gently to the cursor
 * too.
 *
 * On phones (viewport width < 480px): only 3 cards are shown instead of 4,
 * and both cards and bills render at 0.16x their normal size.
 *
 * Usage:
 *   <section style={{ position: "relative", height: "100vh" }}>
 *     <FloatingProductCards />
 *     <div style={{ position: "relative", zIndex: 2, pointerEvents: "none" }}>
 *       ...your heading / CTA here, with pointerEvents: "auto" on buttons...
 *     </div>
 *   </section>
 *
 * To change the products, prices, or ratings, edit the PRODUCTS array below.
 * To change the four accent colors used for the glow/rim light, edit
 * ACCENT_PALETTE below. To change how many bills appear, edit BILL_COUNT.
 *
 * TROUBLESHOOTING "cards look too big on mobile": this almost always means
 * the browser or dev server is still serving an OLD cached build, not that
 * this file's logic is wrong. Try, in order:
 *   1. Hard refresh the phone/browser (clear cache, not just reload)
 *   2. Stop the dev server, delete the .next (Next.js) or dist/build folder,
 *      restart `npm run dev`
 *   3. Confirm this exact file (check the "mobile-v3" marker above) is the
 *      one actually saved in your project — not a copy living in a
 *      different folder that isn't the one being imported
 * ---------------------------------------------------------------------------
 */

const PRODUCTS = [
  { image: PRODUCT_IMAGES.seed, rating: 5, price: "$59.99" },
  { image: PRODUCT_IMAGES.uro, rating: 5, price: "$28.97" },
  { image: PRODUCT_IMAGES.chicken, rating: 4.5, price: "$29.99" },
  { image: PRODUCT_IMAGES.petlab, rating: 5, price: "$35.95" },
];

const ACCENT_PALETTE = [0x7c8cff, 0x9b7cff, 0x5fd1c9, 0xff9d7c];

const CARD_W = 2.2;
const CARD_H = 2.9;
const CARD_D = 0.05;
const CARD_RADIUS = 0.18;

const REPEL_RADIUS = 6.2; // catch radius so cards react before the cursor touches them
const REPEL_STRENGTH = 26; // strong push so cards visibly fly away, not just nudge
const SPRING_STIFFNESS = 2.6; // pull back toward the wander path
const SPRING_DAMPING = 3.4; // keeps roam + repel combo smooth instead of jittery

// ---------- Background dollar bills ----------
const BILL_COUNT = 9; // a few more than v6's 6, still well below the cards in visual weight
const BILL_W = 1.3;
const BILL_H = 0.717; // matches the supplied bill photo's aspect ratio (~1.81:1)
const BILL_REPEL_RADIUS = 5.2; // reacts to the cursor a bit before the cards' own radius
const BILL_REPEL_STRENGTH = 10; // gentler push than the cards — background decor, not the main characters
const BILL_SPRING_STIFFNESS = 1.6;
const BILL_SPRING_DAMPING = 3.0;

export default function FloatingProductCards() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let isDisposed = false;
    let cardScaleMultiplier = 1;
    let isMobileView = false;
    let adjustedCardW = CARD_W;
    let adjustedCardH = CARD_H;
    let adjustedBillW = BILL_W;
    let adjustedBillH = BILL_H;
    let positionScaleMultiplier = 1;
    let cameraZ = 18;

    function updateCardScale() {
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const isMobile = vw < 600; // raised from 480 so iPhone-class devices reliably catch this branch
      const isTablet = vw < 1024;
      isMobileView = isMobile;
      // Mobile card size — tuned by eye. Roughly double v5's 0.32 so cards
      // read clearly next to the headline, while the camera being pulled back
      // (cameraZ below) prevents this larger world size from looking huge.
      cardScaleMultiplier = isMobile ? 0.47 : isTablet ? 0.78 : 1;
      adjustedCardW = CARD_W * cardScaleMultiplier;
      adjustedCardH = CARD_H * cardScaleMultiplier;
      const billScaleMultiplier = isMobile ? 0.7 : isTablet ? 0.75 : 1;
      adjustedBillW = BILL_W * billScaleMultiplier;
      adjustedBillH = BILL_H * billScaleMultiplier;
      positionScaleMultiplier = isMobile ? 0.45 : isTablet ? 0.8 : 1;
      cameraZ = isMobile ? 14 : isTablet ? 16 : 18;
      // One-time confirmation in the browser console that the new build is
      // actually loaded. If you don't see this log on mobile, your dev server
      // or browser is serving a stale bundle — hard refresh and/or restart.
      // eslint-disable-next-line no-console
      console.log(
        "[FloatingProductCards mobile-v8]",
        "vw=", vw,
        "isMobile=", isMobile,
        "cardScale=", cardScaleMultiplier,
        "cameraZ=", cameraZ
      );
    }
    
    updateCardScale();

    // ---------- Renderer / Scene / Camera ----------
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = false;
    // Force the canvas's CSS box to exactly match its parent wrap. Three.js
    // setSize handles this when updateStyle is true, but pinning it here
    // explicitly makes the behavior independent of any future refactor.
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null; // transparent, sits over your page background

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, cameraZ);

    function resize() {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      // updateStyle MUST be true (3rd arg). With false, Three.js sets only the
      // drawing-buffer attributes (w * pixelRatio) but not the canvas CSS
      // size — so on a 430px-wide wrap with pixelRatio=2 the canvas display
      // size defaults to its 860px attribute width, meaning the rendered scene
      // visually spills ~2x past the wrap's right edge regardless of how
      // correctly the in-world clamp math is positioning cards. This was the
      // actual reason cards appeared to break past the screen boundary on
      // mobile in earlier versions, NOT a per-card sizing issue.
      renderer.setSize(w, h, true);
      camera.aspect = w / h;
      const prevScale = cardScaleMultiplier;
      const prevCameraZ = cameraZ;
      updateCardScale();
      // Apply any change to camera distance (e.g. on rotation/resize from
      // mobile to tablet width). Must be done before updateProjectionMatrix.
      if (prevCameraZ !== cameraZ) {
        camera.position.z = cameraZ;
      }
      camera.updateProjectionMatrix();
      if (prevScale !== cardScaleMultiplier) {
        buildCards();
        buildBills();
      }
    }
    resize();
    window.addEventListener("resize", resize);

    // Defensive re-check shortly after mount: in some Next.js SSR/hydration
    // setups the very first layout pass can briefly report a stale or
    // default viewport width before the real one settles. This catches that
    // by re-validating the mobile/tablet scale a moment later and rebuilding
    // if it turns out the first read was wrong.
    const hydrationSafetyTimer = setTimeout(() => {
      const prevScale = cardScaleMultiplier;
      const prevCameraZ = cameraZ;
      const prevMobileView = isMobileView;
      updateCardScale();
      if (prevCameraZ !== cameraZ) {
        camera.position.z = cameraZ;
        camera.updateProjectionMatrix();
      }
      if (prevScale !== cardScaleMultiplier) {
        buildCards();
        buildBills();
      }
    }, 100);

    // world-space half-extents visible to the camera at a given distance in
    // front of it. Used to keep cards wandering within frame regardless of
    // viewport aspect ratio.
    function visibleHalfExtentsAtZ(worldZ) {
      const distance = camera.position.z - worldZ;
      const vFov = (camera.fov * Math.PI) / 180;
      const halfHeight = Math.tan(vFov / 2) * distance;
      const halfWidth = halfHeight * camera.aspect;
      return { halfWidth, halfHeight };
    }

    // Guarantees a starting (x, y, z) is inside the camera's visible frame
    // (with a small safety margin) given an object's on-screen width/height.
    // Used so a card/bill is never even momentarily placed outside bounds —
    // independent of the spring-physics catch-up that happens afterward.
    function clampToVisibleFrame(x, y, z, objW, objH) {
      const { halfWidth, halfHeight } = visibleHalfExtentsAtZ(z);
      const halfW = objW / 2;
      const halfH = objH / 2;
      const safetyX = halfWidth * 0.1;
      const safetyY = halfHeight * 0.1;
      const clampX = Math.max(0, halfWidth - halfW - safetyX);
      const clampY = Math.max(0, halfHeight - halfH - safetyY);
      return {
        x: Math.max(-clampX, Math.min(clampX, x)),
        y: Math.max(-clampY, Math.min(clampY, y)),
        z,
      };
    }

    // ---------- Lighting (glossy, soft studio look) ----------
    const ambient = new THREE.AmbientLight(0x9aa3ff, 0.55);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(6, 10, 12);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x6c5ce7, 0.9);
    rimLight.position.set(-8, -4, -6);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x8a7bff, 0.6, 40);
    fillLight.position.set(0, -6, 10);
    scene.add(fillLight);


    // =======================================================================
    // Backside texture (simple branded back so cards look complete tumbling)
    // =======================================================================
    function createCardBackTexture() {
      const W = 512, H = 640;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, "#3b3fae");
      grad.addColorStop(1, "#211f4a");
      roundRectPath(ctx, 0, 0, W, H, 36);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.font = "180px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🛒", W / 2, H / 2);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    // =======================================================================
    // Soft edge-glow texture — radial falloff used behind each card for a
    // premium "backlit" feel. Additive blending so it only ever brightens.
    // =======================================================================
    function createGlowTexture() {
      const S = 512;
      const canvas = document.createElement("canvas");
      canvas.width = S;
      canvas.height = S;
      const ctx = canvas.getContext("2d");
      const grad = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      grad.addColorStop(0, "rgba(255,255,255,0.45)");
      grad.addColorStop(0.3, "rgba(170,180,255,0.22)");
      grad.addColorStop(0.65, "rgba(120,110,255,0.08)");
      grad.addColorStop(1, "rgba(120,110,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, S, S);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    // Create textures before building cards
    const backTexture = createCardBackTexture();
    const glowTexture = createGlowTexture();

    // =======================================================================
    // Dollar bill texture — loads the actual $100 bill artwork supplied via
    // PRODUCT_IMAGES.billHundred. Falls back to a simple placeholder color
    // until the image finishes loading (same pattern as the product photos).
    // =======================================================================
    function createBillTexture() {
      const W = 512, H = 282; // matches the bill's real aspect ratio (~1.82:1)
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");

      // placeholder fill shown for the brief moment before the image loads
      ctx.fillStyle = "#dce8d2";
      ctx.fillRect(0, 0, W, H);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (isDisposed) return;
        // cover-fit the bill image into the canvas, preserving its aspect ratio
        const ir = img.width / img.height;
        const cr = W / H;
        let dw, dh, dx, dy;
        if (ir > cr) {
          dh = H;
          dw = H * ir;
          dx = (W - dw) / 2;
          dy = 0;
        } else {
          dw = W;
          dh = W / ir;
          dx = 0;
          dy = (H - dh) / 2;
        }
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(img, dx, dy, dw, dh);
        tex.needsUpdate = true;
      };
      img.src = PRODUCT_IMAGES.billHundred;

      return tex;
    }
    const billTexture = createBillTexture();

    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    const billGroup = new THREE.Group();
    scene.add(billGroup);

    const cardStates = [];
    const billStates = [];
    const disposableGeometries = [];
    const disposableMaterials = [];
    const disposableTextures = [backTexture, glowTexture, billTexture];

    const POSITIONS = [
      { x: -4.6, y: 1.6, z: 0.6 },
      { x: -1.5, y: -1.8, z: 1.2 },
      { x: 1.7, y: 1.9, z: -0.4 },
      { x: 4.6, y: -1.4, z: 0.3 },
    ];

    // Bills sit further back (more negative z) than the cards, and are
    // scattered wider since there are fewer of them filling more area.
    const BILL_POSITIONS = [
      { x: -6.2, y: 2.4, z: -2.2 },
      { x: -3.5, y: -2.6, z: -2.8 },
      { x: 0, y: 3.0, z: -2.4 },
      { x: 3.6, y: -2.2, z: -2.6 },
      { x: 6.4, y: 1.8, z: -3.0 },
      { x: 5.6, y: -0.5, z: -1.8 },
      // three extras added in v7 — give the background a bit more density
      { x: -5.8, y: -0.8, z: -2.4 },
      { x: -1.8, y: 1.2, z: -3.2 },
      { x: 2.4, y: 2.4, z: -2.0 },
    ];

    // =======================================================================
    // Rounded box geometry helper (gives cards real thickness + rounded
    // corners, for a soft, glossy "premium balloon" look)
    // =======================================================================
    function createRoundedBoxGeometry(width, height, depth, radius, smoothness = 6) {
      const shape = new THREE.Shape();
      const w = width / 2 - radius;
      const h = height / 2 - radius;

      shape.absarc(w, h, radius, Math.PI / 2, 0, true);
      shape.absarc(w, -h, radius, 0, -Math.PI / 2, true);
      shape.absarc(-w, -h, radius, -Math.PI / 2, Math.PI, true);
      shape.absarc(-w, h, radius, Math.PI, Math.PI / 2, true);

      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelThickness: radius * 0.25,
        bevelSize: radius * 0.18,
        bevelSegments: smoothness,
        curveSegments: smoothness * 4,
      });

      geometry.translate(0, 0, -depth / 2);
      geometry.computeVertexNormals();
      return geometry;
    }

    // Flat rounded-corner plane — used for the front/back face so the texture
    // never shows a square corner past the 3D body's rounded edge underneath.
    function createRoundedPlaneGeometry(width, height, radius, smoothness = 6) {
      const shape = new THREE.Shape();
      const w = width / 2 - radius;
      const h = height / 2 - radius;

      shape.absarc(w, h, radius, Math.PI / 2, 0, true);
      shape.absarc(w, -h, radius, 0, -Math.PI / 2, true);
      shape.absarc(-w, -h, radius, -Math.PI / 2, Math.PI, true);
      shape.absarc(-w, h, radius, Math.PI, Math.PI / 2, true);
      shape.closePath();

      const geometry = new THREE.ShapeGeometry(shape, smoothness * 4);
      // ShapeGeometry's generated UVs don't line up with the texture; rebuild
      // them from each vertex's actual position so the canvas texture maps
      // onto the rounded plane correctly edge-to-edge.
      const pos = geometry.attributes.position;
      const uv = new Float32Array(pos.count * 2);
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        uv[i * 2] = (x + width / 2) / width;
        uv[i * 2 + 1] = (y + height / 2) / height;
      }
      geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      return geometry;
    }

    // A subdivided, slightly rounded-corner plane used for the dollar bills.
    // The extra internal grid of vertices is what lets the animation loop
    // bend the mesh into a gentle traveling wave each frame, like a light
    // sheet of paper fluttering in the air, instead of a perfectly rigid card.
    function createWavyBillGeometry(width, height, radius, segmentsX = 16, segmentsY = 8) {
      const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);

      // Soften the four corners by pulling corner-region vertices slightly
      // inward, so the bill doesn't read as a perfectly sharp rectangle.
      const pos = geometry.attributes.position;
      const hw = width / 2;
      const hh = height / 2;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const cornerDistX = hw - Math.abs(x);
        const cornerDistY = hh - Math.abs(y);
        if (cornerDistX < radius && cornerDistY < radius) {
          const dx = radius - cornerDistX;
          const dy = radius - cornerDistY;
          const pull = Math.min(1, Math.sqrt(dx * dx + dy * dy) / radius) * radius * 0.5;
          pos.setX(i, x - Math.sign(x) * pull * 0.3);
          pos.setY(i, y - Math.sign(y) * pull * 0.3);
        }
      }
      pos.needsUpdate = true;
      geometry.computeVertexNormals();

      // Store the undeformed (flat) positions separately — the animation
      // loop reads from this every frame and writes the rippled result into
      // the live position attribute, rather than accumulating drift on top
      // of an already-bent mesh.
      geometry.userData.basePositions = Float32Array.from(pos.array);

      return geometry;
    }

    function roundRectPath(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function drawStars(ctx, x, y, rating, size) {
      const spacing = size * 1.15;
      ctx.font = `${size}px Arial`;
      ctx.textBaseline = "top";
      for (let i = 0; i < 5; i++) {
        const fillAmount = Math.max(0, Math.min(1, rating - i));
        ctx.save();
        ctx.fillStyle = "#3a4255";
        ctx.fillText("★", x + i * spacing, y);
        if (fillAmount > 0) {
          ctx.save();
          const clipW = spacing * fillAmount;
          ctx.beginPath();
          ctx.rect(x + i * spacing, y - 4, clipW, size + 8);
          ctx.clip();
          ctx.fillStyle = "#f5a623";
          ctx.fillText("★", x + i * spacing, y);
          ctx.restore();
        }
        ctx.restore();
      }
    }

    // =======================================================================
    // Card face texture — draws the "mini listing card" UI (product image,
    // star rating, price) onto a canvas used as a texture
    // =======================================================================
    function createCardFaceTexture(product) {
      const W = 512, H = 640;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");

      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, "#2a3142");
      bgGrad.addColorStop(1, "#1c2230");
      roundRectPath(ctx, 0, 0, W, H, 36);
      ctx.fillStyle = bgGrad;
      ctx.fill();

      ctx.save();
      roundRectPath(ctx, 2, 2, W - 4, H - 4, 34);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      const pad = 28;
      const imgSize = W - pad * 2;
      const imgY = 28;

      ctx.save();
      roundRectPath(ctx, pad, imgY, imgSize, imgSize, 24);
      ctx.clip();
      ctx.fillStyle = "#f5f5f2";
      ctx.fillRect(pad, imgY, imgSize, imgSize);
      ctx.restore();

      const img = new Image();
      img.crossOrigin = "anonymous";

      function drawStaticChrome() {
        const starY = imgY + imgSize + 56;
        drawStars(ctx, pad, starY, product.rating, 30);

        ctx.font = "700 56px 'Segoe UI', Arial, sans-serif";
        ctx.fillStyle = "#3ddc84";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(product.price, pad, starY + 78);
      }

      drawStaticChrome();

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;

      img.onload = () => {
        if (isDisposed) return;
        ctx.save();
        roundRectPath(ctx, pad, imgY, imgSize, imgSize, 24);
        ctx.clip();
        const ir = img.width / img.height;
        let dw = imgSize, dh = imgSize, dx = pad, dy = imgY;
        if (ir > 1) {
          dh = imgSize;
          dw = imgSize * ir;
          dx = pad - (dw - imgSize) / 2;
        } else {
          dw = imgSize;
          dh = imgSize / ir;
          dy = imgY - (dh - imgSize) / 2;
        }
        ctx.fillStyle = "#f5f5f2";
        ctx.fillRect(pad, imgY, imgSize, imgSize);
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();

        drawStaticChrome();
        texture.needsUpdate = true;
      };
      img.src = product.image;

      return texture;
    }

    // =======================================================================
    // Backside texture (simple branded back so cards look complete tumbling)
    // =======================================================================
    function createCardBackTexture() {
      const W = 512, H = 640;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, "#3b3fae");
      grad.addColorStop(1, "#211f4a");
      roundRectPath(ctx, 0, 0, W, H, 36);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.font = "180px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🛒", W / 2, H / 2);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    // Build card meshes with proper responsive scaling
    function buildCards() {
      // Clear existing cards
      cardStates.forEach((state) => {
        cardGroup.remove(state.mesh);
      });
      cardStates.length = 0;
      
      const cardGeometry = createRoundedBoxGeometry(adjustedCardW, adjustedCardH, CARD_D, CARD_RADIUS, 6);
      disposableGeometries.push(cardGeometry);

      const sideMaterialBase = new THREE.MeshPhysicalMaterial({
        color: 0x14151c,
        roughness: 0.55,
        metalness: 0.05,
        clearcoat: 0.3,
        clearcoatRoughness: 0.4,
      });
      disposableMaterials.push(sideMaterialBase);

      // On phones, show only 3 of the 4 cards — fewer floating elements
      // reads much less cluttered on a small screen.
      const activeProducts = isMobileView ? PRODUCTS.slice(0, 3) : PRODUCTS;

      activeProducts.forEach((product, i) => {
        const faceTexture = createCardFaceTexture(product);
        disposableTextures.push(faceTexture);

        const accentColor = ACCENT_PALETTE[i % ACCENT_PALETTE.length];

        const faceMaterial = new THREE.MeshPhysicalMaterial({
          map: faceTexture,
          roughness: 0.35,
          metalness: 0.0,
          clearcoat: 0.55,
          clearcoatRoughness: 0.3,
        });

        const backMaterial = new THREE.MeshPhysicalMaterial({
          map: backTexture,
          roughness: 0.4,
          metalness: 0.0,
          clearcoat: 0.45,
          clearcoatRoughness: 0.35,
        });

        const bodySideMaterial = sideMaterialBase.clone();
        bodySideMaterial.emissive = new THREE.Color(accentColor);
        bodySideMaterial.emissiveIntensity = 0.12;

        disposableMaterials.push(faceMaterial, backMaterial, bodySideMaterial);

        const bodyMesh = new THREE.Mesh(cardGeometry, bodySideMaterial);


        const faceGeo = createRoundedPlaneGeometry(
          adjustedCardW,
          adjustedCardH,
          CARD_RADIUS * cardScaleMultiplier
        );
        disposableGeometries.push(faceGeo);

        const frontFace = new THREE.Mesh(faceGeo, faceMaterial);
        const faceZOffset = CARD_D / 2 + CARD_RADIUS * 0.3;
        frontFace.position.z = faceZOffset;


        const backFace = new THREE.Mesh(faceGeo, backMaterial);
        backFace.position.z = -faceZOffset;
        backFace.rotation.y = Math.PI;

        const glowGeo = new THREE.PlaneGeometry(adjustedCardW * 1.35, adjustedCardH * 1.25);
        disposableGeometries.push(glowGeo);
        const glowMaterial = new THREE.MeshBasicMaterial({
          map: glowTexture,
          color: new THREE.Color(accentColor),
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        disposableMaterials.push(glowMaterial);
        const glowMesh = new THREE.Mesh(glowGeo, glowMaterial);
        glowMesh.position.z = -faceZOffset - 0.05;

        const cardPivot = new THREE.Group();
        cardPivot.add(glowMesh, bodyMesh, frontFace, backFace);

        const startPos = POSITIONS[i] || { x: 0, y: 0, z: 0 };
        const safeStart = clampToVisibleFrame(
          startPos.x * positionScaleMultiplier,
          startPos.y * positionScaleMultiplier,
          startPos.z,
          adjustedCardW,
          adjustedCardH
        );
        cardPivot.position.set(safeStart.x, safeStart.y, safeStart.z);
        cardPivot.rotation.set(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.25
        );

        cardGroup.add(cardPivot);

        cardStates.push({
          mesh: cardPivot,
          glow: glowMesh,
          basePos: new THREE.Vector3(startPos.x, startPos.y, startPos.z),
          velocity: new THREE.Vector3(0, 0, 0),
          wanderSeed: new THREE.Vector3(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          ),
          wanderSeed2: new THREE.Vector3(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          ),
          wanderSpeed: 0.05 + Math.random() * 0.035,
          glowPulseSeed: Math.random() * Math.PI * 2,
          rotSeed: new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10),
          baseRot: cardPivot.rotation.clone(),
        });
      });
    }

    buildCards();

    // Build dollar bill sprites — simple flat rounded planes, fewer than the
    // cards, sitting further back, drifting slowly and reacting gently to
    // the cursor so they read as ambient background rather than the focus.
    function buildBills() {
      billStates.forEach((state) => {
        billGroup.remove(state.mesh);
        state.geometry.dispose(); // each bill owns its own geometry now (needed for independent ripple)
        const idx = disposableGeometries.indexOf(state.geometry);
        if (idx !== -1) disposableGeometries.splice(idx, 1);
      });
      billStates.length = 0;

      for (let i = 0; i < BILL_COUNT; i++) {
        const billGeo = createWavyBillGeometry(
          adjustedBillW,
          adjustedBillH,
          adjustedBillH * 0.1,
          18,
          9
        );
        disposableGeometries.push(billGeo);

        const billMaterial = new THREE.MeshBasicMaterial({
          map: billTexture,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
        });
        disposableMaterials.push(billMaterial);

        const billMesh = new THREE.Mesh(billGeo, billMaterial);
        billMesh.renderOrder = -1; // draw behind the cards

        const startPos = BILL_POSITIONS[i] || {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 6,
          z: -2.5,
        };
        const safeBillStart = clampToVisibleFrame(
          startPos.x * positionScaleMultiplier,
          startPos.y * positionScaleMultiplier,
          startPos.z,
          adjustedBillW,
          adjustedBillH
        );
        billMesh.position.set(safeBillStart.x, safeBillStart.y, safeBillStart.z);
        billMesh.rotation.set(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.5
        );

        billGroup.add(billMesh);

        billStates.push({
          mesh: billMesh,
          geometry: billGeo,
          basePos: new THREE.Vector3(startPos.x, startPos.y, startPos.z),
          velocity: new THREE.Vector3(0, 0, 0),
          wanderSeed: new THREE.Vector3(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          ),
          wanderSeed2: new THREE.Vector3(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          ),
          wanderSpeed: 0.035 + Math.random() * 0.025,
          rotSeed: new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10),
          baseRot: billMesh.rotation.clone(),
          // flutter/wave parameters — each bill ripples on its own schedule
          waveSeed: Math.random() * Math.PI * 2,
          waveSeed2: Math.random() * Math.PI * 2,
          waveSpeed: 1.6 + Math.random() * 1.0,
          waveAmplitude: 0.045 + Math.random() * 0.03,
        });
      }
    }

    buildBills();

    // =======================================================================
    // Pointer tracking + raycasting into the 3D scene
    // =======================================================================
    const pointerNDC = new THREE.Vector2(-10, -10);
    const pointerWorld = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    let pointerActive = false;

    function updatePointerFromEvent(clientX, clientY) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      pointerActive = true;
    }

    const onPointerMove = (e) => updatePointerFromEvent(e.clientX, e.clientY);
    const onPointerDown = (e) => updatePointerFromEvent(e.clientX, e.clientY);
    const onPointerLeave = () => { pointerActive = false; };
    const onTouchMove = (e) => {
      if (e.touches.length) updatePointerFromEvent(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => { pointerActive = false; };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // =======================================================================
    // Animation loop — full-screen wandering + cursor repulsion + glow
    // =======================================================================
    const clock = new THREE.Clock();
    let elapsedAccum = 0;
    let rafId = null;

    function animate() {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsedAccum += dt;
      const elapsed = elapsedAccum;

      if (pointerActive) {
        raycaster.setFromCamera(pointerNDC, camera);
        raycaster.ray.intersectPlane(interactionPlane, pointerWorld);
      }

      cardStates.forEach((state) => {
        const m = state.mesh;

        const { halfWidth, halfHeight } = visibleHalfExtentsAtZ(state.basePos.z);
        const cardHalfWForMargin = adjustedCardW / 2;
        const cardHalfHForMargin = adjustedCardH / 2;
        // On phones the wander zone is pulled in further but still allows
        // visible movement, keeping cards comfortably within the viewport.
        const wanderZoneFactor = isMobileView ? 0.75 : 0.7;
        const marginX = Math.max(0.1, halfWidth * wanderZoneFactor - cardHalfWForMargin);

        // Vertical wander: on desktop the band sits a bit above center to
        // float around the headline. On mobile that bias is removed — cards
        // sit on the true vertical center of the canvas so they cluster
        // tightly there rather than drifting toward the top or bottom edge.
        const verticalCenterBias = isMobileView ? 0 : halfHeight * 0.18;
        const verticalZoneFactor = isMobileView ? 0.55 : 0.36;
        const marginY = Math.max(0.1, halfHeight * verticalZoneFactor - cardHalfHForMargin); // tighter vertical spread, edge-aware

        const t = elapsed * state.wanderSpeed;
        const wanderX =
          Math.sin(t * 1.0 + state.wanderSeed.x) * 0.6 +
          Math.sin(t * 0.47 + state.wanderSeed2.x) * 0.4;
        const wanderY =
          Math.cos(t * 0.83 + state.wanderSeed.y) * 0.6 +
          Math.cos(t * 0.31 + state.wanderSeed2.y) * 0.4;

        const wanderTarget = new THREE.Vector3(
          wanderX * marginX,
          verticalCenterBias + wanderY * marginY,
          state.basePos.z
        );

        const toTarget = new THREE.Vector3().subVectors(wanderTarget, m.position);
        const springAccel = toTarget.multiplyScalar(SPRING_STIFFNESS);

        const repelAccel = new THREE.Vector3(0, 0, 0);
        let proximity = 0;
        if (pointerActive) {
          const toCard = new THREE.Vector3().subVectors(m.position, pointerWorld);
          toCard.z = 0;
          const dist = toCard.length();
          if (dist < REPEL_RADIUS && dist > 0.0001) {
            const falloff = 1 - dist / REPEL_RADIUS;
            proximity = falloff;
            repelAccel.copy(toCard.normalize()).multiplyScalar(falloff * falloff * REPEL_STRENGTH);
          }
        }

        const dampingAccel = state.velocity.clone().multiplyScalar(-SPRING_DAMPING);

        const totalAccel = springAccel.add(repelAccel).add(dampingAccel);
        state.velocity.add(totalAccel.multiplyScalar(dt));
        m.position.add(state.velocity.clone().multiplyScalar(dt));

        // Clamp by the card's actual edge (not just its center point), so the
        // card never visibly crosses the screen boundary on any aspect ratio.
        // Phones get a noticeably bigger buffer (0.18/0.22 vs 0.06/0.08) since
        // narrow viewports leave much less forgiving margin for error and the
        // mobile cards are now visibly large enough that any edge-grazing is
        // very noticeable.
        const cardHalfW = (adjustedCardW * 1.0) / 2;
        const cardHalfH = (adjustedCardH * 1.0) / 2;
        const edgeMarginX = halfWidth * (isMobileView ? 0.18 : 0.06);
        const edgeMarginY = halfHeight * (isMobileView ? 0.22 : 0.08);
        const clampX = Math.max(0, halfWidth - cardHalfW - edgeMarginX);
        const clampYFactor = isMobileView ? 0.6 : 0.78; // tighter vertical clamp on phones
        const clampY = Math.max(0, halfHeight * clampYFactor - cardHalfH - edgeMarginY);
        m.position.x = Math.max(-clampX, Math.min(clampX, m.position.x));
        m.position.y = Math.max(-clampY, Math.min(clampY, m.position.y));

        const speed = state.velocity.length();
        m.rotation.x =
          state.baseRot.x + Math.sin(elapsed * 0.3 + state.rotSeed.x) * 0.08 - state.velocity.y * 0.05;
        m.rotation.y =
          state.baseRot.y + Math.sin(elapsed * 0.25 + state.rotSeed.y) * 0.12 + state.velocity.x * 0.05;
        m.rotation.z =
          state.baseRot.z + Math.sin(elapsed * 0.2 + state.rotSeed.z) * 0.05 - state.velocity.x * 0.02;

        const idlePulse = 0.7 + Math.sin(elapsed * 0.6 + state.glowPulseSeed) * 0.3;
        const targetGlowOpacity = Math.min(1.0, idlePulse * 0.4 + proximity * 1.1);
        state.glow.material.opacity +=
          (targetGlowOpacity - state.glow.material.opacity) * Math.min(1, dt * 6);
        const targetGlowScale = 1 + proximity * 0.45 + Math.min(speed, 4) * 0.015;
        state.glow.scale.setScalar(
          state.glow.scale.x + (targetGlowScale - state.glow.scale.x) * Math.min(1, dt * 6)
        );
      });

      // ---- bills: same idea as cards, but lighter/gentler and wider spread ----
      billStates.forEach((state) => {
        const m = state.mesh;
        const { halfWidth, halfHeight } = visibleHalfExtentsAtZ(state.basePos.z);

        const billHalfW = adjustedBillW / 2;
        const billHalfH = adjustedBillH / 2;
        // Mobile bills wander moderately, staying behind the cards as
        // background ambient texture.
        const billMarginXFactor = isMobileView ? 0.7 : 0.85;
        const billMarginYFactor = isMobileView ? 0.6 : 0.8;
        const marginX = Math.max(0.1, halfWidth * billMarginXFactor - billHalfW);
        const marginY = Math.max(0.1, halfHeight * billMarginYFactor - billHalfH);

        const t = elapsed * state.wanderSpeed;
        const wanderX =
          Math.sin(t * 1.0 + state.wanderSeed.x) * 0.6 +
          Math.sin(t * 0.4 + state.wanderSeed2.x) * 0.4;
        const wanderY =
          Math.cos(t * 0.75 + state.wanderSeed.y) * 0.6 +
          Math.cos(t * 0.28 + state.wanderSeed2.y) * 0.4;

        const wanderTarget = new THREE.Vector3(
          wanderX * marginX,
          wanderY * marginY,
          state.basePos.z
        );

        const toTarget = new THREE.Vector3().subVectors(wanderTarget, m.position);
        const springAccel = toTarget.multiplyScalar(BILL_SPRING_STIFFNESS);

        const repelAccel = new THREE.Vector3(0, 0, 0);
        if (pointerActive) {
          const toBill = new THREE.Vector3().subVectors(m.position, pointerWorld);
          toBill.z = 0;
          const dist = toBill.length();
          if (dist < BILL_REPEL_RADIUS && dist > 0.0001) {
            const falloff = 1 - dist / BILL_REPEL_RADIUS;
            repelAccel.copy(toBill.normalize()).multiplyScalar(falloff * falloff * BILL_REPEL_STRENGTH);
          }
        }

        const dampingAccel = state.velocity.clone().multiplyScalar(-BILL_SPRING_DAMPING);

        const totalAccel = springAccel.add(repelAccel).add(dampingAccel);
        state.velocity.add(totalAccel.multiplyScalar(dt));
        m.position.add(state.velocity.clone().multiplyScalar(dt));

        const billEdgeMarginX = halfWidth * (isMobileView ? 0.2 : 0.04);
        const billEdgeMarginY = halfHeight * (isMobileView ? 0.28 : 0.04);
        const clampX = Math.max(0, halfWidth - billHalfW - billEdgeMarginX);
        const clampY = Math.max(0, halfHeight - billHalfH - billEdgeMarginY);
        m.position.x = Math.max(-clampX, Math.min(clampX, m.position.x));
        m.position.y = Math.max(-clampY, Math.min(clampY, m.position.y));

        m.rotation.x = state.baseRot.x + Math.sin(elapsed * 0.22 + state.rotSeed.x) * 0.1;
        m.rotation.y =
          state.baseRot.y + Math.sin(elapsed * 0.18 + state.rotSeed.y) * 0.18 + state.velocity.x * 0.04;
        m.rotation.z =
          state.baseRot.z + Math.sin(elapsed * 0.15 + state.rotSeed.z) * 0.12 - state.velocity.x * 0.02;

        // ---- flutter: bend the bill's surface into a gentle traveling wave,
        // like a light sheet of paper riding on air currents. Speed picks up
        // a bit when the bill is moving fast (e.g. just repelled), since a
        // bill flutters more when it's been flicked through the air.
        const speedForFlutter = state.velocity.length();
        const waveTime = elapsed * state.waveSpeed;
        const flutterBoost = 1 + Math.min(speedForFlutter, 3) * 0.25;
        const amp = state.waveAmplitude * flutterBoost;

        const basePositions = state.geometry.userData.basePositions;
        const posAttr = state.geometry.attributes.position;
        const count = posAttr.count;
        for (let vi = 0; vi < count; vi++) {
          const bx = basePositions[vi * 3];
          const by = basePositions[vi * 3 + 1];
          // two overlapping waves (different frequency/direction) so it reads
          // as a soft organic ripple rather than one mechanical sine sheet
          const wave1 = Math.sin(bx * 2.4 + waveTime + state.waveSeed) * amp;
          const wave2 = Math.sin(by * 1.7 - waveTime * 0.7 + state.waveSeed2) * amp * 0.5;
          posAttr.setZ(vi, wave1 + wave2);
        }
        posAttr.needsUpdate = true;
        state.geometry.computeVertexNormals();
      });

      renderer.render(scene, camera);
    }

    animate();

    // ---------- Cleanup on unmount ----------
    return () => {
      isDisposed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearTimeout(hydrationSafetyTimer);

      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      disposableGeometries.forEach((g) => g.dispose());
      disposableMaterials.forEach((m) => m.dispose());
      disposableTextures.forEach((t) => t.dispose());

      renderer.dispose();
      if (renderer.domElement.parentNode === wrap) {
        wrap.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        // Hard CSS wall. Even if anything inside the 3D scene were to drift
        // past the wrap's bounds (e.g. due to a wrong canvas style fallback
        // in another browser engine), the browser will clip it here. This is
        // the belt to setSize's suspenders.
        overflow: "hidden",
      }}
    />
  );
}
