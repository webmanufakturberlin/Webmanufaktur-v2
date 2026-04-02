import { cn } from "../../utils";
import { Sparkles, Brain, ShoppingBag } from "lucide-react";
import { useStore } from "../../store";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-[#09090B]" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-[#09090B]",
  titleClassName = "text-[#09090B]",
}: DisplayCardProps) {
  const { setCursorState } = useStore();

  return (
    <div
      onMouseEnter={() => setCursorState('hover')}
      onMouseLeave={() => setCursorState('default')}
      className={cn(
        "relative flex h-48 w-[26rem] -skew-y-[4deg] select-none flex-col justify-between rounded-2xl border border-black/5 bg-white/60 backdrop-blur-xl px-6 py-5 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-[#FAFAFA]/50 after:to-transparent after:content-[''] hover:border-black/10 hover:bg-white/90 [&>*]:flex [&>*]:items-center [&>*]:gap-3 shadow-sm",
        className
      )}
    >
      <div>
        <span className="relative inline-flex items-center justify-center rounded-full bg-[#F3F4F6] p-2">
          {icon}
        </span>
        <p className={cn("text-xl font-medium tracking-tight font-sans", titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-lg font-sans text-black/70">{description}</p>
      <p className="text-black/40 font-mono text-xs uppercase tracking-widest">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      icon: <Sparkles className="size-4 text-[#6366f1]" />,
      title: "Spatial Web Design",
      description: "Immersive 3D-Erlebnisse",
      date: "Three.js · WebGL · R3F",
      iconClassName: "text-[#6366f1]",
      titleClassName: "text-[#09090B]",
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Brain className="size-4 text-[#8b5cf6]" />,
      title: "KI-Integration",
      description: "Intelligente Systeme",
      date: "OpenAI · Langchain · Python",
      iconClassName: "text-[#8b5cf6]",
      titleClassName: "text-[#09090B]",
      className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <ShoppingBag className="size-4 text-[#a855f7]" />,
      title: "Premium E-Commerce",
      description: "Shops die konvertieren",
      date: "Next.js · Shopify · Stripe",
      iconClassName: "text-[#a855f7]",
      titleClassName: "text-[#09090B]",
      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
