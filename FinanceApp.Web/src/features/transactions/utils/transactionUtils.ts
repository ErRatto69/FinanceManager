export const canModifyOrDeleteTransaction = (
    isPaid: boolean,
    paidDate?: string | null
): boolean => {
    if (!isPaid || !paidDate) {
        return true;
    }

    const parts = paidDate.split('-');
    if (parts.length < 2) return true;

    const paidYear = parseInt(parts[0], 10);
    const paidMonth = parseInt(parts[1], 10);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return paidYear === currentYear && paidMonth === currentMonth;
};