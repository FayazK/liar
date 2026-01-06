import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function debounce<TArgs extends unknown[]>(func: (...args: TArgs) => void, wait: number): (...args: TArgs) => void {
    let timeout: NodeJS.Timeout;
    return (...args: TArgs) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
