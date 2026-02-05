import requests
from bs4 import BeautifulSoup
import json
import os
import re
import time
from pathlib import Path
from datetime import datetime

# Create output directory on desktop
desktop = Path.home() / "Desktop" / "code tunisie"
desktop.mkdir(parents=True, exist_ok=True)

base_url = "https://9anoun.tn/kb/codes/code-route/code-route-article-"
i = 1
all_articles = []

while True:
    url = f"{base_url}{i}"
    print(f"Fetching article {i}...")
    
    try:
        r = requests.get(url, timeout=15, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        if r.status_code == 404:
            print(f"✓ Reached end at article {i-1}")
            break
            
        if r.status_code != 200:
            print(f"⚠ Error {r.status_code} for article {i}")
            i += 1
            time.sleep(1)
            continue
        
        soup = BeautifulSoup(r.content, 'html.parser')
        
        # Extract title
        title_elem = soup.find('h1', class_='yd nH bM Pq kr')
        title = title_elem.get_text(strip=True) if title_elem else f"Article {i}"
        
        # Extract content with better formatting
        content_elem = soup.find('div', class_='zd Kc Zq Ru nk')
        if content_elem:
            # Get text with preserved structure
            content_raw = content_elem.get_text(separator='\n', strip=True)
            content = content_raw.strip()
            
            # Try to parse structured definitions
            definitions = []
            # Match patterns like "word": definition or "word" : definition
            pattern = r'"([^"]+)"\s*:\s*([^"]+?)(?=\s*"[^"]+"\s*:|$)'
            matches = re.findall(pattern, content, re.DOTALL)
            if matches:
                definitions = [{"term": term.strip(), "definition": defn.strip()} 
                             for term, defn in matches]
        else:
            content = ""
            definitions = []
        
        # Extract document name
        doc_name_elem = soup.find('h2', class_='ar zs')
        doc_name = doc_name_elem.get_text(strip=True) if doc_name_elem else "مجلة الطرقات"
        
        # Extract meta description
        meta_desc = soup.find('meta', {'name': 'description'})
        description = meta_desc.get('content', '').strip() if meta_desc else ""
        
        # Extract page title
        page_title = soup.find('title')
        full_title = page_title.get_text(strip=True) if page_title else ""
        
        # Try to find related articles links
        related_articles = []
        article_links = soup.find_all('a', href=re.compile(r'/code-route-article-\d+'))
        for link in article_links[:10]:  # Get first 10
            href = link.get('href', '')
            text = link.get_text(strip=True)
            if href and text and href != url:
                related_articles.append({
                    'title': text[:100],  # Limit length
                    'url': href if href.startswith('http') else f"https://9anoun.tn{href}"
                })
        
        # Create enhanced article data
        article_data = {
            'article_number': i,
            'title': title,
            'document_name': doc_name,
            'page_title': full_title,
            'description': description,
            'content': content,
            'definitions': definitions if definitions else None,
            'content_length': len(content),
            'has_structured_data': len(definitions) > 0,
            'related_articles': related_articles[:5] if related_articles else [],
            'url': url,
            'scraped_at': datetime.now().isoformat(),
            'language': 'ar'
        }
        
        # Save individual file
        filename = f"article_{i:03d}_{title.replace('/', '-').replace(':', '')[:30]}.json"
        filepath = desktop / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(article_data, f, ensure_ascii=False, indent=2)
        
        all_articles.append(article_data)
        print(f"✓ Saved: {filename} ({len(content)} chars, {len(definitions)} definitions)")
        
        # Be respectful - small delay between requests
        time.sleep(0.5)
        
    except requests.exceptions.RequestException as e:
        print(f"⚠ Network error on article {i}: {e}")
        time.sleep(2)
    except Exception as e:
        print(f"⚠ Error on article {i}: {e}")
    
    i += 1

# Save complete collection
collection_file = desktop / "complete_collection.json"
with open(collection_file, 'w', encoding='utf-8') as f:
    json.dump({
        'total_articles': len(all_articles),
        'scraped_at': datetime.now().isoformat(),
        'source': 'https://9anoun.tn/kb/codes/code-route',
        'articles': all_articles
    }, f, ensure_ascii=False, indent=2)

print(f"\n✓ Done! Scraped {i-1} articles to {desktop}")
print(f"✓ Complete collection saved to: complete_collection.json")