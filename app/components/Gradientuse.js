import ShaderShowcase from "@/app/components/Gradient";

export default function Gradient() {
  return (
    <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
      <ShaderShowcase />
    </div>
  );
}
