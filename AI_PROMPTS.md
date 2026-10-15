# AI_PROMPTS.md — Atomic Template & Schema Explorer

## 1. Validate a payload

```
Using validateAgainstSchema from this repo, check this attribute object
against [SCHEMA]. List per-field failures with human-readable messages.
Do not invent format types.
```

## 2. Extend known formats carefully

```
Propose adding format "[NAME]" to KNOWN_FORMATS only if it is documented
for AtomicAssets. Update describeFormat and validateAttributeValue.
If the format is not standard, recommend documenting it as custom instead.
```

## 3. Wire live API

```
Add a read-only loader for schemas/templates from the AtomicAssets API
for collection [NAME]. Keep explorer read-only; handle not-found calmly.
```

---

*Pixel Journey AI collaboration toolkit.*
