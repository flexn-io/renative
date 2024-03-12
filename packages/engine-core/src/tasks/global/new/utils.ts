export const checkInputValue = (value: string | boolean): boolean => {
    return value && typeof value === 'string' && value !== '' ? true : false;
};
