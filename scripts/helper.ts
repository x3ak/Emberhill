export function resourceStringToObjectString(inputString: string | null | undefined): string {
    // 1. Handle empty input by returning a string for an empty array.
    if (!inputString || inputString.trim() === "") {
        return "[]";
    }

    // 2. Split the string into individual item parts.
    const itemStrings = inputString.split('|');

    // 3. Map each item string to an object string.
    const objectStrings = itemStrings.map(itemStr => {
        const [mainPart, chance] = itemStr.split('@');
        const [typeAbbr, id, amountStr] = mainPart.split(':');

        if (!typeAbbr || !id || !amountStr) {
            console.warn(`Skipping malformed item string in code generation: "${itemStr}"`);
            return null; // Will be filtered out later
        }

        const objectProperties: string[] = [];

        // Use a switch to handle different types
        switch (typeAbbr.trim()) {
            case 'res':
                objectProperties.push(`type: "resource"`);
                objectProperties.push(`id: "${id.trim()}"`);
                objectProperties.push(`amount: ${parseInt(amountStr.trim(), 10)}`);
                break;
            // Add other cases here, e.g., for 'xp'
            // case 'xp':
            //     objectProperties.push(`type: "xp"`);
            //     ...
            //     break;
            default:
                console.warn(`Unknown resource type abbreviation: "${typeAbbr}"`);
                return null;
        }


        if (chance) {
            objectProperties.push(`chance: ${parseFloat(chance.trim())}`);
        }

        // Assemble the properties into a string object: "{ prop1, prop2 }"
        return `{ ${objectProperties.join(', ')} }`;

    }).filter(Boolean); // Filter out any nulls from malformed entries

    // 4. Join the object strings with commas and wrap in array brackets.
    return `[${objectStrings.join(', ')}]`;
}