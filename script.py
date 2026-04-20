import re

with open('src/pages/seeker/ProfilePage.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Instead of complex AST parsing, let's just do targeted string replacements
# 1. Main wrapper replacement
code = code.replace(
    '<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">',
    '<div className="space-y-8">'
)

# 2. Identity block starts
code = code.replace(
    '{/* Left Column: Basic Info */}\n                <div className="lg:col-span-1 space-y-8">',
    '{/* Row 1: Identity & Contact */}\n                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">\n                    <div className="lg:col-span-2">'
)
# Close Identity block inside the new lg:col-span-2, before Quick Stats
code = code.replace(
    '{/* Quick Stats - Low Contrast Tiles */}',
    '</div>\n                    {/* Quick Stats - Low Contrast Tiles */}'
)
# Wrap the whole Row 1 grid (after contact cards)
code = code.replace(
    '''                        </div>
                    </div>
                </div>

                {/* Right Column: Questionnaire (Skills & Interests) */}
                <div className="lg:col-span-2 space-y-6">''',
    '''                        </div>
                    </div>
                </div>

                {/* Alerts (Moved to flow naturally) */}'''
)

# 3. Create Row 2: Skills & Work Pref wrapper
code = code.replace(
    '{/* Skills Selection */}',
    '<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">\n                    {/* Skills Selection */}'
)
code = code.replace(
    '{/* Professional Experience Section */}',
    '</div>\n\n                    {/* Professional Experience Section */}'
)

# 4. Create Row 3: Career Goals & Aspirations wrapper
code = code.replace(
    '{/* Trajectory / Ambitions */}',
    '<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">\n                    {/* Trajectory / Ambitions */}'
)
code = code.replace(
    '{/* Data Payload (Resume) */}',
    '</div>\n\n                    {/* Data Payload (Resume) */}'
)

# 5. Fix Quick stat styling to match the new heights
code = code.replace(
    '<div className="p-8 bg-black text-white rounded-[32px] shadow-2xl shadow-black/10 relative overflow-hidden group">',
    '<div className="p-8 bg-black text-white rounded-[32px] shadow-2xl shadow-black/10 relative overflow-hidden group h-full flex flex-col justify-center">'
)
code = code.replace(
    '<div className="p-8 bg-white border border-zinc-50 rounded-[32px] shadow-sm">',
    '<div className="p-8 bg-white border border-zinc-50 rounded-[32px] shadow-sm h-full flex flex-col justify-center">'
)
code = code.replace(
    '''{/* Quick Stats - Low Contrast Tiles */}
                    <div className="space-y-4">''',
    '''{/* Quick Stats - Low Contrast Tiles */}
                    <div className="space-y-4 lg:col-span-1 h-full flex flex-col justify-between">'''
)

with open('src/pages/seeker/ProfilePage.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("ProfilePage refactored successfully.")
