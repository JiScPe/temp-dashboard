export function ExtractVal(
  sentence: string,
  type: "full" | "reorder" | "critical"
) {
  let temp: RegExpMatchArray | null;
  switch (type) {
    case "full":
      temp = sentence.match(/F:\s*\d+/);
      break;
    case "reorder":
      temp = sentence.match(/R:\s*\d+/);
      break;
    case "critical":
      temp = sentence.match(/C:\s*\d+/);
      break;
    default:
      temp = [""];
      break;
  }
  if (temp) {
    return parseInt(temp[0].toString().split(" ")[1]);
  }
  return 0;
}
