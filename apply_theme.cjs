const fs = require('fs');
const path = require('path');

const mapColors = (content) => {
    let newContent = content;

    // Backgrounds and Surfaces
    newContent = newContent.replace(/bg-\[\#FBFBFB\]/g, 'bg-graphite');
    newContent = newContent.replace(/bg-\[\#FAFAFA\]/g, 'bg-[#333333]');
    newContent = newContent.replace(/bg-white/g, 'bg-[#333333]');
    newContent = newContent.replace(/bg-zinc-50\/50/g, 'bg-[#222222]/50');
    newContent = newContent.replace(/bg-zinc-50/g, 'bg-[#222222]');
    newContent = newContent.replace(/hover:bg-zinc-50/g, 'hover:bg-[#404040]');
    
    newContent = newContent.replace(/bg-zinc-900/g, 'bg-ochre');
    newContent = newContent.replace(/hover:bg-zinc-900/g, 'hover:bg-ochre');
    newContent = newContent.replace(/group-hover:bg-zinc-900/g, 'group-hover:bg-ochre');
    newContent = newContent.replace(/bg-zinc-800/g, 'bg-earth');
    newContent = newContent.replace(/hover:bg-zinc-800/g, 'hover:bg-earth');

    // Text Colors
    // Note: Don't replace text-white! Keep it legible.
    newContent = newContent.replace(/text-zinc-900/g, 'text-sandy');
    newContent = newContent.replace(/hover:text-zinc-900/g, 'hover:text-sandy');
    newContent = newContent.replace(/group-hover:text-zinc-900/g, 'group-hover:text-sandy');
    
    newContent = newContent.replace(/text-zinc-600/g, 'text-sandy/90');
    newContent = newContent.replace(/text-zinc-500/g, 'text-sandy/80');
    newContent = newContent.replace(/group-hover:text-zinc-500/g, 'group-hover:text-sandy/80');
    newContent = newContent.replace(/text-zinc-400/g, 'text-sandy/70');
    newContent = newContent.replace(/hover:text-zinc-400/g, 'hover:text-sandy/70');
    newContent = newContent.replace(/text-zinc-300/g, 'text-sandy/50');
    
    // Border Colors
    newContent = newContent.replace(/border-zinc-100/g, 'border-earth/30');
    newContent = newContent.replace(/border-zinc-200/g, 'border-earth/50');
    
    // Shadows
    newContent = newContent.replace(/shadow-zinc-900\/5/g, 'shadow-black/40');
    newContent = newContent.replace(/shadow-zinc-900\/10/g, 'shadow-black/50');
    newContent = newContent.replace(/shadow-zinc-900\/20/g, 'shadow-black/60');
    
    // Some layout specific ones:
    newContent = newContent.replace(/bg-white\/80/g, 'bg-[#333333]/80'); // Sidebar
    newContent = newContent.replace(/bg-white\/10/g, 'bg-[#222222]/80'); 

    return newContent;
};

const processFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const updated = mapColors(content);
        if (content !== updated) {
            fs.writeFileSync(filePath, updated);
            console.log(`Updated ${path.basename(filePath)}`);
        }
    } else {
        console.log(`Not found: ${filePath}`);
    }
};

const filesToProcess = [
    'src/pages/seeker/JobDetailPage.jsx',
    'src/pages/seeker/JobFeedPage.jsx',
    'src/components/Layout/Sidebar.jsx',
    'src/components/Layout/Navbar.jsx',
    'src/components/Layout/AppShell.jsx'
];

filesToProcess.forEach(f => processFile(path.join(__dirname, f)));
