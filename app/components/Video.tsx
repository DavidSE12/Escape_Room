// components/SimpleVideo.tsx
export default function SimpleVideo({ src }: { src: string }) {
  return (
    <video
      src={src}
      controls
      className="w-full max-w-4xl mx-auto rounded-lg"
      preload="metadata"
      playsInline
    />
  );
}
