import fs from 'fs';

const csv = fs.readFileSync('final_wedding_seating_chart.csv', 'utf8');
const lines = csv.split('\n').filter(l => l.trim().length > 0);
const headers = lines[0].split(',');

const guests = [];
for (let i = 1; i < lines.length; i++) {
  // Simple CSV parse since there are no commas in the data except possibly inside quotes, but looking at data, no quotes.
  // Wait, there are commas in data? 
  // Table Number,Table Name,First Name,Last Name
  // Sweetheart Table,Lovers' Table,Isaac,Dobson
  // 1,Farm Table 1 (Bride's Special Group),Shormi,Kar
  // It has parentheses, no commas in values.
  const parts = lines[i].split(',');
  if (parts.length >= 4) {
    guests.push({
      tableNumber: parts[0].trim(),
      tableName: parts[1].trim().replace(/\s*\(.*\)\s*/, ''),
      firstName: parts[2].trim(),
      lastName: parts[3].trim()
    });
  }
}

const tsContent = `export interface Guest {
  tableNumber: string;
  tableName: string;
  firstName: string;
  lastName: string;
}

export const guests: Guest[] = ${JSON.stringify(guests, null, 2)};
`;

fs.mkdirSync('src', { recursive: true });
fs.writeFileSync('src/data.ts', tsContent);
console.log('src/data.ts generated');
