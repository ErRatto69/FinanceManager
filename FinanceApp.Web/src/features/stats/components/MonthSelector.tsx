import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface MonthSelectorProps {
    month: number;
    year: number;
    onChange: (month: number, year: number) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({ month, year, onChange }) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerYear, setPickerYear] = useState(year);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const shortMonthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const handlePrev = () => {
        if (month === 1) {
            onChange(12, year - 1);
        } else {
            onChange(month - 1, year);
        }
    };

    const handleNext = () => {
        if (month === 12) {
            onChange(1, year + 1);
        } else {
            onChange(month + 1, year);
        }
    };

    const handleCurrentMonth = () => {
        const now = new Date();
        onChange(now.getMonth() + 1, now.getFullYear());
    };

    const handleOpenPicker = () => {
        setPickerYear(year);
        setIsPickerOpen(true);
    };

    const handleSelectMonth = (mIndex: number) => {
        onChange(mIndex + 1, pickerYear);
        setIsPickerOpen(false);
    };

    return (
        <>
            <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                    variant="secondary"
                    onClick={handleCurrentMonth}
                    className="text-xs py-1.5 px-2.5 hidden sm:inline-flex"
                    title="Jump to current month"
                >
                    <Calendar className="w-3.5 h-3.5" />
                    Today
                </Button>

                <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 sm:p-1 shadow-xs">
                    <button
                        onClick={handlePrev}
                        className="p-1 sm:p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Previous month"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handleOpenPicker}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white min-w-[110px] sm:min-w-[130px] text-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Click to select month and year"
                    >
                        {monthNames[month - 1]} {year}
                    </button>

                    <button
                        onClick={handleNext}
                        className="p-1 sm:p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Next month"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Popup selettore rapido con z-[60] */}
            {isPickerOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
                    onClick={() => setIsPickerOpen(false)}
                >
                    <div
                        className="w-full max-w-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPickerYear((y) => y - 1)}
                                    className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {pickerYear}
                </span>
                                <button
                                    onClick={() => setPickerYear((y) => y + 1)}
                                    className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => setIsPickerOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {shortMonthNames.map((name, index) => {
                                const isSelected = month === index + 1 && year === pickerYear;
                                return (
                                    <button
                                        key={name}
                                        onClick={() => handleSelectMonth(index)}
                                        className={`py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                                            isSelected
                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};