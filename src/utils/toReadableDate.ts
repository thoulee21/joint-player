export function toReadableDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString();
}
