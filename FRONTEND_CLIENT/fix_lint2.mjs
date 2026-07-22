import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replaceInFile = (filePath, searchPattern, replacement) => {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    const content = fs.readFileSync(fullPath, 'utf8');
    const newContent = typeof searchPattern === 'function' ? searchPattern(content) : content.replace(searchPattern, replacement);
    if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated ${filePath}`);
    }
};

// Revert _error back to error globally
const allJsxFiles = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(allJsxFiles(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
};

allJsxFiles(path.join(__dirname, 'src')).forEach(file => {
    replaceInFile(file.replace(__dirname + '/', ''), /catch \(_error\)/g, 'catch (error)');
});

// Remove unused useCurrency import
replaceInFile('src/admin/pages/AdminPromos.jsx', /import { useCurrency } from '..\/..\/context\/CurrencyContext';\n/g, '');
replaceInFile('src/admin/pages/Dashboard.jsx', /import { useCurrency } from '..\/..\/context\/CurrencyContext';\n/g, '');
replaceInFile('src/admin/pages/EditProduct.jsx', /import { useCurrency } from '..\/..\/context\/CurrencyContext';\n/g, '');
replaceInFile('src/admin/pages/ManageBanners.jsx', /import { useCurrency } from '..\/..\/context\/CurrencyContext';\n/g, '');
replaceInFile('src/components/Navbar.jsx', /import { useCurrency } from '\.\.\/context\/CurrencyContext';\n/g, '');
replaceInFile('src/pages/Products.jsx', /import { useCurrency } from '\.\.\/context\/CurrencyContext';\n/g, '');
replaceInFile('src/admin/pages/AdminOrders.jsx', /import { useCurrency } from '..\/..\/context\/CurrencyContext';\n/g, '');

// AuthContext token unused
replaceInFile('src/context/AuthContext.jsx', /const token = localStorage\.getItem\('token'\);\n/g, '');

// Home
replaceInFile('src/pages/Home.jsx', /const { user } = useContext\(AuthContext\);\n/g, '');
replaceInFile('src/pages/Home.jsx', /const \{\s*\} = useContext\(AuthContext\);\n/g, '');

// Products
replaceInFile('src/pages/Products.jsx', /const filterRef = useRef\(null\);\n/g, '');

console.log("Done");
