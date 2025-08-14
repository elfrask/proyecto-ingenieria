import * as LucideIcons from "lucide-react";
import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { cn } from "@/lib/utils";


export interface ButtonFloatProps {
    icon: keyof typeof LucideIcons;
    bgColor?: string;
    position?: {
        bottom?: string | number;
        right?: string | number;
        left?: string | number;
        top?: string | number;
    };
    dialogContent?: ReactNode;
    children?: ReactNode;
    size?: number;
    ariaLabel?: string;
    className?: string;
}

export default function ButtonFloat({
    icon,
    bgColor = "#2563eb",
    position = { bottom: 32, right: 32 },
    children,
    size = 56,
    ariaLabel = "Abrir diálogo",
    className
}: ButtonFloatProps) {
    const [open, setOpen] = useState(false);
    const Icon = LucideIcons[icon] as React.FC<{ size?: number; color?: string }>;

    const style: React.CSSProperties = {
        position: "fixed",
        zIndex: 50,
        borderRadius: "50%",
        width: size,
        height: size,
        color: "#fff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        ...Object.fromEntries(
            Object.entries(position).map(([k, v]) => [k, typeof v === "number" ? `${v}px` : v])
        ),
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    aria-label={ariaLabel}
                    style={style}
                    onClick={() => setOpen(true)}
                    className={cn(`
                        rounded-full text-white bg-accent 
                        flex justify-center items-center 
                        cursor-pointer
                        `, className)}
                >
                    {Icon && <Icon size={size * 0.5} color="#fff" />}
                </button>
            </DialogTrigger>
            <DialogContent className="">
                {children}
            </DialogContent>
        </Dialog>
    );
}