/* eslint-disable react/no-unknown-property */
"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

extend({ MeshLineGeometry, MeshLineMaterial });

// Next.js: serve from /public (Vite would import these as modules)
const cardGLB = "/lanyard/card.glb";
const lanyard = "/lanyard/lanyard.png";

const BLANK_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

const CARD_GROUP_Y = -1.2;
const CARD_GROUP_Z = -0.05;
const CARD_GROUP_SCALE = 2.55;
/** Clip height in the GLB (pre-scale). Keeps strap + spherical joint on the metal hook. */
const CLIP_MESH_Y = 1.2;
const CLIP_JOINT_Y = CARD_GROUP_Y + CLIP_MESH_Y * CARD_GROUP_SCALE;

export default function Lanyard({
  position = [0, 0, 20],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 0.45,
  offset = [0, 0, 0],
  ropeLength = 0.78,
  /** "founder" paints navy card faces with portrait + name / logo back */
  cardLayout = "default",
}) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position, fov }}
          dpr={[1, isMobile ? 1.5 : 2]}
          gl={{ alpha: transparent }}
          onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
        >
          <ambientLight intensity={1.1} />
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
              offset={offset}
              ropeLength={ropeLength}
              cardLayout={cardLayout}
            />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={0.9}
              color="#e8eef8"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={1.2}
              color="#dce4f2"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={1.2}
              color="#dce4f2"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3.5}
              color="#c8d0e0"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Canvas>
      </Suspense>
    </div>
  );
}

function Band({
  maxSpeed = 22,
  minSpeed = 4,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 0.45,
  offset = [0, 0, 0],
  ropeLength = 0.78,
  cardLayout = "default",
}) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const vec = useRef(new THREE.Vector3()).current;
  const ang = useRef(new THREE.Vector3()).current;
  const rot = useRef(new THREE.Vector3()).current;
  const dir = useRef(new THREE.Vector3()).current;
  const target = useRef(new THREE.Vector3()).current;
  const clipAttach = useRef(new THREE.Vector3()).current;
  const clipQuat = useRef(new THREE.Quaternion()).current;

  // Generous reach in any direction — still capped so the strap can't explode
  const maxDragRadius = Math.max(5.8, ropeLength * 7.8);

  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 6,
    linearDamping: 6,
  };

  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyardImage || lanyard);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);
  const logoTex = useTexture("/logo.webp");

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    if (!frontImage && !backImage && cardLayout !== "founder") return baseMap;

    const baseImg = baseMap.image;
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return baseMap;
    ctx.drawImage(baseImg, 0, 0, W, H);

    const roundRect = (x, y, w, h, r) => {
      const radius = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    };

    const paintFace = (rect, paint) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      paint(rx, ry, rw, rh);
      ctx.restore();
    };

    if (cardLayout === "founder") {
      paintFace(FRONT_UV_RECT, (rx, ry, rw, rh) => {
        // Outer plastic rim — muted so it doesn’t read as a white wash
        ctx.fillStyle = "#9AA3B8";
        ctx.fillRect(rx, ry, rw, rh);

        const pad = rw * 0.045;
        const innerX = rx + pad;
        const innerY = ry + pad;
        const innerW = rw - pad * 2;
        const innerH = rh - pad * 2;
        const corner = rw * 0.04;

        // Soft shadow under panel
        ctx.fillStyle = "rgba(5, 10, 28, 0.35)";
        roundRect(innerX + 2, innerY + 3, innerW, innerH, corner);
        ctx.fill();

        // Navy face panel — slightly deeper than brand navy
        ctx.fillStyle = "#12245F";
        roundRect(innerX, innerY, innerW, innerH, corner);
        ctx.fill();

        // Inner cream border
        ctx.strokeStyle = "rgba(255, 244, 224, 0.35)";
        ctx.lineWidth = Math.max(2, rw * 0.01);
        roundRect(innerX + rw * 0.025, innerY + rh * 0.025, innerW - rw * 0.05, innerH - rh * 0.05, corner * 0.7);
        ctx.stroke();

        // Hairline outer edge on navy
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = Math.max(1, rw * 0.004);
        roundRect(innerX + 1, innerY + 1, innerW - 2, innerH - 2, corner);
        ctx.stroke();

        const cx = rx + rw * 0.5;
        const cy = ry + rh * 0.28;
        const radius = Math.min(rw, rh) * 0.275;

        // Photo ring + portrait
        ctx.beginPath();
        ctx.arc(cx, cy, radius + rw * 0.012, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 244, 224, 0.55)";
        ctx.fill();

        if (frontImage && frontTex.image) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          const img = frontTex.image;
          const scale = Math.max((radius * 2) / img.width, (radius * 2) / img.height);
          const dw = img.width * scale;
          const dh = img.height * scale;
          ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
          ctx.restore();
        }

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 244, 224, 0.7)";
        ctx.lineWidth = Math.max(2, rw * 0.01);
        ctx.stroke();

        ctx.fillStyle = "#E8DCC4";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.font = `500 ${Math.round(rh * 0.036)}px Arial, sans-serif`;
        ctx.fillText("founder", cx, cy + radius + rh * 0.06);

        ctx.fillStyle = "#F2F2F2";
        ctx.font = `700 ${Math.round(rh * 0.056)}px Arial, sans-serif`;
        ctx.fillText("Divya Chauhan", cx, cy + radius + rh * 0.115);

        // Logo under name
        const logoImg = logoTex?.image || (backImage && backTex.image);
        if (logoImg) {
          const maxW = rw * 0.58;
          const maxH = rh * 0.15;
          const scale = Math.min(maxW / logoImg.width, maxH / logoImg.height);
          const dw = logoImg.width * scale;
          const dh = logoImg.height * scale;
          ctx.drawImage(logoImg, cx - dw / 2, cy + radius + rh * 0.145, dw, dh);
        }

        ctx.fillStyle = "rgba(232, 220, 196, 0.65)";
        ctx.font = `400 ${Math.round(rh * 0.028)}px Arial, sans-serif`;
        ctx.fillText("@ copyright stelora media", cx, ry + rh * 0.92);
      });

      paintFace(BACK_UV_RECT, (rx, ry, rw, rh) => {
        ctx.fillStyle = "#9AA3B8";
        ctx.fillRect(rx, ry, rw, rh);

        const pad = rw * 0.045;
        const corner = rw * 0.04;
        ctx.fillStyle = "rgba(5, 10, 28, 0.35)";
        roundRect(rx + pad + 2, ry + pad + 3, rw - pad * 2, rh - pad * 2, corner);
        ctx.fill();

        ctx.fillStyle = "#12245F";
        roundRect(rx + pad, ry + pad, rw - pad * 2, rh - pad * 2, corner);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 244, 224, 0.35)";
        ctx.lineWidth = Math.max(2, rw * 0.01);
        roundRect(
          rx + pad + rw * 0.025,
          ry + pad + rh * 0.025,
          rw - pad * 2 - rw * 0.05,
          rh - pad * 2 - rh * 0.05,
          corner * 0.7
        );
        ctx.stroke();

        const img = (backImage && backTex.image) || logoTex?.image;
        if (img) {
          const maxW = rw * 0.68;
          const maxH = rh * 0.44;
          const scale = Math.min(maxW / img.width, maxH / img.height);
          const dw = img.width * scale;
          const dh = img.height * scale;
          ctx.drawImage(img, rx + (rw - dw) / 2, ry + (rh - dh) / 2, dw, dh);
        }
      });
    } else {
      const drawFitted = (img, rect) => {
        const rx = rect.x * W;
        const ry = rect.y * H;
        const rw = rect.w * W;
        const rh = rect.h * H;
        const pick = imageFit === "contain" ? Math.min : Math.max;
        const scale = pick(rw / img.width, rh / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = rx + (rw - dw) / 2;
        const dy = ry + (rh - dh) / 2;
        ctx.save();
        ctx.beginPath();
        ctx.rect(rx, ry, rw, rh);
        ctx.clip();
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
      };

      if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT);
      if (backImage && backTex.image) drawFitted(backTex.image, BACK_UV_RECT);
    }

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, logoTex, materials.base.map, cardLayout]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ropeLength]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ropeLength]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ropeLength]);
  // Anchor on the metal clip/hook (scaled with the card group)
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CLIP_JOINT_Y, CARD_GROUP_Z],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);

    if (dragged && card.current && fixed.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      target.set(vec.x - dragged.x, vec.y - dragged.y, vec.z - dragged.z);

      // Allow free movement in any direction, only soft-limit extreme pulls
      const anchor = fixed.current.translation();
      const dx = target.x - anchor.x;
      const dy = target.y - anchor.y;
      const dz = target.z - anchor.z;
      const dist = Math.hypot(dx, dy, dz);
      if (dist > maxDragRadius && dist > 0.0001) {
        const scale = maxDragRadius / dist;
        target.set(anchor.x + dx * scale, anchor.y + dy * scale, anchor.z + dz * scale);
      }

      // Mild depth clamp only — still lets the card move toward/away a bit
      target.z = THREE.MathUtils.clamp(target.z, -1.2, 1.2);

      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: target.x,
        y: target.y,
        z: target.z,
      });
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      const smoothJoint = (ref) => {
        const pos = ref.current.translation();
        if (!Number.isFinite(pos.x + pos.y + pos.z)) return;
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(pos);
          return;
        }
        const gap = ref.current.lerped.distanceTo(pos);
        const clampedDistance = Math.max(0.05, Math.min(1, gap));
        const speed = minSpeed + clampedDistance * (maxSpeed - minSpeed);
        ref.current.lerped.lerp(pos, Math.min(1, dt * speed));
      };

      smoothJoint(j1);
      smoothJoint(j2);

      const p1 = j2.current.lerped || j2.current.translation();
      const p2 = j1.current.lerped || j1.current.translation();
      const p3 = fixed.current.translation();

      // Pin strap end to the clip/hook in card space (matches spherical joint + mesh scale)
      const cardT = card.current.translation();
      const cardR = card.current.rotation();
      clipQuat.set(cardR.x, cardR.y, cardR.z, cardR.w);
      clipAttach.set(0, CLIP_JOINT_Y, CARD_GROUP_Z).applyQuaternion(clipQuat).add(cardT);

      if (
        ![clipAttach, p1, p2, p3].every(
          (p) => Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.z)
        )
      ) {
        return;
      }

      curve.points[0].copy(clipAttach);
      curve.points[1].set(p1.x, p1.y, p1.z);
      curve.points[2].set(p2.x, p2.y, p2.z);
      curve.points[3].copy(p3);

      // Soft visual clamp on the strap curve only (does not block card motion)
      for (let i = 1; i < curve.points.length; i += 1) {
        const prev = curve.points[i - 1];
        const curr = curve.points[i];
        const gap = prev.distanceTo(curr);
        const limit = ropeLength * 2.4;
        if (gap > limit) {
          curr.lerpVectors(prev, curr, limit / gap);
        }
      }

      band.current.geometry.setPoints(curve.getPoints(isMobile ? 12 : 24));

      if (!dragged) {
        ang.copy(card.current.angvel());
        rot.copy(card.current.rotation());
        card.current.setAngvel({
          x: ang.x * 0.98,
          y: ang.y - rot.y * 0.22,
          z: ang.z * 0.98,
        });
      }
    }
  });

  curve.curveType = "centripetal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[offset[0], 3.35 + (offset[1] || 0), offset[2] || 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[ropeLength * 0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[ropeLength, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[ropeLength * 1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[ropeLength * 2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={CARD_GROUP_SCALE}
            position={[0, CARD_GROUP_Y, CARD_GROUP_Z]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerCancel={() => drag(false)}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={0.15}
                clearcoatRoughness={0.65}
                roughness={0.78}
                metalness={0.04}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} renderOrder={-1}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest
          depthWrite={false}
          transparent
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(cardGLB);
