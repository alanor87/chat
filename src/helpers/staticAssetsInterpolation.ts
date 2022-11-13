/** Injecting backend variables into static files assets before giving these assets to client.  */
export function staticAssetsInterpolation(stringToReplace: string, asset: string) {
    const replacement = (process.env[stringToReplace] as string);
return asset.replace(`{${stringToReplace}}`, replacement);
}