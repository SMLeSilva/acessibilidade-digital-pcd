from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
import json
from typing import List

from app.db.database import get_session
from app.db.models import SiteAnalysis

router = APIRouter()

RECOMMENDATIONS_MAP = {
    "missing_alt_text": "Adicione o atributo 'alt' em todas as tags <img>. Se a imagem for puramente decorativa, use alt=\"\" vazio para que os leitores de tela a ignorem.",
    "missing_form_label": "Garanta que todo <input>, <textarea> ou <select> possua uma <label> associada via atributo 'for', ou utilize os atributos 'aria-label' / 'aria-labelledby'.",
    "skipped_heading_level": "Revise a hierarquia das tags de cabeçalho (<h1> a <h6>). Não pule níveis (ex: passar de um <h2> direto para um <h4>).",
    "missing_lang_attribute": "Adicione o atributo 'lang' na tag <html> (ex: <html lang=\"pt-BR\">) para orientar os leitores de tela e ferramentas de tradução.",
    "link_without_discernible_text": "Adicione um texto descritivo entre as tags <a>...</a> ou forneça um atributo 'aria-label' ou 'title' claro explicando o destino do link.",
    "missing_skip_link": "Implemente um link no início do <body> apontando para a âncora do conteúdo principal (ex: <a href=\"#main\">Pular para o conteúdo</a>), facilitando a navegação por teclado.",
    "tabindex_greater_than_zero": "Remova os atributos tabindex com valores maiores que 0. Deixe o fluxo natural do DOM guiar a ordem de tabulação para evitar confusões na navegação por teclado.",
    "invalid_tabindex_value": "Certifique-se de que o atributo 'tabindex' contenha apenas valores inteiros válidos, preferencialmente 0 (para tornar o elemento focável) ou -1 (para foco apenas via script).",
    "button_without_accessible_name": "Garanta que seus botões (<button>) possuam um texto visível claro ou, se forem ícones, tenham os atributos 'aria-label' ou 'title'.",
    "table_without_headers": "Estruture suas tabelas usando tags <th> para cabeçalhos de linha ou coluna, permitindo que os leitores de tela associem os dados corretamente.",
    "table_header_without_scope": "Adicione o atributo 'scope' nas tags <th> (ex: scope=\"col\" ou scope=\"row\") para definir claramente a qual conjunto de células aquele cabeçalho se refere.",
    "missing_or_empty_title": "Adicione a tag <title> dentro da seção <head> com uma descrição clara e única sobre o propósito da página atual.",
    "iframe_missing_title": "Adicione o atributo 'title' em elementos <iframe> descrevendo seu conteúdo embutido (ex: title=\"Vídeo demonstrativo\").",
    "viewport_zoom_disabled": "Remova 'user-scalable=no' ou 'maximum-scale=1' da tag meta viewport para permitir que usuários com baixa visão apliquem zoom na página."
}

@router.get("/{analysis_id}")
def get_recommendations(analysis_id: int, session: Session = Depends(get_session)):
    analysis = session.exec(select(SiteAnalysis).where(SiteAnalysis.id == analysis_id)).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Análise não encontrada."
        )
        
    issues = json.loads(analysis.issues_json)
    
    if not issues:
        return {
            "analysis_id": analysis.id,
            "url": analysis.url,
            "message": "Nenhum problema de acessibilidade encontrado! O site está excelente.",
            "recommendations": []
        }
        
    grouped_issues = {}
    for issue in issues:
        rule = issue.get("rule")
        if rule not in grouped_issues:
            grouped_issues[rule] = {
                "rule": rule,
                "impact": issue.get("impact"),
                "disabilities_affected": issue.get("disabilities_affected"),
                "occurrences": 1,
                "actionable_recommendation": RECOMMENDATIONS_MAP.get(rule, "Revise este elemento para garantir adequação às normas da WCAG.")
            }
        else:
            grouped_issues[rule]["occurrences"] += 1
            
    impact_weight = {"critico": 1, "medio": 2, "leve": 3}
    sorted_recommendations = sorted(
        grouped_issues.values(),
        key=lambda x: impact_weight.get(x["impact"], 99)
    )

    return {
        "analysis_id": analysis.id,
        "url": analysis.url,
        "total_recommendations": len(sorted_recommendations),
        "recommendations": sorted_recommendations
    }