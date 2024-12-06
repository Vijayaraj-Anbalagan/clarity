const fs = require("fs");
const pdfParse = require("pdf-parse");

async function parsePDF(filePath) {
  const buffer = fs.readFileSync(filePath);

  // Parse the PDF
  const data = await pdfParse(buffer);

  // Extract text and split into sections
  const text = data.text;
  const sections = text.split(/\n\s*\d+\.\s+/); // Split by numbered sections (e.g., 1., 2., 3.)

  const chunks = [];
  let page = 1;

  sections.forEach((section, index) => {
    // Further split sections into meaningful chunks (e.g., by lines or subheadings)
    const lines = section.split("\n");

    // Derive metadata
    const sectionTitle = lines[0]?.trim() || `Section ${index + 1}`;
    const keywords = sectionTitle.split(" "); // Basic keyword extraction
    const content = lines.slice(1).join(" ").trim(); // Content excluding title

    if (content) {
      chunks.push({
        id: `${sectionTitle.replace(/\s+/g, "_")}_p${page}`,
        metadata: {
          section: sectionTitle,
          topic: sectionTitle,
          page: page,
          keywords: keywords,
        },
        document: content,
      });
    }

    page += 1; // Increment page (modify based on real page extraction)
  });

  return chunks;
}

(async () => {
  const filePath = "./hr.pdf";
  const chunks = await parsePDF(filePath);

  // Prepare final format
  const ids = chunks.map((chunk) => chunk.id);
  const metadatas = chunks.map((chunk) => chunk.metadata);
  const documents = chunks.map((chunk) => chunk.document);

  const formattedData = {
    ids,
    metadatas,
    documents,
  };

  console.log(JSON.stringify(formattedData, null, 2));
})();
