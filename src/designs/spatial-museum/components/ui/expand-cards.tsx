import { useState } from "react";
import { useStore } from "../../store";

const defaultImages = [
  "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1000&auto=format&fit=crop",
];

export default function ExpandOnHover({ images = defaultImages }: { images?: string[] }) {
  const [expandedImage, setExpandedImage] = useState(2);
  const { setCursorState } = useStore();

  const getImageWidth = (index: number) =>
    index === expandedImage ? "32rem" : "6rem";

  return (
    <div className="w-full flex items-center justify-center p-2 transition-all duration-300 ease-in-out">
      <div className="flex w-full items-center justify-center gap-2">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="relative cursor-none overflow-hidden rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              width: getImageWidth(idx + 1),
              height: "36rem",
            }}
            onMouseEnter={() => {
              setExpandedImage(idx + 1);
              setCursorState('hover');
            }}
            onMouseLeave={() => setCursorState('default')}
          >
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply z-10 transition-opacity duration-500" style={{ opacity: expandedImage === idx + 1 ? 0 : 1 }} />
            <img
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              src={src}
              alt={`Exhibition ${idx + 1}`}
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
