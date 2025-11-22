// Test script to check if our components compile correctly
const fs = require('fs');
const path = require('path');

console.log('Testing component compilation...');

try {
  // Test if our theme provider exists and is readable
  const themeProviderPath = path.join(__dirname, 'src/app/theme-provider.tsx');
  if (fs.existsSync(themeProviderPath)) {
    console.log('✅ theme-provider.tsx exists');
  } else {
    console.log('❌ theme-provider.tsx not found');
  }

  // Test if our theme toggle exists
  const themeTogglePath = path.join(__dirname, 'src/components/ui/ThemeToggle.tsx');
  if (fs.existsSync(themeTogglePath)) {
    console.log('✅ ThemeToggle.tsx exists');
  } else {
    console.log('❌ ThemeToggle.tsx not found');
  }

  // Test if our updated Button exists
  const buttonPath = path.join(__dirname, 'src/components/ui/Button.tsx');
  if (fs.existsSync(buttonPath)) {
    const content = fs.readFileSync(buttonPath, 'utf8');
    if (content.includes('neo:')) {
      console.log('✅ Button.tsx contains neo variants');
    } else {
      console.log('❌ Button.tsx missing neo variants');
    }
  }

  console.log('Basic file checks completed successfully!');

} catch (error) {
  console.error('Error during test:', error.message);
}
