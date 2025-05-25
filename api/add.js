import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { daemon, person, theme, law, entry, tags } = req.body;

  try {
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.DATABASE_ID,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: `${person} — ${theme.join(", ")} [${daemon}]`,
              },
            },
          ],
        },
        Date: {
          date: {
            start: new Date().toISOString(),
          },
        },
        Daemon: {
          multi_select: [{ name: daemon }],
        },
        "Person(s)": {
          multi_select: [{ name: person }],
        },
        Theme: {
          multi_select: theme.map((t) => ({ name: t })),
        },
        "Law Invoked": {
          multi_select: law.map((l) => ({ name: l })),
        },
        Tags: {
          multi_select: tags.map((t) => ({ name: t })),
        },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: entry,
                },
              },
            ],
          },
        },
      ],
    });

    return res.status(200).json({ success: true, message: "Codex entry added", response });
  } catch (error) {
    console.error("Error adding to Codex:", error);
    return res.status(500).json({ error: "Failed to add Codex entry" });
  }
}
