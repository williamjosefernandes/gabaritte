import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseSyllabusText(text: string): string[] {
  if (!text) return [];

  // 1. Normalize text: remove excessive spaces and newlines
  const normalized = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  
  // 2. Check if the text follows a numbered pattern like "1. Topic 2. Topic"
  // We look for a number, a dot, and a space (\b\d+\.\s)
  const numberPattern = /\b\d+\.\s+/g;
  
  if (numberPattern.test(normalized)) {
    // Split by the number pattern
    // Note: splitting will remove the delimiter. 
    // If the text starts with "1. ", the first element might be empty.
    const parts = normalized.split(numberPattern);
    
    return parts
      .map(p => p.trim().replace(/[.;]+$/, "")) // Remove trailing punctuation (., ;)
      .filter(p => p.length > 1); // Filter out empty strings or single chars
  }
  
  // 3. Fallback: If no numbers, try splitting by newlines or semicolons
  // If the input was multiline originally, we might have lost it with replace above.
  // Let's use the original text for fallback split.
  return text
    .split(/[\n;]/)
    .map(p => p.trim().replace(/^\d+\.?\s*/, "").replace(/[.;]+$/, "")) // Clean start numbers and end punctuation
    .filter(p => p.length > 1);
}

export function parseCSV(csvText: string): string[] {
  if (!csvText) return [];
  
  // Simple CSV parser: assumes one topic per line, or comma separated values
  const lines = csvText.split(/\r?\n/);
  
  const topics: string[] = [];
  
  lines.forEach(line => {
    if (!line.trim()) return;
    
    // Split by comma if present, otherwise take the whole line
    const parts = line.split(',');
    
    parts.forEach(part => {
      const topic = part.trim();
      if (topic && topic.length > 1) {
        topics.push(topic);
      }
    });
  });
  
  return topics;
}
