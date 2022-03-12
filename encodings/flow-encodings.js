import { Write, Read } from "../reader-writer.js";
import { uint8 } from "./base-encodings.js";


export const branch = (condition, ...cases) => (rw) => {
    const conditionFormat = uint8(rw);
    if (rw instanceof Write)
        return (value) => {
            const jumpTo = condition(value);
            conditionFormat(jumpTo);
            cases[jumpTo](rw)(value);
        };
    if (rw instanceof Read)
        return () => {
            const jumpTo = conditionFormat();
            return cases[jumpTo](rw)();
        };
};
