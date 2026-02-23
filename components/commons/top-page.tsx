import { FunctionComponent, HtmlHTMLAttributes } from "react";
import { LucideAArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";



interface TopPageProps extends HtmlHTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    icon?: typeof LucideAArrowDown;

}

const TopPage: FunctionComponent<TopPageProps> = ({title, description, className, children, icon, style}) => {
    const Icon = icon;
    return (
        <div className={cn(`
            flex flex-row items-center 
        `, className)} style={style}>
            <div className="flex-1">
                <div className="w-full flex flex-row">
                    {
                        Icon &&
                        <span className="rounded-full p-2 border border-foreground mr-2 active:border-primary">
                            <Icon className="w-5 h-5" />
                        </span>

                    }
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight">{title}</h1>
                </div>
                {
                    description &&
                    <p className="text-sm lg:text-base text-muted-foreground text-pretty">{description}</p>
                }
            </div>
            {
                children &&
                <div className="w-auto">
                    {children}
                </div>
            }
        </div>
    );
}

const Variant = {
    default: "text-lg",
    light: "font-light text-lg",
    "bold-min": "font-bold",
    "light-min": "font-light",
    title: "text-base md:text-lg lg:text-xl font-bold",
    modal: "leading-none font-semibold mb-2",
}

const VariatDescription = {
    default: "text-muted-foreground text-pretty",
    modal: "text-muted-foreground text-sm"
}

interface TopCardProps extends TopPageProps {
    title: string;
    description?: string;
    icon?: typeof LucideAArrowDown;
    variant?: keyof typeof Variant;
    marginLess?: boolean

}

export const TopCard: FunctionComponent<TopCardProps> = ({
    title, description, className, icon, variant, marginLess
}) => {
    const Icon = icon;
    return (
        <div className={cn(marginLess?"mb-0":"mb-3", className)}>
            <div className="w-full flex flex-row">
                {
                    Icon &&
                    <span className="rounded-full p-2 border border-foreground mr-2 active:border-primary">
                        <Icon className="w-5 h-5" />
                    </span>

                }
                <h1 className={cn(Variant[variant||"default"], "")}>{title}</h1>
            </div>
            {
                description &&
                <p className={(VariatDescription as any)[String(variant)||"default"]}>{description}</p>
            }
        </div>
    );
}

export default TopPage;