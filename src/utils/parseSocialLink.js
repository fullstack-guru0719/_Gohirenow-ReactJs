export function parsedSocialLink (link) {
    let newLink = '';
    if (link.includes('http')) {
        newLink = link;
    } else {
        newLink = "https://" + link;
    }
    return newLink;
}
