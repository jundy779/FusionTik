const fs = require("fs")
const path = require("path")
const JSZip = require("jszip")

const rootDir = path.resolve(__dirname, "..")
const outputZipPath = path.resolve(rootDir, "FusionTik-Source.zip")

const IGNORE_PATTERNS = [
  "node_modules",
  ".next",
  ".git",
  ".vscode",
  ".env.local",
  "tsconfig.tsbuildinfo",
  "npm-debug.log",
  "yarn-error.log",
  ".pnpm-debug.log",
  "FusionTik-Source.zip",
]

function shouldIgnore(relativePath) {
  const parts = relativePath.split(path.sep)
  return parts.some((part) => IGNORE_PATTERNS.includes(part)) || relativePath.endsWith(".zip")
}

function addDirectoryToZip(zip, currentDir, baseDir = rootDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name)
    const relativePath = path.relative(baseDir, fullPath)

    if (shouldIgnore(relativePath)) {
      continue
    }

    if (entry.isDirectory()) {
      const folderZip = zip.folder(entry.name)
      addDirectoryToZip(folderZip, fullPath, baseDir)
    } else if (entry.isFile()) {
      const content = fs.readFileSync(fullPath)
      zip.file(entry.name, content)
    }
  }
}

async function createZip() {
  console.log("📦 Creating clean FusionTik source ZIP archive...")
  const zip = new JSZip()

  addDirectoryToZip(zip, rootDir, rootDir)

  console.log("⏳ Compressing files...")
  const buffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  })

  fs.writeFileSync(outputZipPath, buffer)
  const sizeMb = (buffer.length / (1024 * 1024)).toFixed(2)
  console.log(`✅ Success! Created clean ZIP archive: ${outputZipPath} (${sizeMb} MB)`)
  console.log("ℹ️ Excluded: node_modules, .next, .git, .env.local (keeps zip lightweight & secure)")
}

createZip().catch((err) => {
  console.error("❌ Error creating zip:", err)
  process.exit(1)
})
