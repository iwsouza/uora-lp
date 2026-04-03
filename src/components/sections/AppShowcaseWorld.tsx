"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { motion, MotionValue, useMotionValueEvent } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Html, Environment } from "@react-three/drei";
import * as THREE from "three";
import type { AppShowcaseWorldProps } from "./AppShowcaseWorldProps";
import {
  TransactionBrandIcon,
  type TransactionLogoId,
} from "./transactionBrandIcons";

const SCREEN = {
  position: [0, 0, 0.195] as [number, number, number],
  scale: 0.00573,
  width: 390,
  height: 844,
  radius: 44,
};

/** Desloca o telefone no eixo Y (mundo) para centralizar na viewport; valor negativo = mais baixo na tela */
const PHONE_SCENE_OFFSET_Y = -0.22;

function useMotionValueState(value: MotionValue<number>): number {
  const [state, setState] = useState(value.get());
  useMotionValueEvent(value, "change", (v) => setState(v));
  return state;
}

const conversation = [
  {
    from: "user",
    text: "Eu não sei nem por onde começar e quero saber onde tô perdendo dinheiro",
  },
  {
    from: "ai",
    text: "Calma! Vou analisar tudo pra você. Vi que você conectou 3 bancos. Com isso, já encontrei alguns padrões...",
  },
  {
    from: "ai",
    text: "Você gastou R$571 em assinaturas este mês. Isso é 72% acima da média de uma pessoa normal. Quer que eu crie um plano pra te mostrar onde você está perdendo errando?",
  },
  { from: "user", text: "Sim" },
  {
    from: "user",
    text: "Também quero saber como tá a minha carteira de investimentos",
  },
  {
    from: "ai",
    text: "Seu patrimônio cresceu 2.4% este mês",
  },
  {
    from: "ai",
    text: "Estou preparando um resumo completo pra você",
  },
  {
    from: "ai",
    text: "Só um momento",
  },
];

/** Partes do total de gastos no mock (%) — deve somar 100 */
const CATEGORY_SHARES = {
  moradia: 28,
  alimentacao: 18,
  assinaturas: 22,
  transporte: 12,
  lazer: 10,
  outros: 10,
} as const;

const categories = [
  { name: "Moradia", pct: CATEGORY_SHARES.moradia, color: "bg-emerald-500" },
  {
    name: "Alimentação",
    pct: CATEGORY_SHARES.alimentacao,
    color: "bg-blue-500",
  },
  {
    name: "Assinaturas",
    pct: CATEGORY_SHARES.assinaturas,
    color: "bg-cyan-500",
  },
  {
    name: "Transporte",
    pct: CATEGORY_SHARES.transporte,
    color: "bg-violet-500",
  },
  { name: "Lazer", pct: CATEGORY_SHARES.lazer, color: "bg-amber-500" },
  { name: "Outros", pct: CATEGORY_SHARES.outros, color: "bg-rose-400" },
];

type TransactionItem = {
  name: string;
  val: string;
  positive: boolean;
  cat?: string;
  logo?: TransactionLogoId;
};

const transactions: TransactionItem[] = [
  { name: "Salário", val: "+ R$ 5.200", cat: "💰", positive: true },
  {
    name: "Netflix",
    val: "- R$ 39,90",
    positive: false,
    logo: "netflix",
  },
  {
    name: "Max",
    val: "- R$ 34,90",
    positive: false,
    logo: "max",
  },
  {
    name: "Disney+",
    val: "- R$ 27,90",
    positive: false,
    logo: "disneyplus",
  },
  {
    name: "Spotify",
    val: "- R$ 21,90",
    positive: false,
    logo: "spotify",
  },
  {
    name: "Prime Video",
    val: "- R$ 14,90",
    positive: false,
    logo: "primevideo",
  },
  {
    name: "iFood",
    val: "- R$ 42,90",
    positive: false,
    logo: "ifood",
  },
  {
    name: "Uber",
    val: "- R$ 23,50",
    positive: false,
    logo: "uber",
  },
  {
    name: "Nubank",
    val: "- R$ 189,00",
    positive: false,
    logo: "nubank",
  },
];

function ChatScreen({ progress }: { progress: number }) {
  const visibleCount = Math.min(
    conversation.length,
    Math.floor(progress * 10) + 1,
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-muted">
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-[9px] font-semibold text-foreground/60">
          9:41
        </span>
        <div className="flex gap-1">
          <div className="w-3.5 h-1.5 rounded-sm bg-foreground/20" />
        </div>
      </div>

      <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
          <span className="text-[10px] font-bold text-background">U</span>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-foreground">Uora</p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-positive" />
            <span className="text-[9px] text-muted-foreground">online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-3 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-neutral-200 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%]">
            <p className="text-[11px] text-foreground leading-relaxed">
              Olá! Eu sou a Ora sua inteligência financeira. Como posso te
              ajudar?
            </p>
          </div>
        </motion.div>

        {conversation.slice(0, visibleCount).map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={msg.from === "user" ? "flex justify-end" : ""}
          >
            <div
              className={`px-4 py-2.5 max-w-[85%] ${
                msg.from === "user"
                  ? "bg-foreground text-background rounded-2xl rounded-br-md"
                  : "bg-neutral-200 rounded-2xl rounded-bl-md"
              }`}
            >
              <p
                className={`text-[11px] leading-relaxed ${msg.from === "user" ? "text-background" : "text-foreground"}`}
              >
                {msg.text}
              </p>
            </div>
          </motion.div>
        ))}

        {visibleCount < conversation.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1 px-1"
          >
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="w-1.5 h-1.5 rounded-full bg-foreground/25"
                animate={{ y: [0, -4, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  delay: d * 0.15,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      <div className="px-4 pb-5 pt-2">
        <div className="bg-card rounded-full px-4 py-2.5 flex items-center justify-between border border-border">
          <span className="text-[10px] text-muted-foreground">
            Pergunte qualquer coisa...
          </span>
          <span className="text-muted-foreground text-xs">↑</span>
        </div>
      </div>
    </div>
  );
}

function DashboardScreen({ progress }: { progress: number }) {
  const show = progress > 0.1;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-muted">
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-[9px] font-semibold text-foreground/60">
          9:41
        </span>
      </div>

      <div className="px-5 py-3">
        <p className="text-[10px] text-muted-foreground font-medium">
          Olá, você 👋
        </p>
      </div>

      <motion.div
        className="mx-4 rounded-2xl bg-foreground p-4 mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <p className="text-[9px] text-background/50 mb-0.5">Saldo total</p>
        <p className="text-lg font-bold text-background tracking-tight">
          R$ 12.847,30
        </p>
        <p className="text-[9px] text-green-positive font-medium mt-0.5">
          +R$ 1.240 este mês ↑
        </p>
      </motion.div>

      <motion.div
        className="mx-4 mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <p className="text-[9px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          Categorias
        </p>
        <div className="flex gap-0.5 h-2 rounded-full overflow-hidden mb-2">
          {categories.map((c) => (
            <motion.div
              key={c.name}
              className={`${c.color} h-full`}
              initial={{ width: 0 }}
              animate={show ? { width: `${c.pct}%` } : {}}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}
        </div>
        <div className="flex max-w-full flex-nowrap items-center gap-x-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => (
            <div
              key={c.name}
              className="flex shrink-0 items-center gap-0.5 whitespace-nowrap"
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.color}`} />
              <span className="text-[7px] text-muted-foreground">
                {c.name} {c.pct}%
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mx-4 flex-1"
        initial={{ opacity: 0, y: 10 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="text-[9px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          Recentes
        </p>
        <div className="space-y-2">
          {transactions.map((t, i) => (
            <motion.div
              key={t.name}
              className="flex items-center justify-between bg-card rounded-xl px-3 py-2"
              initial={{ opacity: 0, x: -10 }}
              animate={show ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {t.logo ? (
                  <TransactionBrandIcon
                    id={t.logo}
                    title={t.name}
                    width={14}
                    height={14}
                    className="shrink-0 rounded-[2px]"
                  />
                ) : (
                  <span className="text-xs shrink-0">{t.cat}</span>
                )}
                <span className="text-[10px] font-medium text-foreground truncate">
                  {t.name}
                </span>
              </div>
              <span
                className={`text-[10px] font-semibold ${t.positive ? "text-green-positive" : "text-foreground/70"}`}
              >
                {t.val}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="flex justify-around py-3 px-4 border-t border-border mt-2">
        {["Início", "Gastos", "Uora", "Metas"].map((t, i) => (
          <span
            key={t}
            className={`text-[9px] font-medium ${i === 0 ? "text-foreground" : "text-muted-foreground/50"}`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScreenContent({
  chatOpacity,
  dashOpacity,
  chatProgress,
  dashProgress,
}: {
  chatOpacity: MotionValue<number>;
  dashOpacity: MotionValue<number>;
  chatProgress: MotionValue<number>;
  dashProgress: MotionValue<number>;
}) {
  const cOp = useMotionValueState(chatOpacity);
  const dOp = useMotionValueState(dashOpacity);
  const cP = useMotionValueState(chatProgress);
  const dP = useMotionValueState(dashProgress);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "hsl(36 33% 97%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: cOp,
          transition: "opacity 0.05s",
        }}
      >
        <ChatScreen progress={cP} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: dOp,
          transition: "opacity 0.05s",
        }}
      >
        <DashboardScreen progress={dP} />
      </div>
    </div>
  );
}

function PhoneModel({
  scrollRef,
  children,
}: {
  scrollRef: React.MutableRefObject<number>;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF("/models/iphone.glb");

  const model = useMemo(() => {
    const clone = scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const s = 5 / Math.max(size.x, size.y, size.z);

    clone.scale.multiplyScalar(s);
    clone.position.copy(center).multiplyScalar(-s);

    clone.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((mat) => {
          if (
            mat &&
            (mat as THREE.MeshStandardMaterial).isMeshStandardMaterial
          ) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.envMapIntensity = 1.5;
            stdMat.needsUpdate = true;
          }
        });
      }
    });

    return clone;
  }, [scene]);

  const state = useRef({
    rotY: 0.45,
    rotX: -0.1,
    rotZ: -0.04,
    scale: 0.55,
    y: 0,
  });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const t = scrollRef.current;
    const speed = Math.min(delta * 5, 1);
    const lerp = THREE.MathUtils.lerp;

    let tRY: number, tRX: number, tRZ: number, tS: number, tY: number;

    if (t < 0.15) {
      const p = t / 0.15;
      tRY = lerp(0.45, 0, p);
      tRX = lerp(-0.1, 0, p);
      tRZ = lerp(-0.04, 0, p);
      tS = lerp(0.55, 0.72, p);
      tY = 0;
    } else if (t < 0.35) {
      const p = (t - 0.15) / 0.2;
      tRY = 0;
      tRX = 0;
      tRZ = 0;
      tS = lerp(0.72, 0.78, p);
      tY = lerp(0, 0.15, p);
    } else {
      tRY = 0;
      tRX = 0;
      tRZ = 0;
      tS = 0.78;
      tY = 0.15;
    }

    state.current.rotY = lerp(state.current.rotY, tRY, speed);
    state.current.rotX = lerp(state.current.rotX, tRX, speed);
    state.current.rotZ = lerp(state.current.rotZ, tRZ, speed);
    state.current.scale = lerp(state.current.scale, tS, speed);
    state.current.y = lerp(state.current.y, tY, speed);

    groupRef.current.rotation.set(
      state.current.rotX,
      state.current.rotY,
      state.current.rotZ,
    );
    groupRef.current.scale.setScalar(state.current.scale);
    groupRef.current.position.y = state.current.y;
  });

  return (
    <group ref={groupRef}>
      <primitive object={model} />
      <Html
        transform
        distanceFactor={400}
        position={SCREEN.position}
        scale={SCREEN.scale}
        style={{
          width: `${SCREEN.width}px`,
          height: `${SCREEN.height}px`,
          borderRadius: `${SCREEN.radius}px`,
          overflow: "hidden",
          pointerEvents: "none",
          backfaceVisibility: "hidden",
        }}
      >
        {children}
      </Html>
    </group>
  );
}

export default function AppShowcaseWorld({
  scrollRef,
  chatOpacity,
  dashOpacity,
  chatProgress,
  dashProgress,
}: AppShowcaseWorldProps) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas
        camera={{ fov: 28, position: [0, 0, 8.85], near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          camera.lookAt(0, -0.06, 0);
        }}
        dpr={[1, 2]}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <ambientLight intensity={0.4} color="#f5f0e8" />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.3}
          color="#ffffff"
          castShadow={false}
        />
        <directionalLight
          position={[-4, 3, 4]}
          intensity={0.4}
          color="#e8e0d8"
        />
        <pointLight position={[0, 4, -4]} intensity={0.3} color="#ffffff" />
        <pointLight position={[0, -5, 3]} intensity={0.15} color="#f0e8d8" />

        <Suspense fallback={null}>
          <Environment preset="city" environmentIntensity={0.5} />
          <group position={[0, PHONE_SCENE_OFFSET_Y, 0]}>
            <PhoneModel scrollRef={scrollRef}>
              <ScreenContent
                chatOpacity={chatOpacity}
                dashOpacity={dashOpacity}
                chatProgress={chatProgress}
                dashProgress={dashProgress}
              />
            </PhoneModel>
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/iphone.glb");
