from pydantic import BaseModel


class ShoppingListItemResponse(BaseModel):
    ingredient_id: int
    ingredient_name: str
    unit: str
    required_quantity: float
    available_quantity: float
    final_quantity_to_buy: float
