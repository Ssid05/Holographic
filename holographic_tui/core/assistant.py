def reply(query: str) -> str:
    query = query.strip()
    if not query:
        return "Awaiting your prompt."
    return f"Assistant stub: you asked '{query}'. (Voice/LLM integration planned in Phase 2.)"
