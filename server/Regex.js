export function extractName(text) {
  const nameRegex = /Name \s*(\w+\s\w+)/;
  const nameRegex2 = /Name:\s*([A-Za-z\s]+)/;
  let match = text.match(nameRegex2);
  if (!match) {
    match = text.match(nameRegex);
  }
  return match ? match[1] : null;
}

export function extractDocumentNumber(text) {
  const docNumberRegex2 = /[A-Z]{2}\d{2}\s*\d{11}/;
  const match = text.match(docNumberRegex2);
  return match ? match[0] : null;
}

export function extractExpirationDate(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  function extractFollowingDate(lines, keyword) {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(keyword)) {
        const nextLineWords = lines[i + 1]?.split(" ") || [];

        const dates = nextLineWords.filter((word) => dateRegex.test(word));
        return dates[1] || null;
      }
    }
    return null;
  }

  const expirationDate = extractFollowingDate(lines, "Issue Date");
  return expirationDate;
}
