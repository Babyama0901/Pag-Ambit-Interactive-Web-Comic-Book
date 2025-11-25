import re

# Read the file
with open('src/components/Book.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove margin from MediaPage (change p-4 to p-0)
content = content.replace(
    'className="relative w-full h-full group overflow-hidden bg-white flex items-center justify-center p-4"',
    'className="relative w-full h-full group overflow-hidden bg-white flex items-center justify-center p-0"'
)

# 2. Remove image scale
content = content.replace(
    "style={{ transform: 'scale(1.03)' }}",
    ''
)

# 3. Replace pages array with all 33 pages
old_pages_array = '''  const pages = [
    { type: 'toc' },
    { type: 'blank' },
    { src: 'Layout/SCENE 1/SCENE 1 - PAGE 1.png', alt: 'Scene 1 Page 1' },
    { src: 'Layout/SCENE 1/SCENE 1 - PAGE 2.png', alt: 'Scene 1 Page 2' },
    { src: 'Layout/SCENE 1/SCENE 1 - PAGE 3.png', alt: 'Scene 1 Page 3' },
    { src: 'Layout/SCENE 2/SCENE 2 - PAGE 1.png', alt: 'Scene 2 Page 1' },
    { src: 'Layout/SCENE 2/SCENE 2 - PAGE 2.png', alt: 'Scene 2 Page 2' },
    { src: 'Layout/SCENE 2/SCENE 2 - PAGE 3.png', alt: 'Scene 2 Page 3' },
    { src: 'Layout/SCENE 2/SCENE 2 - PAGE 4.png', alt: 'Scene 2 Page 4' },
    { src: 'Layout/SCENE 2/SCENE 2 - PAGE 5.png', alt: 'Scene 2 Page 5' },
    { src: 'Layout/SCENE 2/SCENE 2 - PAGE 6.png', alt: 'Scene 2 Page 6' },
  ];'''

new_pages_array = '''  const pages = [
    { type: 'toc' },
    { type: 'blank' },
    { src: 'Layout/SCENE 1 - PAGE 1.png', alt: 'Scene 1 Page 1' },
    { src: 'Layout/SCENE 1 - PAGE 2.png', alt: 'Scene 1 Page 2' },
    { src: 'Layout/SCENE 1 - PAGE 3.png', alt: 'Scene 1 Page 3' },
    { src: 'Layout/SCENE 2 - PAGE 4.png', alt: 'Scene 2 Page 4' },
    { src: 'Layout/SCENE 2 - PAGE 5.png', alt: 'Scene 2 Page 5' },
    { src: 'Layout/SCENE 2 - PAGE 6.png', alt: 'Scene 2 Page 6' },
    { src: 'Layout/SCENE 2 - PAGE 7.png', alt: 'Scene 2 Page 7' },
    { src: 'Layout/SCENE 2 - PAGE 8.png', alt: 'Scene 2 Page 8' },
    { src: 'Layout/SCENE 3 - PAGE 9.png', alt: 'Scene 3 Page 9' },
    { src: 'Layout/SCENE 3 - PAGE 10.png', alt: 'Scene 3 Page 10' },
    { src: 'Layout/SCENE 3 - PAGE 11.png', alt: 'Scene 3 Page 11' },
    { src: 'Layout/SCENE 3 - PAGE 12.png', alt: 'Scene 3 Page 12' },
    { src: 'Layout/SCENE 4 - PAGE 13.png', alt: 'Scene 4 Page 13' },
    { src: 'Layout/SCENE 4 - PAGE 14.png', alt: 'Scene 4 Page 14' },
    { src: 'Layout/SCENE 4 - PAGE 15.png', alt: 'Scene 4 Page 15' },
    { src: 'Layout/SCENE 4 - PAGE 16.png', alt: 'Scene 4 Page 16' },
    { src: 'Layout/SCENE 5 - PAGE 17.png', alt: 'Scene 5 Page 17' },
    { src: 'Layout/SCENE 5 - PAGE 18.png', alt: 'Scene 5 Page 18' },
    { src: 'Layout/SCENE 5 - PAGE 19.png', alt: 'Scene 5 Page 19' },
    { src: 'Layout/SCENE 5 - PAGE 20.png', alt: 'Scene 5 Page 20' },
    { src: 'Layout/SCENE 5 - PAGE 21.png', alt: 'Scene 5 Page 21' },
    { src: 'Layout/SCENE 6 - PAGE 22.png', alt: 'Scene 6 Page 22' },
    { src: 'Layout/SCENE 6 - PAGE 23.png', alt: 'Scene 6 Page 23' },
    { src: 'Layout/SCENE 7 - PAGE 24.png', alt: 'Scene 7 Page 24' },
    { src: 'Layout/SCENE 7 - PAGE 25.png', alt: 'Scene 7 Page 25' },
    { src: 'Layout/SCENE 8 - PAGE 26.png', alt: 'Scene 8 Page 26' },
    { src: 'Layout/SCENE 8 - PAGE 27.png', alt: 'Scene 8 Page 27' },
    { src: 'Layout/SCENE 9 - PAGE 28.png', alt: 'Scene 9 Page 28' },
    { src: 'Layout/SCENE 9 - PAGE 29.png', alt: 'Scene 9 Page 29' },
    { src: 'Layout/SCENE 10 - PAGE 30.png', alt: 'Scene 10 Page 30' },
    { src: 'Layout/SCENE 11 - PAGE 31.png', alt: 'Scene 11 Page 31' },
    { src: 'Layout/SCENE 11 - PAGE 32.png', alt: 'Scene 11 Page 32' },
    { src: 'Layout/SCENE 11 - PAGE 33.png', alt: 'Scene 11 Page 33' },
  ];'''

content = content.replace(old_pages_array, new_pages_array)

# 4. Add animation settings to HTMLFlipBook
old_flip_book = '''        <HTMLFlipBook
          width={450}
          height={636}
          size="fixed"
          minWidth={318}
          maxWidth={595}
          minHeight={450}
          maxHeight={842}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          usePortrait={false}
          className="shadow-2xl"
          ref={bookRef}
          onFlip={handleFlip}
        >'''

new_flip_book = '''        <HTMLFlipBook
          width={450}
          height={636}
          size="fixed"
          minWidth={318}
          maxWidth={595}
          minHeight={450}
          maxHeight={842}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          usePortrait={false}
          className="shadow-2xl"
          ref={bookRef}
          onFlip={handleFlip}
          flippingTime={1000}
          autoSize={false}
          drawShadow={true}
          useMouseEvents={true}
        >'''

content = content.replace(old_flip_book, new_flip_book)

# Write the file back
with open('src/components/Book.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Book.jsx updated successfully!")
print("Changes made:")
print("- Removed margins (p-4 -> p-0)")
print("- Removed image scale transform")
print("- Updated pages array with all 33 images")
print("- Added page-turn animation settings")
