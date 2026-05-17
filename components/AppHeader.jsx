import React from 'react';
import { Button } from './UI';

export const AppHeader = ({ hasRequest, onAddClick, onDeleteClick }) => {
    return (
        <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
                        <div className="icon-arrow-left-right text-lg"></div>
                    </div>
                    <span className="font-bold text-lg text-gray-900 tracking-tight">بديلي</span>
                </div>
                
                <div>
                    {hasRequest ? (
                        <Button variant="danger" size="sm" onClick={onDeleteClick} className="rounded-lg gap-1.5 font-semibold">
                            <div className="icon-trash-2 text-xs"></div>
                            حذف طلبي
                        </Button>
                    ) : (
                        <Button variant="primary" size="sm" onClick={onAddClick} className="rounded-lg gap-1.5 font-semibold">
                            <div className="icon-plus text-xs"></div>
                            سجّل طلبك
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};
