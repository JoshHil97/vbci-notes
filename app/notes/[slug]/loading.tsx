export default function Loading() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", paddingTop: 24 }}>
      <div style={{ opacity: 0.7 }}>Loading sermon…</div>
      <div style={{ height: 12 }} />
      <div style={{ height: 22, width: "60%", background: "rgba(255,255,255,0.08)", borderRadius: 8 }} />
      <div style={{ height: 10 }} />
      <div style={{ height: 14, width: "30%", background: "rgba(255,255,255,0.08)", borderRadius: 8 }} />
      <div style={{ height: 18 }} />
      <div style={{ height: 360, width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: 12 }} />
    </div>
  );
}
