from bs4 import BeautifulSoup

def check_images_alt(soup: BeautifulSoup) -> list:
    issues = []
    for img in soup.find_all('img'):
        src, data_src = img.get('src'), img.get('data-src')
        if not src and not data_src: continue
        if img.find_parent('noscript') or img.get('role') == 'presentation' or img.get('aria-hidden') == 'true': continue
        if img.get('width') in ['0', '1'] and img.get('height') in ['0', '1']: continue
        if not img.get('alt') or img.get('alt').strip() == "":
            issues.append({
                "rule": "missing_alt_text",
                "line": img.sourceline if hasattr(img, 'sourceline') else None,
                "element": str(img),
                "impact": "critico",
                "disabilities_affected": ["visual", "cognitiva"],
                "description": "Imagem sem texto alternativo (atributo 'alt')."
            })
    return issues

def check_form_labels(soup: BeautifulSoup) -> list:
    issues = []
    for field in soup.find_all(['input', 'textarea', 'select']):
        if field.get('type') in ['hidden', 'submit', 'button', 'image']: continue
        
        field_id = field.get('id')
        has_label = any([
            field_id and soup.find('label', attrs={'for': field_id}),
            field.find_parent('label'),
            field.get('aria-label'),
            field.get('aria-labelledby')
        ])
        if not has_label:
            issues.append({
                "rule": "missing_form_label",
                "line": field.sourceline if hasattr(field, 'sourceline') else None,
                "element": str(field),
                "impact": "critico",
                "disabilities_affected": ["visual", "motora", "cognitiva"],
                "description": "Campo de formulário sem rótulo (label)."
            })
    return issues

def check_headings_hierarchy(soup: BeautifulSoup) -> list:
    issues = []
    previous_level = 0
    for h in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
        current_level = int(h.name[1])
        if previous_level > 0 and (current_level - previous_level > 1):
            issues.append({
                "rule": "skipped_heading_level",
                "line": h.sourceline if hasattr(h, 'sourceline') else None,
                "element": str(h),
                "impact": "medio",
                "disabilities_affected": ["visual", "cognitiva"],
                "description": f"Salto incorreto na hierarquia (de h{previous_level} para h{current_level})."
            })
        previous_level = current_level
    return issues

def check_language_attribute(soup: BeautifulSoup) -> list:
    issues = []
    html_tag = soup.find('html')
    if not html_tag or not html_tag.get('lang'):
        issues.append({
            "rule": "missing_lang_attribute",
            "line": html_tag.sourceline if html_tag and hasattr(html_tag, 'sourceline') else None,
            "element": str(html_tag) if html_tag else "<html>",
            "impact": "critico",
            "disabilities_affected": ["visual", "auditiva", "cognitiva"],
            "description": "Atributo 'lang' ausente ou vazio na tag <html>. Isso afeta leitores de tela e tradutores."
        })
    return issues

def check_link_purpose(soup: BeautifulSoup) -> list:
    issues = []
    for a_tag in soup.find_all('a', href=True):
        if not a_tag.get_text(strip=True) and not a_tag.get('aria-label') and not a_tag.get('title'):
            issues.append({
                "rule": "link_without_discernible_text",
                "line": a_tag.sourceline if hasattr(a_tag, 'sourceline') else None,
                "element": str(a_tag),
                "impact": "critico",
                "disabilities_affected": ["visual", "cognitiva"],
                "description": "Link sem texto discernível, 'aria-label' ou 'title'. Leitores de tela não conseguirão descrever o propósito do link."
            })
    return issues

def check_skip_links(soup: BeautifulSoup) -> list:
    issues = []
    skip_link_found = False
    for a_tag in soup.find_all('a', href=True):
        link_text = a_tag.get_text(strip=True).lower()
        if 'pular para' in link_text or 'skip to' in link_text or 'conteúdo principal' in link_text or 'main content' in link_text:
            skip_link_found = True
            break
    
    if not skip_link_found:
        issues.append({
            "rule": "missing_skip_link",
            "line": None,
            "element": "body",
            "impact": "medio",
            "disabilities_affected": ["motora", "visual"],
            "description": "Link 'pular para o conteúdo principal' não encontrado. Usuários de teclado e leitores de tela podem ter dificuldade em navegar por blocos repetitivos."
        })
    return issues

def check_tabindex_usage(soup: BeautifulSoup) -> list:
    issues = []
    for element in soup.find_all(tabindex=True):
        try:
            tabindex_value = int(element['tabindex'])
            if tabindex_value > 0:
                issues.append({
                    "rule": "tabindex_greater_than_zero",
                    "line": element.sourceline if hasattr(element, 'sourceline') else None,
                    "element": str(element),
                    "impact": "critico",
                    "disabilities_affected": ["motora", "visual"],
                    "description": "Elemento com tabindex maior que zero. Isso pode causar uma ordem de foco não lógica e dificultar a navegação por teclado."
                })
        except ValueError:
            issues.append({
                "rule": "invalid_tabindex_value",
                "line": element.sourceline if hasattr(element, 'sourceline') else None,
                "element": str(element),
                "impact": "critico",
                "disabilities_affected": ["motora", "visual"],
                "description": "Elemento com valor de tabindex inválido (não numérico)."
            })
    return issues

def check_button_names(soup: BeautifulSoup) -> list:
    issues = []
    for button in soup.find_all('button'):
        if not button.get_text(strip=True) and not button.get('aria-label') and not button.get('title'):
            issues.append({
                "rule": "button_without_accessible_name",
                "line": button.sourceline if hasattr(button, 'sourceline') else None,
                "element": str(button),
                "impact": "critico",
                "disabilities_affected": ["visual", "cognitiva"],
                "description": "Botão sem nome acessível (texto, aria-label ou title). Leitores de tela não conseguirão identificar a função do botão."
            })
    return issues

def check_table_headers(soup: BeautifulSoup) -> list:
    issues = []
    for table in soup.find_all('table'):
        has_th = table.find('th')
        if not has_th:
            issues.append({
                "rule": "table_without_headers",
                "line": table.sourceline if hasattr(table, 'sourceline') else None,
                "element": str(table),
                "impact": "critico",
                "disabilities_affected": ["visual", "cognitiva"],
                "description": "Tabela sem cabeçalhos (<th>). Leitores de tela podem ter dificuldade em interpretar a estrutura da tabela."
            })
        else:
            for th in table.find_all('th'):
                if not th.get('scope'):
                    issues.append({
                        "rule": "table_header_without_scope",
                        "line": th.sourceline if hasattr(th, 'sourceline') else None,
                        "element": str(th),
                        "impact": "medio",
                        "disabilities_affected": ["visual", "cognitiva"],
                        "description": "Cabeçalho de tabela (<th>) sem atributo 'scope'. Isso pode dificultar a associação de células de dados aos seus cabeçalhos correspondentes."
                    })
    return issues

def check_page_title(soup: BeautifulSoup) -> list:
    issues = []
    title_tag = soup.find('title')
    if not title_tag or not title_tag.get_text(strip=True):
        issues.append({
            "rule": "missing_or_empty_title",
            "line": title_tag.sourceline if title_tag and hasattr(title_tag, 'sourceline') else None,
            "element": str(title_tag) if title_tag else "<head>",
            "impact": "critico",
            "disabilities_affected": ["visual", "cognitiva"],
            "description": "A página não possui a tag <title> ou ela está vazia. O título é essencial para a orientação do usuário."
        })
    return issues

def check_iframe_titles(soup: BeautifulSoup) -> list:
    issues = []
    for iframe in soup.find_all('iframe'):
        if not iframe.get('title') or iframe.get('title').strip() == "":
            issues.append({
                "rule": "iframe_missing_title",
                "line": iframe.sourceline if hasattr(iframe, 'sourceline') else None,
                "element": str(iframe),
                "impact": "critico",
                "disabilities_affected": ["visual"],
                "description": "Elemento <iframe> sem atributo 'title'. Leitores de tela não conseguirão descrever o conteúdo do quadro."
            })
    return issues

def check_viewport_zoom_disabled(soup: BeautifulSoup) -> list:
    issues = []
    viewport = soup.find('meta', attrs={'name': 'viewport'})
    if viewport:
        content = viewport.get('content', '').lower()
        if 'user-scalable=no' in content or 'maximum-scale=1' in content:
            issues.append({
                "rule": "viewport_zoom_disabled",
                "line": viewport.sourceline if hasattr(viewport, 'sourceline') else None,
                "element": str(viewport),
                "impact": "critico",
                "disabilities_affected": ["visual"],
                "description": "A meta tag viewport impede o zoom ('user-scalable=no' ou 'maximum-scale=1'), prejudicando usuários com baixa visão."
            })
    return issues

def check_obsolete_tags(soup: BeautifulSoup) -> list:
    issues = []
    for tag in soup.find_all(['marquee', 'blink']):
        issues.append({
            "rule": "obsolete_animated_tags",
            "line": tag.sourceline if hasattr(tag, 'sourceline') else None,
            "element": str(tag),
            "impact": "critico",
            "disabilities_affected": ["cognitiva", "visual"],
            "description": f"Uso de tag obsoleta e prejudicial (<{tag.name}>). Elementos que piscam ou se movem automaticamente desorientam os usuários e podem causar convulsões."
        })
    return issues

def check_autofocus(soup: BeautifulSoup) -> list:
    issues = []
    for element in soup.find_all(attrs={"autofocus": True}):
        issues.append({
            "rule": "autofocus_usage",
            "line": element.sourceline if hasattr(element, 'sourceline') else None,
            "element": str(element),
            "impact": "medio",
            "disabilities_affected": ["visual", "motora"],
            "description": "Uso do atributo 'autofocus'. Isso altera o contexto inesperadamente ao carregar a página, desorientando usuários de leitores de tela e de navegação por teclado."
        })
    return issues

def analyze_accessibility(soup: BeautifulSoup) -> list:
    all_issues = []
    
    all_issues.extend(check_images_alt(soup))
    all_issues.extend(check_form_labels(soup))
    all_issues.extend(check_headings_hierarchy(soup))
    all_issues.extend(check_language_attribute(soup))
    all_issues.extend(check_link_purpose(soup))
    all_issues.extend(check_skip_links(soup))
    all_issues.extend(check_tabindex_usage(soup))
    all_issues.extend(check_button_names(soup))
    all_issues.extend(check_table_headers(soup))
    all_issues.extend(check_page_title(soup))
    all_issues.extend(check_iframe_titles(soup))
    all_issues.extend(check_viewport_zoom_disabled(soup))
    all_issues.extend(check_obsolete_tags(soup))
    all_issues.extend(check_autofocus(soup))
    
    return all_issues