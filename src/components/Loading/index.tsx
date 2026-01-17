import { Loader } from "lucide-react";

export function Loading() {

    return (
        <div className="flex flex-col items-center justify-center h-[79vh] gap-2">
            <Loader
                className="animate-spin"
                size={24}
                style={{
                    color: '#6269f7',
                    animationDuration: `${[1.5, 2.5, 5][Math.floor(Math.random() * 3)]}s`
                }}
            />
            <label
                style={{
                    color: '#6269f7'
                }}
            >
                Carregando...
            </label>
        </div>
    )
}