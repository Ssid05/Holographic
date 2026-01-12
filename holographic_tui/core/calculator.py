import ast
import operator
from typing import Any, Dict

# Safe evaluation of basic arithmetic expressions.

_ALLOWED_NODES = {
    ast.Expression,
    ast.BinOp,
    ast.UnaryOp,
    ast.Num,
    ast.Load,
    ast.Add,
    ast.Sub,
    ast.Mult,
    ast.Div,
    ast.Pow,
    ast.Mod,
    ast.USub,
    ast.UAdd,
    ast.Constant,
}

_OPERATORS: Dict[type, Any] = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.Mod: operator.mod,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}


def _eval(node: ast.AST) -> float:
    if type(node) not in _ALLOWED_NODES:
        raise ValueError("Unsupported expression")
    if isinstance(node, ast.Expression):
        return _eval(node.body)
    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return float(node.value)
        raise ValueError("Constants must be numeric")
    if isinstance(node, ast.Num):  # pragma: no cover
        return float(node.n)
    if isinstance(node, ast.UnaryOp):
        op_func = _OPERATORS[type(node.op)]
        return op_func(_eval(node.operand))
    if isinstance(node, ast.BinOp):
        op_func = _OPERATORS[type(node.op)]
        return op_func(_eval(node.left), _eval(node.right))
    raise ValueError("Unsupported expression")


def evaluate(expression: str) -> str:
    try:
        tree = ast.parse(expression, mode="eval")
        result = _eval(tree)
        return str(result)
    except Exception as exc:  # noqa: BLE001
        return f"Error: {exc}"
