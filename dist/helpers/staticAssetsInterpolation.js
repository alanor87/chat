/** Injecting backend variables into static files assets before giving these assets to client.  */
export function staticAssetsInterpolation(stringToReplace, asset) {
    const replacement = process.env[stringToReplace];
    return asset.replace(`{${stringToReplace}}`, replacement);
}
