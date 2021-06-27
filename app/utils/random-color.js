export const createRandomColor = () => {
    const letters = '0123456789ABCDE';
    const color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 15)];
    }
    return color;
}