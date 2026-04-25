const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const findFiles = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findFiles(filePath, fileList);
        } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
            fileList.push(filePath);
        }
    }
    return fileList;
};

const processFiles = () => {
    const files = findFiles(srcDir);
    let updatedCount = 0;

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Check if file has ₹ symbol
        if (content.includes('₹')) {
            // Need to import useCurrency
            // Find the last import statement
            if (!content.includes('useCurrency')) {
                const importRegex = /import.*from.*;?\n/g;
                let lastImportIndex = 0;
                let match;
                while ((match = importRegex.exec(content)) !== null) {
                    lastImportIndex = match.index + match[0].length;
                }

                // Determine relative path to CurrencyContext
                const depth = file.replace(srcDir, '').split(path.sep).length - 2;
                const relativePrefix = depth <= 0 ? './' : '../'.repeat(depth);
                const importStmt = `import { useCurrency } from '${relativePrefix}context/CurrencyContext';\n`;
                
                content = content.slice(0, lastImportIndex) + importStmt + content.slice(lastImportIndex);
            }

            // Need to insert `const { formatPrice } = useCurrency();` at the beginning of the component
            // We'll look for component declarations like `const ComponentName = (...) => {` or `function ComponentName(...) {`
            const componentRegex = /(const \w+ = \([^)]*\)\s*=>\s*{|function \w+\([^)]*\)\s*{)/g;
            
            // We'll just replace the first match we find that looks like a React component
            // to inject the hook
            let match = componentRegex.exec(content);
            if (match && !content.includes('const { formatPrice }')) {
                const insertPos = match.index + match[0].length;
                content = content.slice(0, insertPos) + '\n    const { formatPrice } = useCurrency();\n' + content.slice(insertPos);
            }

            // Now replace all ₹ variations
            // ₹${item.price.toLocaleString()} -> ${formatPrice(item.price)}
            // ₹{item.price.toLocaleString()} -> {formatPrice(item.price)}
            // ₹{cartTotal.toLocaleString()} -> {formatPrice(cartTotal)}
            // ₹${(item.price * item.qty).toLocaleString()} -> ${formatPrice(item.price * item.qty)}
            
            // Regex to match ₹${...toLocaleString()} or ₹{...toLocaleString()}
            content = content.replace(/₹\$\{(.*?)\.toLocaleString\(\)\}/g, '${formatPrice($1)}');
            content = content.replace(/₹\{(.*?)\.toLocaleString\(\)\}/g, '{formatPrice($1)}');
            
            // Sometimes it's just ₹500
            content = content.replace(/₹(\d+(?:,\d+)?)/g, '{formatPrice($1)}');

            fs.writeFileSync(file, content, 'utf8');
            updatedCount++;
            console.log('Updated:', file);
        }
    }
    console.log(`Updated ${updatedCount} files.`);
};

processFiles();
