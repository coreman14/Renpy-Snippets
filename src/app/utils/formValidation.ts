//Modified from https://github.com/a-r-d/url-safe-string/blob/master/url-safe-string.js
export function formatVanityURLPath(vanityLink: string) {

    const maxLen = 100;
    const joinString = '-'
    const regexRemovePattern = /((?!([a-z0-9])).)/gi; //matches opposite of [a-z0-9]
    const reJoinString = new RegExp(joinString + "+", "g"); // e.g. - may be: '-', '_', '#'

    vanityLink = vanityLink.trim().replace(/\s/g, joinString).toLowerCase();

    // Regex away anything "unsafe", but ignore the join string!
    vanityLink = vanityLink.replace(regexRemovePattern, function (match) {
        if (match === joinString) return match;

        return "";
    });

    // Truncate in excess of maxLen
    if (vanityLink.length > maxLen) {
        vanityLink = vanityLink.substring(0, maxLen);
    }

    // Remove any duplicates of the join string using this pattern: /<join string>+/g
    vanityLink = vanityLink.replace(reJoinString, joinString);

    return vanityLink;
}
