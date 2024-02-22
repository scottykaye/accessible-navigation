import React from 'react';
export declare class KeyboardNav {
    readonly orientation?: 'vertical' | 'horizontal';
    observers: Record<string, HTMLElement>;
    constructor(orientation?: 'vertical' | 'horizontal');
    view(): void;
    subscribe(label: string, element: HTMLElement): void;
    unsubscribe(label: string): void;
    update(event: KeyboardEvent, current: string): void;
}
export declare function createKeyboardNavHook(instance: KeyboardNav): (label: string, parentRef?: React.MutableRefObject<HTMLElement>) => (node: HTMLElement) => void;
