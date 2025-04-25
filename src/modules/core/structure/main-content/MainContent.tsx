import { MainContentProps } from "./types/main-content.types";

export function MainContent({ children }: MainContentProps) {
    return (
        <main
            className="flex-1 p-6 bg-gray-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
            {children}
        </main>
    );
}