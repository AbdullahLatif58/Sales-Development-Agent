import { Tokenizer } from "@huggingface/tokenizers";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokenizerPath = path.resolve(
  __dirname,
  "../../../assets/tokenizer/tokenizer.json"
);

const configPath = path.resolve(
  __dirname,
  "../../../assets/tokenizer/tokenizer_config.json"
);

export async function createQwenTokenizer(): Promise<Tokenizer> {
  const [tokenizerFile, configFile] = await Promise.all([
    fs.readFile(tokenizerPath, "utf-8"),
    fs.readFile(configPath, "utf-8"),
  ]);

  const tokenizerJson = JSON.parse(tokenizerFile);
  const configJson = JSON.parse(configFile);

  return new Tokenizer(tokenizerJson, configJson);
}
